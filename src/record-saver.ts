import * as excel from 'exceljs'
import {ShippingRecord} from './shipping-record'
import * as Shipping from './shipping-record'

function createWorksheet(workbook: excel.Workbook, record: ShippingRecord): excel.Worksheet {
  const sheet = workbook.addWorksheet(`${record.locale} ${record.shipping_speed} rate`)
  const header = sheet.getRow(1)
  header.getCell(1).value = 'Start Weight'
  header.getCell(2).value = 'End Weight'
  const columnOffset = 2
  const zones = Shipping.getZones(record)
  for (let i = 0; i < zones.length; i++) {
    // Offset by the first two column names.
    // + 1 because excel is 1-index based.
    header.getCell(i + columnOffset + 1).value = `Zone ${zones[i]}`
  }
  return sheet
}

export async function saveRecords(records: ShippingRecord[]): Promise<void> {
  const workbook = new excel.Workbook()
  workbook.created = new Date()

  let locale = ''
  let speed = ''
  let sheet: excel.Worksheet|undefined
  let row: excel.Row|undefined
  let rowIndex = 2
  let columnIndex = 1

  for (const record of records) {
    // Criteria for a new sheet.
    if (sheet === undefined ||
        row === undefined ||
        record.locale !== locale ||
        record.shipping_speed !== speed)
      {
        locale = record.locale
        speed = record.shipping_speed
        sheet = createWorksheet(workbook, record)
        rowIndex = 2
        row = sheet.getRow(rowIndex)
    }

    if (Shipping.isFirstZone(record)) {
      rowIndex++
      row = sheet.getRow(rowIndex)
      row.getCell(1).value = record.start_weight
      row.getCell(2).value = record.end_weight
      columnIndex = 3
    }
    row.getCell(columnIndex).value = record.rate
    columnIndex++
  }

  await workbook.xlsx.writeFile('test.xlsx')
}

