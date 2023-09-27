import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangesComponent } from './components/exchanges/exchanges.component';
import { Martingale3DComponent } from './components/martingale-3d/martingale-3d.component';
import { PairComparissionComponent } from './components/pair-comparission/pair-comparission.component';

const routes: Routes = [
  {
    path: '',
    component: PairComparissionComponent
  },
  {
    path: 'exchanges',
    component: ExchangesComponent
  },
  {
    path: 'martingale-3d',
    component: Martingale3DComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketDataRoutingModule { }
