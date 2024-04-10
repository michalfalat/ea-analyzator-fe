import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';
import { reverse } from 'lodash-es';
import { FilterConfig } from 'src/app/models';
import { MarketDataTimeseriesData } from 'src/app/models/market-data.models';
import { FilterService, MarketDataService } from 'src/app/services';

@Component({
  selector: 'app-ohlc-analyzator',
  templateUrl: './ohlc-analyzator.component.html',
  styleUrls: ['./ohlc-analyzator.component.scss']
})
export class OhlcAnalyzatorComponent implements OnChanges {

  @Input() symbol: string
  @Input() ohlcData: MarketDataTimeseriesData[]

  form = new FormGroup({
    stoploss: new FormControl(0.4, [Validators.required]),
    orderSize: new FormControl(1000, [Validators.required]),
  })
  readonly startingAccountSum = 10000

  isLoading = false

  minDate: string
  maxDate: string
  //
  winDaysPercentSum = 0
  winDaysCounter = 0;
  lossDaysPercentSum = 0
  lossDaysCounter = 0


  // TRUE PROFITS
  trueProfitSum = 0
  trueProfitCounter = 0
  trueLossSum = 0
  trueLossCounter = 0

  upCandleCounter = 0;
  upCandleFalseyCounter = 0;
  downCandleCounter = 0;
  finalAccountSum = 0;
  maxDrawdown = 0
  maxRelativeDrawdown = 0
  ///
  upPercentage: number
  upFalseyPercentage: number
  downPercentage: number
  ///
  accountStateData: ChartConfiguration['data']
  equityData: ChartConfiguration['data']
  accountStateChartOptions: ChartConfiguration['options'] = {
    animation: { duration: 0 },
    scales: {
      x: {
        min: 0,
      },
    }
  }
  equityChartOptions: ChartConfiguration['options'] = {
    animation: { duration: 0 },
    scales: {
      x: {
        min: 0,
      },
    }
  }

  filterConfig: FilterConfig

  constructor(private marketDataService: MarketDataService, private filterService: FilterService) {

  }

  get orderSize(): number {
    return +this.form.value.orderSize
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ohlcData'] && this.ohlcData?.length) {
      reverse(this.ohlcData)
      this.minDate = this.ohlcData[0].datetime
      this.maxDate = this.ohlcData[this.ohlcData.length - 1].datetime
    }
  }

  onFilterChange(filterConfigs: FilterConfig[]): void {
    this.filterConfig = filterConfigs?.length ? filterConfigs[0] : null
    console.log('filterConfig :>> ', this.filterConfig);
  }

  calculate(): void {
    this.isLoading = true
    const stopLossPercent = this.form.value.stoploss
    this.upCandleCounter = 0;
    this.upCandleFalseyCounter = 0;
    this.downCandleCounter = 0;
    this.upPercentage = 0;
    this.upFalseyPercentage = 0;
    this.downPercentage = 0;
    this.finalAccountSum = this.startingAccountSum;
    this.maxDrawdown = 0
    this.maxRelativeDrawdown = 0
    this.trueLossCounter = 0;
    this.trueLossSum = 0;
    this.trueProfitCounter = 0;
    this.trueProfitSum = 0;

    let equityPercent = 100;
    const accountState = []
    const percentState = []

    const prices = this.ohlcData.map(ohlcData => +ohlcData.close)
    for (let index = 0; index < this.ohlcData.length; index++) {
      const ohlcRecord = this.ohlcData[index];
      const { low, open, close, datetime } = ohlcRecord
      const stopLoss = open - (open * (stopLossPercent / 100));
      const size = Math.abs(close - open)
      const stocksCount = this.orderSize / open
      let profit = 0;

      if (!this.filterConfig || (!!this.filterConfig && this.filterService.isLongConditionsMatched(this.filterConfig, prices, index, +open))) {

        //WIN LOSS DAYS

        const percent = (100 / open) * size
        if (close > open) {
          this.winDaysPercentSum += percent;
          this.winDaysCounter++;
        } else {
          this.lossDaysPercentSum += percent;
          this.lossDaysCounter++;
        }

        //
        //LOSS
        if (low < stopLoss) {
          const diff = open - stopLoss;
          profit = diff * -1 * stocksCount
          this.downCandleCounter++;
          this.trueLossCounter++;
          this.trueLossSum += diff;

        } // CLOSE HIT
        else {
          const diff = close - open;
          const positiveDiff = Math.abs(diff)
          profit = diff * stocksCount

          //TRUE WIN
          if (diff > 0) {
            this.upCandleCounter++;
            this.trueProfitCounter++;
            this.trueProfitSum += positiveDiff;
          }
          else {
            // FALSE WIN
            this.upCandleFalseyCounter++;
            this.trueLossCounter++;
            this.trueLossSum += positiveDiff;
          }
        }

      } else {
        console.log(`${datetime}: NO BUY criteria matched for current OPEN: ${open}`)
      }



      this.finalAccountSum += profit;
      const gainPercent = (100 / open) * profit;
      const currentEquityPercentage = (100 / this.startingAccountSum) * this.finalAccountSum
      equityPercent = currentEquityPercentage;
      console.log(`${datetime}: PROFIT: ${profit.toFixed(2)} [${gainPercent.toFixed(2)}%], Account SUM: ${this.finalAccountSum}  Equity: ${equityPercent.toFixed(2)}%`)


      this.maxDrawdown = this.marketDataService.getMaxDrawdown(accountState)
      this.maxRelativeDrawdown = this.marketDataService.getMaxRelativeDrawdown(accountState)
      //
      accountState.push(this.finalAccountSum)
      percentState.push(equityPercent)

      this.accountStateData = {
        datasets: [
          {
            data: accountState,
            label: 'Stav uctu [USD]',
            pointRadius: 0,
            order: 5,
            borderWidth: 2,
            borderColor: 'blue',
            backgroundColor: 'blue',
          },
        ],
        labels: this.ohlcData.map((item, index) => item.datetime),

      }

      this.equityData = {
        datasets: [
          {
            data: percentState,
            label: 'Equity [%]',
            pointRadius: 0,
            order: 5,
            borderWidth: 2,
            borderColor: 'green',
            backgroundColor: 'green',
          },
        ],
        labels: this.ohlcData.map((item, index) => item.datetime),

      }
    }

    const candleSum = this.upCandleCounter + + this.upCandleFalseyCounter + this.downCandleCounter;
    this.upPercentage = (this.upCandleCounter / candleSum) * 100;
    this.upFalseyPercentage = (this.upCandleFalseyCounter / candleSum) * 100;
    this.downPercentage = (this.downCandleCounter / candleSum) * 100;
    this.isLoading = false
  }

}
