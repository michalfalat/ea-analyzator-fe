import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketDataRoutingModule } from './market-data-routing.module';
import { ExchangesComponent } from './components/exchanges/exchanges.component';
import { PairComparissionComponent } from './components/pair-comparission/pair-comparission.component';
import { NgChartsModule } from 'ng2-charts';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FilterPipe } from './components/pair-comparission/filter-data.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { Martingale3DComponent } from './components/martingale-3d/martingale-3d.component';


@NgModule({
  declarations: [
    ExchangesComponent,
    PairComparissionComponent,
    Martingale3DComponent,
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
  ],
  exports: [
  ]
})
export class MarketDataModule { }
