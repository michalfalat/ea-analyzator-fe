import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { startWith } from 'rxjs';
import { FilterConfig, FilterType, getFilterOptions } from '../../../models';

@Component({
  selector: 'app-sma-filter',
  templateUrl: './sma-filter-component.html',
})
export class FiltersSmaFilterComponent implements OnInit {

  @Output() change$ = new EventEmitter<FilterConfig>()

  readonly filterTypeOptions = getFilterOptions()
  readonly form = new FormGroup({
    type: new FormControl(FilterType.SMA, []),
    period: new FormControl(20, []),
  })

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        startWith(this.form.value),
      )
      .subscribe((value) => {
        this.change$.emit(value)
      })
  }

}
