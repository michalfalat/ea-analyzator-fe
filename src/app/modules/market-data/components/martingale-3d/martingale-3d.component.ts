import { Component, OnInit } from '@angular/core';
import random from 'random';
import { MarketDataService } from 'src/app/services/market-data.service';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { default as Annotation } from 'chartjs-plugin-annotation';
import { toString } from 'lodash-es';

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


  allLevelMultipliers = [5, 12, 25, 55, 100, 180, 350, 660, 1350, 2700, 5400, 10800, 21000]
  // Martingale calculator
  levelMultipliers = [5, 12, 25, 55, 100, 180, 350]
  numberOfExperimentPerIteration = 5
  currentExperimentLevels = []
  startingAccountSum = 10000
  finalAccountSum = 0
  maxDrawdown = 0
  maxRelativeDrawdown = 0


  onProcess(): void {
    this.initMartingale3D()
    this.processProbabilityTester()
    this.processMartingale3D()

  }

  initMartingale3D(): void {
    this.currentExperimentLevels = []
    this.maxDrawdown = 0
    this.maxRelativeDrawdown = 0
    this.finalAccountSum = this.startingAccountSum
    for (let i = 0; i < this.numberOfExperimentPerIteration; i++) {
      this.currentExperimentLevels.push(0) // we start with  zero  level multiplier
    }
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
          this.finalAccountSum += winValue
        } else {
          this.finalAccountSum -= winValue
          if (this.currentExperimentLevels[j] === this.levelMultipliers.length - 1) {
            // console.log(`Pokus c. ${j + 1} pri iteracii ${i + 1}/${this.iterations} dosiahol maximalnu hodnotu: ${this.levelMultipliers[this.currentExperimentLevels[j]]}`)
            // this.printMartingaleResults()
            break
          } else {
            this.currentExperimentLevels[j] += 1 // move to the next level
          }
          // console.log(`Experiment [${j}] failed and moved to another level: ${this.currentExperimentLevels[j]}`)

        }

        accountState.push(this.finalAccountSum)
      }
    }
    this.maxDrawdown = this.getMaxDrawdown(accountState)
    this.maxRelativeDrawdown = this.getMaxRelativeDrawdown(accountState)

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
