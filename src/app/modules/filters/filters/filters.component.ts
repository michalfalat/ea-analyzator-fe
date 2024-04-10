import { Component, EventEmitter, Output } from '@angular/core';
import { FilterConfig } from '../../../models';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
})
export class FiltersComponent {

  @Output() change$ = new EventEmitter<FilterConfig[]>()

  filterActive = true
  filterConfigs: FilterConfig[]

  constructor() {

  }

  onFilterActive(): void {
    this.filterActive = !this.filterActive
    if (!this.filterActive) {
      this.change$.emit(null)
    }
  }

  onChange(filterConfig: FilterConfig): void {
    this.filterConfigs = [filterConfig]
    this.change$.emit(this.filterConfigs)
  }


}
