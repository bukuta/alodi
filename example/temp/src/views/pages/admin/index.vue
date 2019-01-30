<template>
  <div class="page page-admins">
    <el-row>
      管理员列表
    </el-row>


    <el-form :inline="true" size="mini" :model="filters" class="form-inline">

          <el-form-item label="名字">
            <el-input v-model="filters.name" placeholder="名字"></el-input>
          </el-form-item>

          <el-form-item label="中文名">
            <el-input v-model="filters.cname" placeholder="中文名"></el-input>
          </el-form-item>

          <el-form-item label="用户状态">
            <el-select v-model="filters.status" placeholder="用户状态">
              <el-option value="0" label="允许"/>
              <el-option value="1" label="禁止"/>
              <el-option value="2" label="锁定"/>
            </el-select>
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
          prop="name"
          label="名字"
          width="150"
          >

        </el-table-column>

        <el-table-column
          prop="cname"
          label="中文名"
          width="150"
          >

        </el-table-column>

        <el-table-column
          prop="phone"
          label=""
          width="150"
          >

        </el-table-column>

        <el-table-column
          prop="department"
          label=""
          width="150"
          >

        </el-table-column>

        <el-table-column
          prop="status"
          label="用户状态"
          width="150"
          >

          <template slot-scope="scope">
            <el-tag>{{scope.row.status|statusFormater}}</el-tag>
          </template>

        </el-table-column>


        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="150">
          <template slot-scope="scope">
            <el-button @click="onDetail(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="onEdit(scope.row)" type="text" size="small">编辑</el-button>
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
        :page-sizes="[10,20,50]"
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

import { mapState, mapActions ,mapMutations, createNamespacedHelpers } from 'vuex'
const helper = createNamespacedHelpers('admin')


import {AdminDetail} from './detail/index.vue';



import Entity from '$defines/admin/entity.js';

import creator from '$mould/helper/dialog-creator.js';
import CreateShape from '$defines/admin/shapes/create.js';

import editor from '$mould/helper/dialog-editor.js';
import EditShape from '$defines/admin/shapes/edit.js';


const RESOURCE_NAME="管理员";

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




export default {
  name: 'admins',
  props: [],
  components: {
  },

  data(){
    return {
      filters:{"name":null,"cname":null,"status":null}
    };
  },

  computed: {
    ...helper.mapState({
      items: state=>state.items,
      total: state=>state.total,
      pageSize: state=>state.pageSize,
      currentPage: state=>state.currentPage,
      remoteFilters: state=>state.filters,
    }),
  },

  watch: {
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

    onSizeChange(size){
      this.updateSearch({pageSize,currentPage:0});
    },

    onCurrentChange(page){
      this.updateSearch({currentPage});
    },

    // ---------搜索过滤
    onSearch(){
      this.updateSearch({currentPage:0,filters:{...this.filters}});
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

    // ---------删除
    async onDelete(item,options){
      await this.$alert(`删除管理员"${item.name}"`,
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

    // ---------编辑
    onEdit(item){
      this.$router.push({name: 'admin-detail-edit',params:{
        adminId:item.id,
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

    onDetail(item){
      this.$router.push({name: 'admin-detail',params:{
        adminId:item.id,
      }});
    },


  },

  mounted(){
    this.fetchItems();
  },

  filters:{
    statusFormater(type){
      if(typeof(type)=='undefined'){
        return '-';
      }

      let TYPES={
          0:"允许",
          1:"禁止",
          2:"锁定",
      };

      return TYPES[type];
    },
  },

};
</script>


<style lang="less">
.page-admins{
  .el-row{
    margin-bottom: 10px;
  }
}
</style>

