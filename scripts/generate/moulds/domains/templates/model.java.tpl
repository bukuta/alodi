/**
 *  generate by Alodi <%=new Date()%>
 */
<%var types = { 'string':'String', 'integer':'int', };%>
package <%=options.package%>;

import lombok.Data;

//
//
@Data
public class <%=modelName%>{
<%for(var propertyName in model.properties){%>
  <%=types[model.properties[propertyName].type||'string']%> <%=propertyName%>;
<%}%>
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


