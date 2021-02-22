import BaseModel from "../../model/base.model";
import * as UserInterface from './user.interface';
class UserModel extends BaseModel {
  constructor() {
    super("");
  }
  saveUser = async(data:UserInterface.SIGNUP)=>{
    const result = await this.callQuery(`call spSaveUser('')`).catch((err)=>{
      throw new Error("Error while fetching data.")
    });
    if(Array.isArray(result) && result.length>0){
      return result;
    }
    throw new Error("Something went wrong");
  }
}
export default new UserModel();
