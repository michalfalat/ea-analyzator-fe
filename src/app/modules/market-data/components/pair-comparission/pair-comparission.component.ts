import 'chartjs-adapter-date-fns';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MarketDataPairTimeseriesInterval, MarketDataPairTimeseriesQueryRequest, MarketDataPairTimeseriesResponse } from 'src/app/models/market-data.models';
import { MarketDataService } from 'src/app/services/market-data.service';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';

import { default as Annotation } from 'chartjs-plugin-annotation';
import { CandlestickController, CandlestickElement, OhlcController, OhlcElement, } from 'chartjs-chart-financial';
import * as dayjs from 'dayjs';
import { enUS } from 'date-fns/locale';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pair-comparission',
  templateUrl: './pair-comparission.component.html',
  styleUrls: ['./pair-comparission.component.scss']
})
export class PairComparissionComponent implements OnInit {
  data?: MarketDataPairTimeseriesResponse
  allSymbols?: any[]
  spreadChartData?: ChartConfiguration['data']
  symbol1OhlcChartData?: ChartConfiguration['data']
  symbol2OhlcChartData?: ChartConfiguration['data']
  spreadChartOptions: ChartConfiguration['options'] = { animation: { duration: 0 } }
  candleChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: false,
    scales: {
      x: {
        time: {
          unit: 'day'
        },
        adapters: {
          date: {
            locale: enUS
          }
        },
        ticks: {
          source: 'auto'
        }
      }
    },
    borderColor: 'black',
    backgroundColor: 'rgba(255,0,0,0,0.3)',
    plugins: {
      legend: {
        display: true
      },
      tooltip: {
        enabled: true
      }
    }
  }
  spreadChartType: ChartType = 'line';
  candleChartType: ChartType = 'candlestick'
  form!: FormGroup


  constructor(private marketDataService: MarketDataService, private fb: FormBuilder) {
    Chart.register(Annotation)
    Chart.register(CandlestickController, OhlcController, CandlestickElement, OhlcElement);
    this.form = new FormGroup({
      symbol1: new FormControl('', [Validators.required]),
      symbol2: new FormControl('', [Validators.required]),
      days: new FormControl(365, [Validators.required]),
      kalmanQValue: new FormControl(0.00001),
      kalmanRValue: new FormControl(0.01)
    })
  }

  get kalmanQValueControl() {
    return this.form.controls['kalmanQValue'] as FormControl
  }

  get kalmanRValueControl() {
    return this.form.controls['kalmanRValue'] as FormControl
  }

  get correlationColor(): string {
    const percent = this.data?.correlation ?? 0
    const r = 220 - (220 * percent);
    const g = (220 * percent);
    return 'rgb(' + r + ',' + g + ',0)';
  };

  get cointegrationColor(): string {
    const percent = this.data?.cointegration ?? 0
    const r = (220 * percent);
    const g = 220 - (220 * percent);
    return 'rgb(' + r + ',' + g + ',0)';
  };

  ngOnInit(): void {
    this.marketDataService.fetchSymbols().subscribe(data => this.allSymbols = data)
  }

  kalmanPrediction(measurements: number[]): any {
    // Define initial state and covariance
    const length = measurements.length
    let x = measurements[0];
    let P = 1;
    let Q = this.form?.value.kalmanQValue; // process noise covariance
    let R = this.form?.value.kalmanRValue;  // measurement noise covariance

    // Define arrays for storing estimated and predicted values
    let xhat = new Array(length);
    let Phat = new Array(length);
    let yhat = new Array(length);

    // Kalman filter estimation and prediction loop
    for (let i = 0; i < length; i++) {
      // Prediction step
      let xhatminus = x;
      let Pminus = P + Q;
      yhat[i] = xhatminus;

      // Update step
      let K = Pminus / (Pminus + R);
      x = xhatminus + K * (measurements[i] - xhatminus);
      P = (1 - K) * Pminus;

      // Store estimated state and covariance
      xhat[i] = x;
      Phat[i] = P;
    }

    // Output results
    console.log("Estimates: " + xhat);
    console.log("Covariances: " + Phat);
    console.log("Predictions: " + yhat);
    return { xhat, yhat }
  }

  applyKalman(): void {
    this.fillSpreadChart(this.data!)
  }

  getZScore(data: number[]): number[] {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    let mean = sum / data.length;

    let squaredSum = 0;
    for (let i = 0; i < data.length; i++) {
      squaredSum += (data[i] - mean) ** 2;
    }
    let stdDev = Math.sqrt(squaredSum / data.length);

    // Calculate z-scores for each data point
    let zScores = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
      zScores[i] = (data[i] - mean) / stdDev;
    }

    // Output z-scores
    console.log("Z-scores: " + zScores);
    return zScores
  }

  fillSpreadChart(data: MarketDataPairTimeseriesResponse): void {
    const measurements = this.kalmanPrediction(data.spreads)
    const zScores = this.getZScore(data.spreads)
    this.data = data
    this.spreadChartData = {
      datasets: [
        {
          data: data.spreads,
          label: 'Spread',
          pointRadius: 0,
          order: 5,
          borderWidth: 2,
        },
        {
          data: measurements.xhat,
          label: 'Kalman Estimates',
          pointRadius: 0,
          order: 1,
          borderWidth: 2,
        },
        {
          data: zScores,
          label: 'Z-Score',
          pointRadius: 0,
          order: 6,
          borderWidth: 1,
        },
      ],
      labels: data.spreads.map((item, index) => index),

    }
  }


  loadData(): void {
    const request: MarketDataPairTimeseriesQueryRequest = {
      interval: MarketDataPairTimeseriesInterval.day,
      size: this.form?.value.days,
      symbol1: this.form?.value.symbol1,
      symbol2: this.form?.value.symbol2,
    }
    this.marketDataService.fetchPairTimeseries(request).subscribe(data => {
      this.fillSpreadChart(data)

      this.symbol1OhlcChartData = {
        datasets: [{
          label: data.symbol1,
          data: data.values1.map(value => ({
            c: value.close,
            h: value.high,
            l: value.low,
            o: value.open,
            x: dayjs(value.datetime).unix() * 1000
          }))
        }
        ]
      }

      this.symbol2OhlcChartData = {
        datasets: [{
          label: data.symbol2,
          data: data.values2.map(value => ({
            c: value.close,
            h: value.high,
            l: value.low,
            o: value.open,
            x: dayjs(value.datetime).unix() * 1000
          }))
        }
        ]
      }
    })
  }
}
