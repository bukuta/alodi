/**
 *  generate by Alodi <%=new Date()%>
 */
import {BaseCollection,BaseModel,rpc} from 'yard';

class <%=modelName%>Model extends Model{
  constructor({url}){
    super({url:url||'/system/config'})
  }
  <%for(var rpc of rpcs){%>
  @rpc('<%=rpc.path%>','<%=rpc.method%>')
  <%=rpc.name%>(params){
    // TODO 根据method 设定body
    return {
      body:JSON.stringify(params),
    };
  }
  <%}%>
}

