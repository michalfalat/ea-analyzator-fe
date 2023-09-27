export type MarketDataPairTimeseriesQueryRequest = {
  symbol1: string
  symbol2: string
  interval: MarketDataPairTimeseriesInterval
  size: number
}


export type MarketDataPairTimeseriesResponse = {
  symbol1: string
  symbol2: string
  values1: MarketDataTimeseriesData[]
  values2: MarketDataTimeseriesData[]
  spreads: number[]
  correlation: number
  cointegration: number
}

export type MarketDataTimeseriesData = {
  close: number
  datetime: string
  high: number
  low: number
  open: number
}

export enum MarketDataPairTimeseriesInterval {
  day = '1day'
}
