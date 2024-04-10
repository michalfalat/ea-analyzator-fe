export enum FilterType {
  SMA = 'SMA',
  EMA = 'EMA',
}

export type FilterOption = {
  type: FilterType
  label: string
}

export type FilterConfig = {
  type: FilterType
  period: number
}

export function getFilterOptions(): FilterOption[] {
  return [
    {
      type: FilterType.SMA,
      label: 'SMA'
    },
    {
      type: FilterType.EMA,
      label: 'EMA'
    }
  ]
}
