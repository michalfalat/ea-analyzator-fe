import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';
import { uniqBy } from 'lodash-es';
import { catchError, throwError } from 'rxjs';
import { MarketDataTimeseriesData } from 'src/app/models/market-data.models';
import { MarketDataService } from 'src/app/services/market-data.service';

@Component({
  selector: 'app-strategy-tester',
  templateUrl: './strategy-tester.component.html',
  styleUrls: ['./strategy-tester.component.scss']
})
export class StrategyTesterComponent {

  symbols: any[] = []
  ohlcData: MarketDataTimeseriesData[]
  isLoading = true
  dataLoaded = false

  predefinedSymbols = [
    {
      name: 'iShares S&P500 ETF',
      symbol: 'IVV',
    },
    {
      name: 'NVIDIA',
      symbol: 'NVDA',
    },
    {
      name: 'Visa',
      symbol: 'V',
    },
    {
      name: 'Oracle',
      symbol: 'ORCL',
    }
  ]

  filteredSymbols: any[]

  form = new FormGroup({
    symbol: new FormControl('', [Validators.required]),
    symbolSearch: new FormControl('')
  })

  constructor(private marketDataService: MarketDataService) {
    this.marketDataService.fetchSymbols()
      .subscribe((symbols: any[]) => {
        this.symbols = uniqBy(symbols, (option) => option.symbol) as []
        this.preselect(this.predefinedSymbols[0])
        this.loadData()
      })

    this.form.valueChanges.subscribe(() => {
      this.ohlcData = null
      this.dataLoaded = false
      this.calculateFilteredSymbols()
    })
  }

  calculateFilteredSymbols(): void {
    if (!this.symbols) {
      return;
    }
    // get the search keyword
    let search = this.form.value.symbolSearch;
    if (!search) {
      this.filteredSymbols = []
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredSymbols = this.symbols.filter(symbol => symbol.name.toLowerCase().indexOf(search) > -1 || symbol.symbol.toLowerCase().indexOf(search) > -1).slice(0, 2000)


  }

  preselect(symbol): void {
    this.form.patchValue({
      symbolSearch: symbol.symbol,
      symbol: symbol.symbol
    })
    this.loadData()
  }


  loadData(): void {
    this.isLoading = true
    this.marketDataService.fetchOHLC(this.form.value.symbol)
      .pipe(
        catchError((error) => {
          this.isLoading = false
          this.dataLoaded = true
          alert(`Symbol ${this.form.value.symbol} cannot be loaded`)
          return throwError(error)
        }),
      )
      .subscribe(ohlcData => {
        this.ohlcData = ohlcData
        this.isLoading = false
        this.dataLoaded = true
      })
  }

}
