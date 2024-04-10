import { Component, OnInit } from '@angular/core';
import random from 'random';
import { MarketDataService } from 'src/app/services/market-data.service';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { default as Annotation } from 'chartjs-plugin-annotation';
import { last, toString } from 'lodash-es';

@Component({
  selector: 'app-martingale-3d',
  templateUrl: './martingale-3d.component.html',
  styleUrls: ['./martingale-3d.component.scss']
})
export class Martingale3DComponent {


  iterations = 1000
  winRate = 55
  //
  results = []
  probabilityData: ChartConfiguration['data']
  martingaleData: ChartConfiguration['data']
  finalProbability = 0
  finalConsecutiveLossCounter = 0

  probabilityTestOptions: ChartConfiguration['options'] = {
    animation: { duration: 0 },
    scales: {
      x: {
        min: 0,
      },
      y: {
        min: 0,
        max: 100,
      }
    }
  }

  martingaleTestOptions: ChartConfiguration['options'] = {
    animation: { duration: 0 },
    scales: {
      x: {
        min: 0,
      },
    }
  }

  constructor(private marketDataService: MarketDataService) { }


  // Martingale calculator
  levelMultipliers = [5, 12, 25, 55, 100, 180, 350]
  levelMultipliersValue = this.levelMultipliers.join(',')
  riskToRewardRatio = '1:1'
  numberOfExperimentPerIteration = 5
  currentExperimentLevels = []
  startingAccountSum = 10000
  finalAccountSum = 0
  maxDrawdown = 0
  maxRelativeDrawdown = 0
  winMultiplier = +last(this.riskToRewardRatio.split(':'))


  onProcess(): void {
    this.initMartingale3D()
    this.processProbabilityTester()
    this.processMartingale3D()

  }

  onCalculateWinMultiplier(): void {
    this.winMultiplier = +last(this.riskToRewardRatio.split(':'))
  }

  onCalculateLevelMultipliers(): void {
    this.levelMultipliers = this.levelMultipliersValue.split(',').filter(value => !!value).map(value => +value)
  }

  initMartingale3D(): void {
    this.currentExperimentLevels = []
    this.maxDrawdown = 0
    this.maxRelativeDrawdown = 0
    this.finalAccountSum = +this.startingAccountSum
    for (let i = 0; i < this.numberOfExperimentPerIteration; i++) {
      this.currentExperimentLevels.push(0) // we start with  zero  level multiplier
    }
  }



  getRandom(): boolean {
    const number = random.int(0, 100)
    return number <= this.winRate
  }

  processMartingale3D(): void {
    const accountState = []

    for (let i = 0; i < this.iterations; i++) {

      for (let j = 0; j < this.numberOfExperimentPerIteration; j++) {
        if (this.finalAccountSum <= 0) {
          // we push latest negative  or zero value, as our account is fired up
          accountState.push(this.finalAccountSum)
          break
        }
        const value = this.getRandom()
        const currentExperimentLevel = this.currentExperimentLevels[j]
        const winValue = 1 * this.levelMultipliers[currentExperimentLevel]
        // console.log('winValue :>> ', winValue);
        if (value) {
          this.currentExperimentLevels[j] = 0 // reset to zero level multiplier
          this.finalAccountSum += +(winValue * this.winMultiplier)
        } else {
          this.finalAccountSum -= +winValue
          if (this.currentExperimentLevels[j] === this.levelMultipliers.length - 1) {
            // console.log(`Pokus c. ${j + 1} pri iteracii ${i + 1}/${this.iterations} dosiahol maximalnu hodnotu: ${this.levelMultipliers[this.currentExperimentLevels[j]]}`)
            // this.printMartingaleResults()
            // break
          } else {
            this.currentExperimentLevels[j] += 1 // move to the next level
          }
          // console.log(`Experiment [${j}] failed and moved to another level: ${this.currentExperimentLevels[j]}`)

        }
        accountState.push(this.finalAccountSum)

      }
    }
    this.maxDrawdown = this.marketDataService.getMaxDrawdown(accountState)
    this.maxRelativeDrawdown = this.marketDataService.getMaxRelativeDrawdown(accountState)

    this.martingaleData = {
      datasets: [
        {
          data: accountState,
          label: 'Stav uctu',
          pointRadius: 0,
          order: 5,
          borderWidth: 2,
          borderColor: 'blue',
          backgroundColor: 'blue',
        },
      ],

      labels: accountState.map((item, index) => index + 1),

    }


  }

  printMartingaleResults(): void {
    for (let i = 0; i < this.levelMultipliers.length; i++) {
      let line = `[${this.levelMultipliers[i]}]:\t`
      for (let j = 0; j < this.numberOfExperimentPerIteration; j++) {
        const currentExperimentLevel = this.currentExperimentLevels[j]
        const result = currentExperimentLevel > i ? ' L ' : ' - '
        line += result
      }
      console.log(line)
    }
    // console.log('this.finalAccountSum :>> ', this.finalAccountSum);
  }

  processProbabilityTester(): void {
    this.results = []
    const probabilities = []
    const occurancesCountMap = {}
    let consecutiveLossCounter = 0
    this.finalConsecutiveLossCounter = 0
    for (let i = 0; i < this.iterations; i++) {
      const value = this.getRandom()
      const namedValue = toString(value)
      this.results.push(value)
      occurancesCountMap[namedValue] = occurancesCountMap[namedValue] === undefined ? 1 : ++occurancesCountMap[namedValue]
      if (!value) {
        consecutiveLossCounter++;
      } else {
        consecutiveLossCounter = 0;
      }
      this.finalConsecutiveLossCounter = Math.max(this.finalConsecutiveLossCounter, consecutiveLossCounter);
      const successCount = this.results.filter(value => value === true).length
      const currentProbability = this.calculateProbability(this.results.length, successCount)
      probabilities.push(currentProbability)

    }

    this.finalProbability = probabilities[probabilities.length - 1]
    // console.log('occurancesCountMap :>> ', occurancesCountMap);


    this.probabilityData = {
      datasets: [
        {
          data: probabilities,
          label: 'P win [%]',
          pointRadius: 0,
          order: 5,
          borderWidth: 2,
        },
      ],

      labels: probabilities.map((item, index) => index + 1),

    }
  }

  calculateProbability(total: number, success: number): number {
    return 100 / total * success

  }

}
