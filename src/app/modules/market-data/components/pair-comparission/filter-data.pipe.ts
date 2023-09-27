import { Pipe, PipeTransform } from '@angular/core';
import { isArray } from 'lodash-es';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(items: any[], fieldName: string | string[], searchQuery: string): any {
    if (!items) return;
    if (!searchQuery) return [];

    if (isArray(fieldName)) {
      return items.filter((item) => {
        let result = false;
        fieldName.forEach((key) => {
          if (item[key]?.toLowerCase()?.includes(searchQuery?.toLocaleLowerCase())) {
            result = true;
          }
        });
        return result;
      }).slice(0, 100);
    }

    return items.filter((item) => item[fieldName]?.toLowerCase()?.includes(searchQuery?.toLocaleLowerCase())).slice(0, 100);
  }
}
