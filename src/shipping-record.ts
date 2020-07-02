// Would ideally use an ORM lib
// instead of hard-coding the database structure.
export interface ShippingRecord {
  id: number,
  client_id: number,
  start_weight: number,
  end_weight: number,
  zone: string,
  rate: number,
  shipping_speed: string,
  locale: string
}

export const DOMESTIC_ZONES = ['1', '2', '3', '4', '5', '6', '7', '8']
export const INTERNATIONAL_ZONES =
  [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O'
  ]

export function isFirstZone(record: ShippingRecord): boolean {
  if (isDomestic(record)) {
    return record.zone === DOMESTIC_ZONES[0]
  } else {
    return record.zone === INTERNATIONAL_ZONES[0]
  }
}

export function isDomestic(record: ShippingRecord): boolean {
  return record.locale === 'domestic'
}

export function getZones(record: ShippingRecord): string[] {
  return isDomestic(record) ? DOMESTIC_ZONES : INTERNATIONAL_ZONES
}

