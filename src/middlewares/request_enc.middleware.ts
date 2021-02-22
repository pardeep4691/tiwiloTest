
import * as CryptoJS from 'crypto-js';
import { NextFunction, Request, Response } from 'express';
const reqEncKey = '2ed5ebe2294ecd0e0f08eab7690d2a6aa98';
function requestDecrypt(request: Request, response: Response, next: NextFunction) {
  try {


    console.log('encryption', process.env.ENCRYPT_ENABLE);
    if(process.env.ENCRYPT_ENABLE === "YES"){
      console.log('comes under request decryption');
      let dataFields = reqDeEncrypt(request.body.data);
      console.log('decryption is dataFields', dataFields);
      dataFields = JSON.parse(dataFields);
      console.log('final data is ', dataFields);
      request.body = dataFields;
      next();
    }else{ 
      console.log('else part');
      next();
    }
    
  } catch (error) {
    console.log('error of enc is ', error);
    return response.status(500).json(error);
  }
}
function reqDeEncrypt(text: any) {
  console.log('text get is ', text);
  const bytes  = CryptoJS.AES.decrypt(text, reqEncKey);
  // console.log('bytes is ', bytes);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  console.log('plaintext is ', plaintext);
  return plaintext;
}

export default requestDecrypt;
