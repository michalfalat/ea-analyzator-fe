import { Injectable } from "@angular/core";
import { sum } from "lodash-es";
import { FilterConfig, FilterType } from "../models";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  isLongConditionsMatched(filterConfig: FilterConfig, prices: number[], index: number, currentPrice: number): boolean {
    const filteredPrices = prices.slice(0, index + 1)
    if (filterConfig.type === FilterType.SMA) {
      const smaValue = this.calculateSMA(filteredPrices, filterConfig.period)
      return currentPrice > smaValue
    } else if (filterConfig.type === FilterType.EMA) {
      const emaValue = this.calculateEMA(filteredPrices, filterConfig.period)
      return currentPrice > emaValue
    }
    return false
  }

  // Function to calculate Simple Moving Average (SMA)
  private calculateSMA(prices: number[], period: number): number {
    const sma = [];
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        const sumPrices = sum(prices)
        sma.push(sumPrices / prices.length);
      } else {
        const sumPrices = sum(prices.slice(i - period + 1, i + 1))
        sma.push(sumPrices / period);
      }
    }
    return sma[sma.length - 1];
  }

  // Function to calculate Exponential Moving Average (EMA)
  private calculateEMA(prices: number[], period: number): number {
    const ema = [];
    const multiplier = 2 / (period + 1);
    let emaValue = prices.slice(0, period).reduce((acc, val) => acc + val, 0) / period;
    ema.push(emaValue);

    for (let i = period; i < prices.length; i++) {
      emaValue = (prices[i] - emaValue) * multiplier + emaValue;
      ema.push(emaValue);
    }
    return ema[ema.length - 1];
  }

}
