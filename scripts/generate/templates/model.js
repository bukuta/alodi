import {Model,rpc} from 'yarr';

class ConfigModel extends Model{
  constructor(){
    super({url:'/system/config'})
  }
  @rpc('/login','POST')
  login(params){
    return {
      body:JSON.stringify(params),
    };
  }
}
