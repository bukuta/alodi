/**
 *  generate by Alodi Wed Jan 30 2019 17:03:25 GMT+0800 (China Standard Time)
 */
import {BaseCollection,BaseModel,rpc} from 'yard';

class AdminModel extends BaseModel{
  constructor({url}){
    super({url:url||'/system/config'})
  }
  
}

export default AdminModel;
