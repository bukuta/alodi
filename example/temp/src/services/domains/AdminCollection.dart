/**
 *  generate by Alodi Wed Jan 30 2019 18:37:19 GMT+0800 (China Standard Time)
 */
import '../yard/fetch/index.dart' as ajax;
import '../yard/base.dart';
import './AdminModel.dart';
class AdminCollection extends Base{
  // constructor
  List<Admin> items = new List<Admin>();
  AdminCollection(String url){
    super(url);
  };
  toList(_items){
    items.clear();
    for(var item if _items){
      items.add(Admin.fromJSON(item));
    }
  }
}
/**
 * usage
 */
//
//  //fetch
//  AdminCollection collection = new AdminCollection();
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
//  Admin model = collection.items.get(0);
//  await model.update({'name':'newName'});
//
//  // delete
//  await model.destory();
//  await Admincollection.destory(model);
//
//  // create
//  Admin model = await AdminCollection.create({'id':1,'name':'name'});
//
//