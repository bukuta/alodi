//
//  generate by Alodi <%=new Date()%>
//
<% var types = {'string':'String', 'number':'int','bool':'bool','integer':'int'}; %>

// import "./yard/ss.dart";

class <%=modelName%> /*extends SS*/{
<%for(var name of Object.keys(model.properties)){ %>
  //<%=model.properties[name]['description']%>
  <%=types[model.properties[name]['type']||'string']%> <%=name %>;
<%}%>

  //
  // toJSON
  <%=modelName%>.fromJSON(data){
<%for(var name of Object.keys(model.properties)){ %>
    <%=name%> = data['<%=name%>'];
<%}%>
  }

  //
  // toJSON
  Map toJSON(){
    return {
      <%for(var name of Object.keys(model.properties)){ %>
      '<%=name%>':<%=name%>,
      <%}%>
    };
  }

}


