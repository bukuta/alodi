<template>
  <div class="page page-roles">
    <el-row>
      角色列表
    </el-row>


    <el-form :inline="true" size="mini" :model="filters" class="form-inline">
      <el-form-item label="">
        <el-input v-model="filters.name" placeholder="角色名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="clearSearch">重置</el-button>
        <el-button type="primary" @click="onCreate">添加</el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-table
        :data="items"
        border
        size="small"
        :resizable="false"
        style="width: 100%">
        <el-table-column
          label="角色类型"
          width="150"
          >
          <template slot-scope="scope" >
            <el-tag>{{scope.row.type|formatRoleType}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="150">
        </el-table-column>
        <el-table-column
          prop="description"
          label="说明"
          >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="140"
          >
          <template slot-scope="scope">
            {{scope.row.createTime|formatDateTime}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="220">
          <template slot-scope="scope">
            <el-button @click="onEdit2(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="onEditResources(scope.row)" type="text" size="small">分配权限</el-button>
            <el-button @click="onEditMenus(scope.row)" type="text" size="small">分配菜单</el-button>
            <el-button @click="onDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row style="text-align:right;">
      <el-pagination
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-row>
    <router-view @change="onChange" @delete="onDelete">
    </router-view>

  </div>
</template>


<script>


// @config-start
import { mapState, mapActions ,mapMutations, createNamespacedHelpers } from 'vuex'
const helper = createNamespacedHelpers('roles')
import {MessageBox} from 'element-ui';

import {Roles} from '$services/domains/Roles';

let dialogIndex = 0;


import creator from '$mould/helper/dialog-creator.js';
import editor from '$mould/helper/dialog-editor.js';
import Entity from '$services/defines/role/entity.js';
import CreateShape from '$services/defines/role/shapes/create.js';
import EditShape from '$services/defines/role/shapes/edit.js';

const RESOURCE_NAME="角色";

const TITLES={
  'destroy':`删除${RESOURCE_NAME}`,
  'create':`添加${RESOURCE_NAME}`,
  'update':`更新${RESOURCE_NAME}`,
};
const MESSAGES_SUCCESS={
  'destroy':'删除成功',
  'create':'添加成功',
  'update':'更新成功',
};
const MESSAGES_FAILED={
  'destroy':'删除失败',
  'create':'添加失败',
  'update':'更新失败',
};


import TreePicker from '$components/picker/tree.vue';

// @config-end

export default {
  name: 'roles',
  components:{
    'tree-picker':TreePicker,
  },


  data(){
    return {
      filters:{
        name:'',
        group:'M1',
      },
    };
  },

  computed:{
    ...helper.mapState({
      items: state=>state.items,
      total: state=>state.total,
      pageSize: state=>state.pageSize,
      currentPage: state=>state.currentPage,
      remoteFilters: state=>state.filters,
    }),
    ...mapState("menus",{
      menus: state=>state.items,
    }),
    ...mapState("resources",{
      resources: state=>state.items,
    }),
  },

  watch:{
    // 表单类 本地data数据与vuex数据同步
    // vuex.form ==> this.form
    remoteFilters(newfilters){
      this.filters = {...newfilters};
    },
  },

  methods:{
    ...helper.mapActions([
      'fetchItems',
      'clearSearch',
      'updateSearch',
      'create',
      'update',
      'destroy',
    ]),

    handleClose(done){
      done();
    },

    // ---------搜索过滤
    onSearch(){
      this.updateSearch({currentPage:0,filters:{...this.filters}});
    },

    // ---------列表分页
    onSizeChange(pageSize){
      this.updateSearch({pageSize,currentPage:0});
    },
    onCurrentChange(currentPage){
      this.updateSearch({currentPage});
    },

    // ---------创建
    //@create({child:Detail,mode:'create',title:'添加坐席'})
    onCreate(){
      creator(this,this.$createElement,{
        title  : TITLES.create,
        data   : {},
        entity : Entity,
        shape  : CreateShape,
      }).then(rs=>{
        console.log('onCreate',rs);
        this.create(rs);
      });
    },

    // ---------查看
    onDetail(item){
      this.$router.push({name: 'agent-detail',params:{
        id:item.id,
      }});
    },
    onDetail2(item){
    },

    // ---------删除
    async onDelete(item,options){
      await this.$alert(`删除角色"${item.name}"`,
        TITLES.destroy,
      )
      try{
        await this.destroy(item);
        this.$message(MESSAGES_SUCCESS.destroy);
        if(options&&options.goBack){
          // TODO replace
          this.$router.go(-1);
        }
      }catch(e){
        this.$message(MESSAGES_FAILED.destroy);
      }
    },

    // ---------修改
    async onChange(data){
      console.warn('onChange',data);
      try{
        await this.update({...data});
        this.$message(MESSAGES_SUCCESS.update);
      }catch(e){
        this.$message(MESSAGES_FAILED.update);
      }
    },

    // ---------编辑
    onEdit(item){
      this.$router.push({name: 'agent-detail-edit',params:{
        agentId:item.id,
      }});
    },
    onEdit2(item){
      creator(this,this.$createElement,{
        title  : TITLES.update,
        data   : {...item},
        entity : Entity,
        shape  : EditShape,
      }).then(rs=>{
        console.log('onEdit',rs);
        this.update(rs).then(rs=>{
          this.$message({type:'success',message:MESSAGES_SUCCESS.update})
        },err=>{
          this.$message({type:'error',message:MESSAGES_FAILED.update})
        });
      });
    },


    async onEditResources(item){
      console.warn('editResources',item);

      let roles = new Roles();
      let resourcesCollection = roles.select(item.id).exsertModel('resources');

      let rs = await resourcesCollection.fetch();
      console.warn(rs.data);
      let resources = rs.data.ownResourceIds;
      console.warn('editResources',resources);
      let selected = resources;

      let content = (
        <TreePicker items={this.resources }
          key={dialogIndex++}
          selected={selected} 
          node-key="id" 
          default-options={{label:'name',children:'children'}}
          style={{}}
          >
        </TreePicker>);
      MessageBox({
        title:"分配权限",
        message: content,
      }).then(rs=>{
        console.warn('selected:',rs);
        let r = content.componentInstance.getValue();
        console.warn('selected:',r);
        resourcesCollection
          .update(r)
          .then(rs=>{
            this.$message({type:'success',message:MESSAGES_SUCCESS.update})
          },err=>{
            this.$message({type:'error',message:MESSAGES_FAILED.update})
          });
      });
    },
    async onEditMenus(item){
      console.warn('editMenus',item);

      let roles = new Roles();
      let role = roles.select(item.id);
      console.warn(role);
      let rs = await  role.exsertModel('menus').fetch();
      console.warn(rs.data);
      let menus = rs.data.ownMenuIds;
      console.warn('editMenus',menus);
      let selected = menus;

      let content = (
        <TreePicker items={this.menus }
          key={dialogIndex++}
          selected={selected} 
          node-key="id" 
          default-options={{label:'name',children:'children'}}
          >
        </TreePicker>);
      MessageBox({
        title:"分配菜单",
        message: content,
      }).then(rs=>{
        console.warn('selected:',rs);
        let r = content.componentInstance.getValue();
        console.warn('selected:',r);
        role.exsertCollection('menus')
          .update(r)
          .then(rs=>{
            this.$message({type:'success',message:MESSAGES_SUCCESS.update})
          },err=>{
            this.$message({type:'error',message:MESSAGES_FAILED.update})
          });
      });
    },

  },


  mounted(){
    this.fetchItems();
  },

};
</script>


<style lang="less">
.page-roles{
  .el-row{
    margin-bottom: 10px;
  }
  .el-button--small{
    padding: 0 ;
  }
}
</style>

