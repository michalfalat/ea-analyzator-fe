import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MarketDataPairTimeseriesQueryRequest, MarketDataPairTimeseriesResponse, MarketDataTimeseriesData } from '../models/market-data.models';

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {

  constructor(private httpClient: HttpClient) { }

  getApiUrl(): string {
    return environment.apiUrl
  }

  // fetchExchanges(): Observable<any> {
  //   return this.httpClient.get(`${this.getApiUrl()}/api/market-data/exchanges`)
  // }


  // fetchExchangeTickers(exchange: string): Observable<any> {
  //   return this.httpClient.get(`${this.getApiUrl()}/api/market-data/exchange-tickers`, { params: { exchange } })
  // }

  fetchSymbols(): Observable<any> {
    return this.httpClient.get(`${this.getApiUrl()}/symbols`)
  }

  fetchOHLC(symbol: string): Observable<MarketDataTimeseriesData[]> {
    return this.httpClient.get<MarketDataTimeseriesData[]>(`${this.getApiUrl()}/ohlc/${symbol}`)
  }


  fetchPairTimeseries(params: MarketDataPairTimeseriesQueryRequest): Observable<MarketDataPairTimeseriesResponse> {
    return this.httpClient.get<MarketDataPairTimeseriesResponse>(`${this.getApiUrl()}/pair-timeseries`, { params: params })
  }

  getMaxDrawdown(accountBalances: number[]): number {
    let maxBalance = accountBalances[0];
    let maxDrawdown = 0;
    let currentDrawdown = 0;

    for (let i = 1; i < accountBalances.length; i++) {
      const balance = accountBalances[i];

      // Update the maximum balance if a new peak is encountered
      if (balance > maxBalance) {
        maxBalance = balance;
        currentDrawdown = 0; // Reset drawdown when a new peak is reached
      } else {
        // Calculate the drawdown relative to the current peak
        const drawdown = maxBalance - balance;

        // Update the maximum drawdown if a larger drawdown is encountered
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }

        // Update the current drawdown
        currentDrawdown = drawdown;
      }
    }

    return maxDrawdown;
  }

  getMaxRelativeDrawdown(accountBalances: number[]): number {
    let maxBalance = accountBalances[0];
    let maxRelativeDrawdown = 0;
    let currentRelativeDrawdown = 0;

    for (let i = 1; i < accountBalances.length; i++) {
      const balance = accountBalances[i];

      // Update the maximum balance if a new peak is encountered
      if (balance > maxBalance) {
        maxBalance = balance;
        currentRelativeDrawdown = 0; // Reset relative drawdown when a new peak is reached
      } else {
        // Calculate the relative drawdown as a percentage
        const relativeDrawdown = ((maxBalance - balance) / maxBalance) * 100;

        // Update the maximum relative drawdown if a larger relative drawdown is encountered
        if (relativeDrawdown > maxRelativeDrawdown) {
          maxRelativeDrawdown = relativeDrawdown;
        }

        // Update the current relative drawdown
        currentRelativeDrawdown = relativeDrawdown;
      }
    }

    return maxRelativeDrawdown;
  }
}
