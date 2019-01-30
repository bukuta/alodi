//
//  generate by Alodi Wed Jan 30 2019 18:37:19 GMT+0800 (China Standard Time)
//
// import "./yard/ss.dart";
class Admin /*extends SS*/{
  //ID
  String id;
  //名字
  String name;
  //中文名
  String cname;
  //密码
  String password;
  //用户状态
  int status;
  //创建者
  String creator;
  //创建于
  String createAt;
  //更新于
  String updateAt;
  //
  // toJSON
  Admin.fromJSON(data){
    id = data['id'];
    name = data['name'];
    cname = data['cname'];
    password = data['password'];
    status = data['status'];
    creator = data['creator'];
    createAt = data['createAt'];
    updateAt = data['updateAt'];
  }
  //
  // toJSON
  Map toJSON(){
    return {
      'id':id,
      'name':name,
      'cname':cname,
      'password':password,
      'status':status,
      'creator':creator,
      'createAt':createAt,
      'updateAt':updateAt,
    };
  }
}