/**
 *  generate by Alodi <%=new Date()%>
 */

import {BaseCollection, BaseModel, rpc } from 'yard';

class <%=modelName%>Collection extends BaseCollection{
  constructor(){
    super({url:'<%=path%>'});
  }
}

export default <%=modelName%>Collection;

