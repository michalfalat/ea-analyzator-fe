import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketDataRoutingModule } from './market-data-routing.module';
import { ExchangesComponent } from './components/exchanges/exchanges.component';
import { PairComparissionComponent } from './components/pair-comparission/pair-comparission.component';
import { NgChartsModule } from 'ng2-charts';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FilterPipe } from './components/pair-comparission/filter-data.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { Martingale3DComponent } from './components/martingale-3d/martingale-3d.component';
import { StrategyTesterComponent } from './components/strategy-tester/strategy-tester.component';
import { OhlcAnalyzatorComponent } from './components/ohlc-analyzator/ohlc-analyzator.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { FiltersModule } from '../filters/filters.module';


@NgModule({
  declarations: [
    ExchangesComponent,
    PairComparissionComponent,
    StrategyTesterComponent,
    Martingale3DComponent,
    OhlcAnalyzatorComponent,
    FilterPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MarketDataRoutingModule,
    NgChartsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatButtonModule,
    MatInputModule,
    MatSliderModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDividerModule,
    FiltersModule,
  ],
  exports: [
  ]
})
export class MarketDataModule { }
