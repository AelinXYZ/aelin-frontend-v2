/* eslint-disable @typescript-eslint/no-var-requires */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: already addressed
const { getAddress } = require('@ethersproject/address')
const cheerio = require('cheerio')
const fs = require('fs/promises')
const puppeteer = require('puppeteer')
const { Browser, Page } = require('puppeteer')

const OpenSeaResponse = require('../data/open-sea-response.json')
const QuixoticResponse = require('../data/quixotic-response.json')

const MAX_QUIXOTIC_ITEMS = 50
const MAX_OPENSEA_ITEMS = 100

type OpenSeaCollection = {
  node: {
    isVerified: true
    logo: string
    name: string
    nativePaymentAsset: { symbol: string }
    slug: string
    statsV2: {
      floorPrice: { eth: string } | null
      numOwners: string
      totalSupply: string
      totalVolume: { unit: string }
    }
  }
}

type QuixoticCollection = {
  name: string
  slug: string
  image_url: string
  owners: number
  supply: number
  verified: boolean
  volume: number
  floor: number
  address: string
}

type NFTCollections = {
  id: string
  address: string
  name: string
  slug: string
  imageUrl: string
  isVerified: boolean
  numOwners: number
  totalSupply: number
  floorPrice: number | null
  totalVolume: number | null
  paymentSymbol: string | null
  network: number
}

const withBrowser = async (fn: (browser: typeof Browser) => void) => {
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

const withPage = (browser: typeof Browser) => async (fn: (page: typeof Page) => void) => {
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
  // Get top 100 nft collections
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

          links.each(function (this: cheerio.Element) {
            if ($(this).attr('href').includes('etherscan')) {
              address = getAddress($(this).attr('href').split('/').pop())
            }
          })

          return {
            id: index,
            address,
            name,
            slug,
            imageUrl,
            isVerified,
            numOwners,
            totalSupply,
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

const QuixoticMetadataCollector = () => {
  // Get top 50 nft collections
  const collections = QuixoticResponse.results.slice(0, MAX_QUIXOTIC_ITEMS)

  const metadata = collections.map((collection: QuixoticCollection, index: number) => {
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

    return {
      id: index,
      name,
      slug,
      imageUrl,
      address,
      isVerified,
      numOwners,
      totalSupply,
      floorPrice,
      totalVolume,
      paymentSymbol: 'ETH',
      network: 10,
    }
  })

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
