import * as mysql from 'mysql2/promise'
import {ShippingRecord} from './shipping-record'

/**
 * Model to abstract away the fact that our data is backed by a database.
 * The database is an implementation detail, so no other code should know it exists.
 */
export class DataModel {

  private static instance: DataModel
  private databaseConnection: mysql.Connection|undefined

  private constructor() {
    // Protect construction (singleton paradigm)
  }

  /**
   * Initializes the model.
   * This needs to be done before it can be used.
   *
   * @async
   * @return {Promise<void>} 
   */
  private async initialize(): Promise<void> {
    // Connection information typically loaded via env vars. Never do this.
    this.databaseConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'whitebox',
      password: 'whitebox'
    })
  }

  public async tearDown(): Promise<void> {
    await this.databaseConnection?.end()
  }

  public async getShippingRecords(clientID: number): Promise<ShippingRecord[]> {
    if (this.databaseConnection === undefined) {
      throw Error('DataModel has not been initialized')
    }
    // May be able to perform better type checking,
    // haven't had experience with this library.
    const rows: unknown = await this.databaseConnection.execute(
      `SELECT * FROM rates WHERE client_id=${clientID};`
    )
    if (Array.isArray(rows) && rows.length > 0) {
      // The first element contains our results.
      return rows[0] as (ShippingRecord[])
    }
    return []
  }

  /**
   * DataModel singleton.
   *
   * @static
   * @async
   * @return {Promise<DataModel>}
   */
  public static async getInstance(): Promise<DataModel> {
    if (DataModel.instance === undefined) {
      DataModel.instance = new DataModel()
      await DataModel.instance.initialize()
    }
    return DataModel.instance
  }

}

