import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { NgChartsModule } from 'ng2-charts';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FiltersComponent } from './filters/filters.component';
import { FiltersSmaFilterComponent } from './sma-filter/sma-filter-component';


@NgModule({
  declarations: [
    FiltersSmaFilterComponent,
    FiltersComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatSliderModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDividerModule,
  ],
  exports: [
    FiltersSmaFilterComponent,
    FiltersComponent,
  ]
})
export class FiltersModule { }
