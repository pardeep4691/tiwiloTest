import { RESPONSES, RES_MSG } from '../../constant/response';
class ResponseHelper {
  public success(response: any, responseData: any = {}) {
    return response.status(RESPONSES.SUCCESS).send(responseData);
  }
  public error(response: any, responseData: any = {}) {
    let errMsg = responseData.message;
    if(responseData.message.message)
      errMsg = responseData.message.message;
    if (String(responseData.message.message).includes("Error:")) errMsg = RES_MSG.ERROR;
   
    if(responseData.message.error === undefined){
      responseData.message  = { error: errMsg};
    }else{
      responseData.message =errMsg;
    }
    return response.status(RESPONSES.BADREQUEST).send(responseData);
  }
}
export default new ResponseHelper();
