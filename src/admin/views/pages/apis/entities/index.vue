<template>
  <div class="page-entities">
    <el-row style="padding: 20px 0;">
    </el-row>
    <el-table
      :data="items"
      >
      <el-table-column type="expand">
        <template scope="props">
          <div>
            <el-table
              v-if="props.row.properties"
              :data="Object.entries(props.row.properties)"
              >
              <el-table-column
                label="Name"
                width="180"
                >
                <template scope="scope">
                  {{scope.row[0]}}
                  <span v-if="scope.row[1].required" style="color:red;">
                    required
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="description"
                >
                <template scope="scope">
                  {{scope.row[1].description}}
                </template>
              </el-table-column>
              <el-table-column
                label="type"
                width="120"
                >
                <template scope="scope">
                  {{scope.row[1].type}}
                </template>
              </el-table-column>
              <el-table-column
                label="mock"
                width="120"
                >
                <template scope="scope">
                  <!--{{apis.collectionMock(scope.row[1],scope.row[0])}}-->
                </template>
              </el-table-column>
            </el-table>
            <pre v-if="!props.row.properties">{{JSON.stringify(props.row,0,2)}}
            </pre>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="Name"
        >
      </el-table-column>
      <el-table-column
        prop="type"
        label="TYPE"
        width="180"
        >
      </el-table-column>
      <el-table-column
        prop="description"
        label="description"
        >
      </el-table-column>
      <el-table-column
        label="properties"
        class="api-summary"
        width="180"
        >
        <template scope="scope">
          <span >
            {{Object.keys(scope.row.properties||{}).length||'-'}}
          </span>
        </template>
      </el-table-column>
      <!--
      <el-table-column
        label="action"
        class=""
        >
        <template scope="scope">
          <el-button style="" @click="onCreateGeneration(scope.row)" type="text">list</el-button>
        </template>
      </el-table-column>
      -->
    </el-table>
  </div>
</template>

<script>

import {escapeURI} from '$utils';
import {BaseCollection} from '$services/resources';
import { Apis} from '$app/services/resources';
import {mapGetters, mapState} from 'vuex';

import GenerationCreator from '$pages/generations/detail/creator';
import {MessageBox} from 'element-ui';

export default {
  name: 'entities',
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
      'items':'entities',
    }),
  },
  mounted(){
    this.generations = new BaseCollection({url:'/generations'});
    let items = [
      {to:{path:'/'},label:'Home'},
      {to:{path:'/apis/entities'},label:'Entities'},
    ];
    this.$emit('breadcrumb',items);
  },
  methods:{
    onCreateGeneration(item){
      let content = <GenerationCreator key={'creator_'+Date.now()} model={item}/>;
      MessageBox({
        customClass:'dialog-generation-creator',
        title:"Add Generation",
        message: content,
        showCancelButton:true,
        beforeClose:(action,instance,done)=>{
          console.log(content.componentInstance);
          if(action=='cancel'){
            return done();
          }
          let data = content.componentInstance.getValue();
          console.log(data);
          data.model=item;
          data.name=item.name;
          this.generations.create(data).then(rs=>{
            this.$message({
              type: 'success',
              message: 'success',
            });
            done();
          },err=>{
            this.$message({
              type: 'error',
              message: 'failed'+err.message,
            });
          });
        },
      }).then(rs=>{
        console.log(rs);
      })
    },
  }
};
</script>
<style lang="less">
.dialog-generation-creator{
  width: 800px;
}

</style>
