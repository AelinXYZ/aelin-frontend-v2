export interface SimpleHashRes {
  next_cursor: string
  next: string
  previous: null
  nfts: SimpleHashNft[]
}

export interface SimpleHashNft {
  nft_id: string
  chain: string
  contract_address: string
  token_id: string
  name: string
  description: null | string
  previews: Previews
  image_url: string
  image_properties: ImageProperties
  video_url: null | string
  video_properties: VideoProperties | null
  audio_url: null
  audio_properties: null
  model_url: null
  model_properties: null
  background_color: null | string
  external_url: null | string
  created_date: null | string
  status: Status
  token_count: number
  owner_count: number
  owners: Owner[]
  contract: Contract
  collection: Collection
  last_sale: null
  first_created: FirstCreated
  rarity: Rarity
  royalty: Royalty[]
  extra_metadata: ExtraMetadata
}

export interface Collection {
  collection_id: string
  name: string
  description: null | string
  image_url: string
  banner_image_url: null | string
  external_url: null | string
  twitter_username: null | string
  discord_url: null | string
  instagram_username: null
  medium_username: null
  telegram_url: null
  marketplace_pages: MarketplacePage[]
  metaplex_mint: null
  metaplex_first_verified_creator: null
  floor_prices: FloorPrice[]
  distinct_owner_count: number
  distinct_nft_count: number
  total_quantity: number
  top_contracts: string[]
}

export interface FloorPrice {
  marketplace_id: string
  marketplace_name: string
  value: number
  payment_token: PaymentToken
}

export interface PaymentToken {
  payment_token_id: string
  name: string
  symbol: string
  address: string
  decimals: number
}

export interface MarketplacePage {
  marketplace_id: string
  marketplace_name: string
  marketplace_collection_id: string
  nft_url: string
  collection_url: string
  verified: boolean
}

export interface Contract {
  type: string
  name: string
  symbol: null | string
  deployed_by: string
  deployed_via_contract: null | string
}

export interface ExtraMetadata {
  attributes: Attribute[]
  properties?: Properties | null
  image_original_url: string
  animation_original_url: null | string
  metadata_original_url: string
  traits?: any[]
  id?: string
  symbol?: string
  lastPdfCid?: string
  destination_url?: string
  tokenId?: number
  dna?: string
  edition?: number
  date?: number
  compiler?: null | string
  decimals?: number
  type?: string
  artist?: null
  token_id?: string
  ipfs_hash?: string
  supply?: string
}

export interface Attribute {
  trait_type: string
  value: string
  display_type: DisplayType | null
}

export enum DisplayType {
  BoostPercentage = 'boost_percentage',
  Date = 'date',
  Number = 'number',
}

export interface Properties {
  Creator?: string
  number?: number
  name?: string
  id?: number
  baseCardId?: number
  silverCardId?: number
  goldCardId?: number
  grade?: string
}

export interface FirstCreated {
  minted_to: null | string
  quantity: number | null
  timestamp: null | string
  block_number: number | null
  transaction: null | string
  transaction_initiator: null | string
}

export interface ImageProperties {
  width: number
  height: number
  size: number
  mime_type: MIMEType
}

export enum MIMEType {
  ImageGIF = 'image/gif',
  ImageJPEG = 'image/jpeg',
  ImagePNG = 'image/png',
  ImageWebp = 'image/webp',
}

export interface Owner {
  owner_address: string
  quantity: number
  first_acquired_date: string
  last_acquired_date: string
}

export interface Previews {
  image_small_url: string
  image_medium_url: string
  image_large_url: string
  image_opengraph_url: string
  blurhash: string
  predominant_color: string
}

export interface Rarity {
  rank: number | null
  score: number | null
  unique_attributes: number | null
}

export interface Royalty {
  total_creator_fee_basis_points: number
  source: string
}

export enum Status {
  Minted = 'minted',
}

export interface VideoProperties {
  width: number
  height: number
  duration: number
  video_coding: null | string
  audio_coding: string
  size: number
  mime_type: string
}
