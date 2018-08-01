/**
 *  generate by Alodi
 */
import {BaseCollection, BaseModel, rpc } from 'yard';
class <%=modelName%>Collection extends BaseCollection{
  constructor(){
    super({url:'<%=path%>'});
  }
}

export {<%=modelName%>Collection};

