import * as db from '../helpers/global/mysql.helper';
class BaseModel {
  public tableName: string;
  public insertion: string;
  public selectCols: string;
  public selectWhere: string = '';
  public offsets: number = 0;
  public limits: number = 10;
  public orderBy: string = '';
  public orderIs: string = '';
  public updation: string;
  public fileId: any;
  public updateWhere: string = '';
  public insertPrimaryKey: string;
  constructor(value: string) {
    this.tableName = value;
  }
  public inserRecords() {
    // tslint:disable-next-line:max-line-length
    const query = 'CALL insertData("' + this.tableName + '","'
      + this.insertion + '","' + this.insertPrimaryKey + '");';
    const result = db.default.pdo(query);
    return result;

  }

  getCode() {
    // tslint:disable-next-line:max-line-length
    const query = 'CALL getCode();';
    const result = db.default.pdo(query);
    return result;
  }

  public getRecords() {
    // tslint:disable-next-line:max-line-length
    const query = 'CALL getFile("' + this.fileId + '");';
    const result = db.default.pdo(query);
    return result;

  }
  public deleteDocsBeforeUpload(kycId: string) {
    return new Promise((resolve, reject) => {
      this.callQuery(`call deleteDocsBeforeInsert('${kycId}');`).then(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          resolve(false);
        });
    });
  }
  public deleteRecord(isSelfie: boolean = false, userId: string = '') {
    if (isSelfie === true) {
      // tslint:disable-next-line:no-shadowed-variable
      const query = `CALL deleteSelfie('${this.fileId}','${userId}')`;
      // tslint:disable-next-line:no-shadowed-variable
      const result = db.default.pdo(query);
      this.fileId = '';
      return result;
    }
    if (isSelfie === false) {
      const query = 'CALL deleteFile("' + this.fileId + '");';
      const result = db.default.pdo(query);
      this.fileId = '';
      return result;
    }
  }
  public async selectRecords() {
    // tslint:disable-next-line:max-line-length
    const query = 'call SelectData("' + this.selectCols + '","' + this.tableName + '","' + this.selectWhere + '",' + this.offsets + ',' + this.limits + ',"' + this.orderBy + '","' + this.orderIs + '");';
    const result = await db.default.pdo(query);
    this.resetSelectSettings();
    return result;
  }

  public async updateRecords() {
    // tslint:disable-next-line:max-line-length
    const query = 'call updateData("' + this.tableName + '","' + this.updation + '","' + this.updateWhere + '");';
    console.log('\n update query: ', query);
    const result = await db.default.pdo(query);
    return result;
  }
  public async callQuery(query: string) {
    const result = await db.default.pdo(query);
    this.resetSelectSettings();
    return result;
  }
  public updateKyc(userRequest: any, userId: string) {
    return new Promise(async (resolve, reject) => {
      this.tableName = 'kyc';
      let kycstatus = userRequest.body.kstatus ? userRequest.body.kstatus : 3;
      this.updation = '';
      this.updation += `
        firstname='${userRequest.body.firstname}',
        city='${userRequest.body.city}',
        country_code='${userRequest.body.countryid}',
        dob='${userRequest.body.dob}',
        zip='${userRequest.body.zip}',
        gender='${userRequest.body.gender}',
        status = ${kycstatus},
        `;
      // Dev-SK, jan 17,2020
      if (userRequest.body.countryid !== undefined) {
        this.updation += `country_id='${userRequest.body.countryid}',`;
      }
      if (userRequest.body.mobileno !== undefined) {
        this.updation += `mobile_no='${userRequest.body.mobileno}',`;
      }
      if (userRequest.body.selfieid !== undefined) {
        this.updation += `selfie_id = UUID_TO_BIN('${userRequest.body.selfieid}'),`;
      }
      this.updation += `lastname='${userRequest.body.lastname}'`;

      this.updateWhere = `BIN_TO_UUID(user_id)='${userId}'`;
      this.updateRecords().then(
        (res: any) => {
          resolve(true);
        },
        (error) => {
          console.log(error);
          resolve(false);
        });
    });
  }

  public updateMobile(userRequest: any, userId: string) {
    return new Promise(async (resolve, reject) => {
      this.tableName = 'kyc';
      this.updation = `
        mobile_no='${userRequest.body.mobileno}'
        `;
      this.updateWhere = `user_id= UUID_TO_BIN('${userId}')`;
      this.updateRecords().then(
        (res: any) => {
          resolve(true);
        },
        (error) => {
          console.log(error);
          resolve(false);
        });
    });
  }

  public updateMobileKycLevel2(userRequest: any, userId: string) {
    return new Promise(async (resolve, reject) => {
      this.tableName = 'kyc';
      this.updation = `
        mobile_no='${userRequest.body.mobileno}',
        phone_code='${userRequest.body.phone_code}',
        kyc_level = 2, mobile_no_verified=1`;
      this.updateWhere = `user_id= UUID_TO_BIN('${userId}')`;
      this.updateRecords().then(
        (res: any) => {
          resolve(true);
        },
        (error) => {
          console.log(error);
          resolve(false);
        });
    });
  }

  public updateKycLevel(kyc_level: any, userId: string) {
    return new Promise(async (resolve, reject) => {
      this.tableName = 'kyc';
      this.updation = `
      kyc_level='${kyc_level}'`;
      this.updateWhere = `user_id= UUID_TO_BIN('${userId}')`;
      this.updateRecords().then(
        (res: any) => {
          resolve(true);
        },
        (error) => {
          console.log(error);
          resolve(false);
        });
    });
  }

  public getUserData(userId: string) {
    return new Promise((resolve, reject) => {
      this.callQuery('call adminGetKyc("' + userId + '","",' + this.offsets + ',' + this.limits + ');').then(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          resolve(false);
        });
    });
  }

  public deleteKycRecords(userId: string) {
    return new Promise((resolve, reject) => {
      this.callQuery('call deleteKyc("' + userId + '");').then(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          resolve(false);
        });
    });
  }

  private resetSelectSettings() {
    this.selectWhere = '';
    this.orderBy = '';
    this.orderIs = '';
    this.selectCols = '';
    this.offsets = 0;
  }
  public startTransaction = async () => {
    await this.callQuery("START TRANSACTION");
  };
  public commitTransaction = async () => {
    await this.callQuery("COMMIT;");
  };
  public rollbackTransaction = async () => {
    await this.callQuery("ROLLBACK;");
  };
}
export default BaseModel;
