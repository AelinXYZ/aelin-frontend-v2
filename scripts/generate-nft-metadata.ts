// Note: Add "type": "module" to the package.json before running the script
import 'isomorphic-fetch'

import { getAddress } from '@ethersproject/address'
import cheerio from 'cheerio'
import detenv from 'dotenv'
import fs from 'fs/promises'
import puppeteer, { Browser, Page } from 'puppeteer'

import OpenSeaResponse from '../data/open-sea-response.json' assert { type: 'json' }
import QuixoticResponse from '../data/quixotic-response.json' assert { type: 'json' }

detenv.config({ path: '.env.local' })

const MAX_QUIXOTIC_ITEMS = 50
const MAX_OPENSEA_ITEMS = 100

type OpenSeaCollection = {
  node: {
    isVerified: boolean
    logo: string
    name: string
    nativePaymentAsset: { symbol: string }
    slug: string
    statsV2: {
      floorPrice: { eth: string } | null
      numOwners: number
      totalSupply: number
      totalVolume: { unit: string }
    }
  }
}

type QuixoticCollection = {
  name: string
  slug: string | null
  image_url: string
  owners: number
  supply: number
  verified: boolean
  volume: number
  floor: number | null
  address: string
}

type NFTCollections = {
  id: string
  address: string
  name: string
  slug: string | null
  imageUrl: string
  isVerified: boolean
  numOwners: number
  totalSupply: number
  floorPrice: number | null
  totalVolume: number | null
  paymentSymbol: string | null
  network: number
}

const formatGwei = (wei: number) => wei / 1e8 / 10

const withBrowser = async (fn: (browser: Browser) => void) => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-maximized'],
    defaultViewport: null,
  })

  try {
    return await fn(browser)
  } finally {
    await browser.close()
  }
}

const withPage = (browser: Browser) => async (fn: (page: Page) => void) => {
  const page = await browser.newPage()

  await page.setDefaultNavigationTimeout(0)
  await page.setRequestInterception(true)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page.on('request', async (req: any) => {
    if (
      req.resourceType() == 'stylesheet' ||
      req.resourceType() == 'font' ||
      req.resourceType() == 'image'
    ) {
      req.abort()
    } else {
      req.continue()
    }
  })

  try {
    return await fn(page)
  } finally {
    await page.close()
  }
}

const OpenSeaMetadataCollector = async () => {
  const collections = OpenSeaResponse.data.rankings.edges.slice(0, MAX_OPENSEA_ITEMS)

  const metadata = await withBrowser(async (browser) => {
    return Promise.all(
      collections.map(async (collection: OpenSeaCollection, index: number) => {
        const {
          isVerified,
          logo: imageUrl,
          name,
          nativePaymentAsset,
          slug,
          statsV2: { floorPrice, numOwners, totalSupply, totalVolume },
        } = collection.node

        return withPage(browser)(async (page) => {
          await page.goto(`https://opensea.io/collection/${slug}`)

          const pageData = await page.evaluate(() => ({
            html: document.documentElement.innerHTML,
          }))

          const $ = cheerio.load(pageData.html)

          const links = $('a[target="_blank"]')

          let address = ''
          let contractType = ''

          links.each(function (this: cheerio.Element) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: this is not undefined
            if ($(this).attr('href').includes('etherscan')) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore: this is not undefined
              address = getAddress($(this).attr('href').split('/').pop())
            }
          })

          if (address.length) {
            // We need to use this approach to avoid a forbidden code response
            await page.goto(`https://api.opensea.io/api/v1/asset_contract/${address}?format=json`)

            const pageData = await page.evaluate(() => ({
              html: document.documentElement.innerHTML,
            }))

            const $ = cheerio.load(pageData.html)

            const content = $('pre').text()

            const json = JSON.parse(content)

            contractType = json.schema_name ? json.schema_name.toLowerCase() : ''
          }

          return {
            id: index,
            address,
            name,
            slug,
            imageUrl,
            isVerified,
            numOwners,
            totalSupply,
            contractType,
            floorPrice: floorPrice !== null ? Number(floorPrice.eth) : null,
            totalVolume: totalVolume !== null ? Number(totalVolume.unit) : null,
            paymentSymbol: nativePaymentAsset !== null ? nativePaymentAsset.symbol : null,
            network: 1,
          }
        })
      }),
    )
  })

  // Filter out if collection address is not found
  const metadataFiltered = (metadata as unknown as NFTCollections[]).filter(
    (collection: { address: string }) => {
      return collection.address.length !== 0
    },
  )

  return fs.writeFile(
    `${process.cwd()}/public/data/nft-metadata/opensea-metadata.json`,
    JSON.stringify(metadataFiltered, null, 2),
    'utf8',
  )
}

const QuixoticMetadataCollector = async () => {
  const collections = QuixoticResponse.results.slice(0, MAX_QUIXOTIC_ITEMS)

  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-KEY': process.env.QUIXOTIC_API_TOKEN || '',
    },
  }

  console.log('options: ', options)

  const metadata = await Promise.all(
    collections.map(async (collection: QuixoticCollection, index: number) => {
      const {
        address,
        floor: floorPrice,
        image_url: imageUrl,
        name,
        owners: numOwners,
        slug,
        supply: totalSupply,
        verified: isVerified,
        volume: totalVolume,
      } = collection

      const response = await fetch(
        `https://api.quixotic.io/api/v1/collection/${address}/`,
        options,
      ).then((response) => response.json())

      const { contract_type } = response

      return {
        id: index,
        name,
        slug,
        imageUrl,
        address,
        isVerified,
        numOwners,
        totalSupply,
        floorPrice: floorPrice ? formatGwei(floorPrice) : null,
        totalVolume: formatGwei(totalVolume),
        contractType: contract_type ? contract_type.toLowerCase().replace('-', '') : '',
        paymentSymbol: 'ETH',
        network: 10,
      }
    }),
  )

  return fs.writeFile(
    `${process.cwd()}/public/data/nft-metadata/quixotic-metadata.json`,
    JSON.stringify(metadata, null, 2),
    'utf8',
  )
}

Promise.all([OpenSeaMetadataCollector(), QuixoticMetadataCollector()])
  .then(() => {
    console.log('Metadata has been collected successfully')
    process.exit()
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
