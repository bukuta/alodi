<template>
  <div class="page-tags">
    <el-row style="padding: 20px 0;">
    </el-row>
    <el-table
      :data="items"
      >
      <el-table-column
        prop="name"
        label="Name"
        width="180"
        >
      </el-table-column>
      <el-table-column
        prop="description"
        label="description"
        >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';


export default {
  name: 'tags',
  props:[
    'apis',
  ],
  components:{
  },
  data(){
    return { };
  },
  computed:{
    ...mapGetters('specStore',{
      tags: 'tags',
    }),
    items:function(){
      let items = Object.values(this.tags)
      return items;
    },
  },
  mounted(){
    let items = [
      {to:{path:'/'},label:'Home'},
      {to:{path:'/apis/tags'},label:'Tags'},
    ];
    this.$emit('breadcrumb',items);
  },
  methods:{
  }
};
</script>
<style lang="less">

</style>
