import * as bcrypt from 'bcrypt';
import * as BigNumber from 'bignumber.js';
import * as CryptoJS from 'crypto-js';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as request from 'request';
import * as moment from 'moment';
import {  } from '../../constant/response';
import BaseModel from '../../model/base.model';
import mailHelper from './email.helper';
const saltRounds = 10;

class UtilitiesHelper {
  public async curlRequest(endpoint: string, header: object, data: any = '', rType: string = 'GET') {
    console.log(endpoint);
    return new Promise((resolve, reject) => {
      const options = {
        url: endpoint,
        // tslint:disable-next-line:object-shorthand-properties-first
        data,
        headers: header,
      };

      try {
        if (rType === 'GET') {
          request.get(options, (error, response, body) => {
            if (error) {
              reject(error);
            }
            const obj = {
              statusCode: (response) ? response.statusCode : 0,
              response: body,
            };
            resolve(obj);
          });
        }
        if (rType === 'POST') {
          const sendData = JSON.stringify(data);
          const options1 = {
            url: endpoint,
            // tslint:disable-next-line:object-shorthand-properties-first
            body: sendData,
            headers: header,
          };
          request.post(options1, (error, response, body) => {
            if (error) {
              console.log('post error', error);
              reject(error);
            }
            const obj = {
              statusCode: (response) ? response.statusCode : 0,
              response: body,
            };
            resolve(obj);
          });
        }
      } catch (error) {
        console.log('error curl', error);
        reject(error);
      }
    });
  }

}
export default new UtilitiesHelper();
