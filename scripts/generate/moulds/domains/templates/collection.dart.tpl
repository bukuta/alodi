/**
 *  generate by Alodi <%=new Date()%>
 */

import '../yard/fetch/index.dart' as ajax;
import '../yard/base.dart';

import './<%=modelName%>Model.dart';


class <%=modelName%>Collection extends Base{
  // constructor
  List<<%=modelName%>> items = new List<<%=modelName%>>();
  <%=modelName%>Collection(String url){
    super(url);
  };

  toList(_items){
    items.clear();
    for(var item if _items){
      items.add(<%=modelName%>.fromJSON(item));
    }
  }
}

/**
 * usage
 */
//
//  //fetch
//  <%=modelName%>Collection collection = new <%=modelName%>Collection();
//  //update query
//  collection.set({'page':1,'pageSize':10});
//  //fetch with query or not
//  var items = await collection.fetch({'name':'a'});
//  // or
//  collection.items.forEach((item){
//     // ...
//  })
//
//  // update
//  <%=modelName%> model = collection.items.get(0);
//  await model.update({'name':'newName'});
//
//  // delete
//  await model.destory();
//  await <%=modelName%>collection.destory(model);
//
//  // create
//  <%=modelName%> model = await <%=modelName%>Collection.create({'id':1,'name':'name'});
//
//


