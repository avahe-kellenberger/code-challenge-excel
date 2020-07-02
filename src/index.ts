import {DataModel} from './datamodel'
import * as RecordSaver from './record-saver'

// Hardcoded for the demonstration, 
// since we don't have an i/o interface for the user.
const customerSearchID = 1240

async function run(): Promise<void> {
  const dataModel = await DataModel.getInstance()
  const records = await dataModel.getShippingRecords(customerSearchID)
  await RecordSaver.saveRecords(records)
  dataModel.tearDown()
}

run()

