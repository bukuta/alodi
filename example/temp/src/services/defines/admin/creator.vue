<template>
  <el-form ref="form">
    
    <el-form-item label="ID">
      <el-input v-model="form.id" placeholder="ID"></el-input>
    </el-form-item>
    
    
    <el-form-item label="名字">
      <el-input v-model="form.name" placeholder="名字"></el-input>
    </el-form-item>
    
    
    <el-form-item label="中文名">
      <el-input v-model="form.cname" placeholder="中文名"></el-input>
    </el-form-item>
    
    
    <el-form-item label="密码">
      <el-input v-model="form.password" placeholder="密码"></el-input>
    </el-form-item>
    
    
    <el-form-item label="用户状态">
      <el-select v-model="form.status" placeholder="用户状态">
        <el-option :value="0" label="允许"/>
        <el-option :value="1" label="禁止"/>
        <el-option :value="2" label="锁定"/>
      </el-select>
    </el-form-item>
    
    
    <el-form-item label="创建者">
      <el-input v-model="form.creator" placeholder="创建者"></el-input>
    </el-form-item>
    
    
    <el-form-item label="创建于">
      <el-input v-model="form.createAt" placeholder="创建于"></el-input>
    </el-form-item>
    
    
    <el-form-item label="更新于">
      <el-input v-model="form.updateAt" placeholder="更新于"></el-input>
    </el-form-item>
    
    
  </el-form>
</template>

<script>

const defaultForm = {
  "name": "",
  "cname": "",
  "password": "",
  "status": 0,
  "createAt": "",
  "updateAt": ""
};

export default {
  name: 'admin-creator',
  props:['detail'],

  data(){
    let form = {...defaultForm, ...this.detail};
    return {
      form,
    };
  },

  computed:{
  },

  watch:{
    detail(){
      this.form = {...this.form,...this.detail};
    },
  },

  methods:{
    getValue(){
      return {...this.form};
    },

    validate(){
      return this.$refs.form.validate();
    },
    resetFields(){
      return this.$refs.form.resetFields();
    },

  },
};
</script>
