# 代码生成

## 全局配置config
```javascript
paths={
  defines:"src/services/",
  domains:"src/services/",
  stores:"src/",
  pages:"src/views/",
}
```
config.yaml
```yaml
root: pwd()
paths:
  defines: src/services
  domains: src/services
  stores: src
  pages: src/views
```

project.yaml
```yaml
defines:
  User:
  Agent:
  Project:
  Scene:
  Movie:
domains:
  User:
    collection:
    model:
  Admin:
    collection:
stores:
  User:
    collection:
  Admin:
    collection:
  User:
    model:

pages:
  User:
    list:
      - filter:
          properties:
            name:
            org:
        pagination:
          page-sizes: [10, 20, 50]
          layout: total, sizes, prev, pager, next, jumper
        route: /users
        action:
          - create
          - edit
          - delete
          - detail
    picker:
      - filter:
          properties:
            name:
            org:
        pagination:
          page-sizes: [10, 20, 50]
          layout: total, sizes, prev, pager, next, jumper
    detail:
  Project:
    list:
    detail:

```




## 生成模型定义

>选择Schema无脑生成

- defines/<%=modelName%>/entity.js
- defines/<%=modelName%>/shapes/create.js
- defines/<%=modelName%>/mockdata.js

## 生成数据接口

> 选择paths, 无脑生成

- domains/<%=modelName%>Collection.js
- domains/<%=modelName%>Model.js

## 生成store

> 选择paths簇, Schema

- stores/<%=modelName%>/index.js

## 生成页面

> 选择Model, paths,
> 列表页？详情页?
> 配置: 过滤？分页？增?删?改?查？
> 是否独立页面？路由？

- pages/<%=modelName%>/index.vue
- pages/<%=modelName%>/detail/index.vue




