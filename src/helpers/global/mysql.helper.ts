import * as mysql from 'mysql';
class DbHelper {
  private normalPool: any;
  private writePool: any;
  private readPool: any;
  constructor() {
    this.normalPool = this.initializePool();
  }
  public initializePool() {
    return mysql.createPool({
      connectionLimit: 1,
      host: process.env.HOST_NAME,
      database: process.env.DBNAME,
      user: process.env.USER_NAME,
      password: process.env.PASSWORD,
      timezone: 'Z',
    });
  }
  public pdo(query: any) {
    let pdoConnect: any;
    pdoConnect = this.normalPool;
    return new Promise((resolve, reject) => {
      pdoConnect.getConnection((err: any, connection: any) => {
        if (err) {
          return reject(err);
        }
        connection.query(query, (error: any, results: any, fields: any) => {
          connection.release();
          if (error) return reject(error);
          const result = results.length > 0 ? JSON.parse(JSON.stringify(results[0])) : [];
          resolve(result);
        });
      });
    });
  }
}
export default new DbHelper();
