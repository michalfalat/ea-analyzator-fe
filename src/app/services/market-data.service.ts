import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MarketDataPairTimeseriesQueryRequest, MarketDataPairTimeseriesResponse } from '../models/market-data.models';

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


  fetchPairTimeseries(params: MarketDataPairTimeseriesQueryRequest): Observable<MarketDataPairTimeseriesResponse> {
    return this.httpClient.get<MarketDataPairTimeseriesResponse>(`${this.getApiUrl()}/pair-timeseries`, { params: params })
  }
}
