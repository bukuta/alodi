/**
 *  generate by Alodi Wed Jan 30 2019 17:50:46 GMT+0800 (China Standard Time)
 */
import {BaseCollection, BaseModel, rpc } from 'yard';
class AdminCollection extends BaseCollection{
  constructor(){
    super({url:'/todo'});
  }
}
export default AdminCollection;