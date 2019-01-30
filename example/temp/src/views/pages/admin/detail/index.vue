<template>
  <div class="panel-layer">
    <div @click="goBack" class="masker"></div>
    <div class="detail detail-agent">
      <header class="panel-header" >
        <i class="button-back el-icon-back" @click="goBack"></i>
        <span class="title">管理员详情</span>

        <el-button v-if="!editing" class="button-edit" icon="el-icon-edit" size="small" @click="editing=!editing"></el-button>
        <el-button v-if="editing" type="primary" class="button-edit" icon="el-icon-edit" size="small" @click="editing=!editing"></el-button>

        <el-button :disabled="editing" type="danger" class="button-edit" icon="el-icon-delete" size="small" @click="onDestory"></el-button>
      </header>
      <div class="content">
        <resource-modifier v-if="editing" class="form" ref='form' :entity="entity" :data="data" :shape="editShape" />
        <resource-viewer v-else class="form" ref='form' :entity="entity" :data="data" :shape="viewShape" />
        <el-row class="footer" v-if="editing">
          <el-button @click="onCancel">取消</el-button>
          <el-button @click="onSubmit" type="primary">保存</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>

import {ResourceViewer,ResourceModifier} from '$mould/view-builder';

import Entity from '$defines/agent/entity.js';
import ViewShape from '$defines/admin/shapes/view.js';
import CreateShape from '$defines/admin/shapes/create.js';
import EditShape from '$defines/admin/shapes/edit.js';

export default {
  name: 'detail-admin',
  props:['item','canEdit'],
  components:{
    'resource-viewer':ResourceViewer,
    'resource-modifier':ResourceModifier,
  },

  data(){
    let id = this.$route.params.adminId;
    return {
      id,
      editing:false,
      data:{id},
      entity:Entity,
      viewShape:ViewShape,
      editShape:EditShape,
    };
  },

  methods:{
    onEdit(){
      this.editing=true;
      this.shape = EditShape;
    },

    syncData(){
      // TODO
      console.log('TODO')

    },

    goBack(){
      this.$router.go(-1);
    },

    onCancel(){
      this.editing = false;
      this.shape = ViewShape;
    },

    onSubmit(){
      this.$emit('change',{...this.data});
    },

    onDestory(){
      this.$emit('delete',this.data, {goBack:true});
    },
  },
  mounted(){
    let id = this.$route.params.agentId;
    this.syncData();
  },
};
</script>

<style lang="less">

</style>
