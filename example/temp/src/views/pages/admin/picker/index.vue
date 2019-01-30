<template>
  <div class="page page-admins">
    
    <el-form :inline="true" size="mini" :model="filters" class="form-inline">
      
          <el-form-item label="名字">
            <el-input v-model="filters.name" placeholder="名字"></el-input>
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
          type="selection"
          width="50"
          >
        </el-table-column>
        
        <el-table-column
          prop="id"
          label="ID"
          width="150"
          >
        
        </el-table-column>
        
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
          prop="password"
          label="密码"
          width="150"
          >
        
        </el-table-column>
        
        <el-table-column
          prop="status"
          label="用户目前的状态(0允许/1禁止/2锁定)"
          width="150"
          >
        
        </el-table-column>
        
        <el-table-column
          prop="creator"
          label=""
          width="150"
          >
        
        </el-table-column>
        
        <el-table-column
          prop="createAt"
          label=""
          width="150"
          >
        
        </el-table-column>
        
        <el-table-column
          prop="updateAt"
          label=""
          width="150"
          >
        
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
const helper = createNamespacedHelpers('admin-picker')




import Entity from '$defines/admin/entity.js';
import creator from '$mould/helper/dialog-creator.js';
import CreateShape from '$defines/admin/shapes/create.js';


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
  name: 'picker-admins',
  props: [],
  components: {
  },

  data(){
    return {
      filters:{"name":null}
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
          0:0,
          1:1,
          2:2,
      };

      return TYPES[type];
    },
  },

};
</script>


<style lang="less">
.page-admins-picker{
  .el-row{
    margin-bottom: 10px;
  }
}
</style>


