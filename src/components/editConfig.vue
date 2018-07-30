<template>
<div id="config_container">
  <el-table
    :data="pagedData">

    <!-- config.config_list -->
    <el-table-column label="key" width="180" align="center">
      <template slot-scope="scope">
        <el-tag size="medium">{{ scope.row.key }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="value" >
      <template slot-scope="scope">
        <div slot="reference" class="name-wrapper">
            <el-tag size="medium" v-for = "(val, index) in scope.row.value"
            :key = "index">
                {{val}}
            </el-tag>
          </div>
      </template>
    </el-table-column>

    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination :total="total" :current-page="currentPage"
    :page-size="currentPageSize"
    layout="total, sizes, prev, pager,next, jumper"
    @size-change="pageSizeChange" @current-change="pageChange">
  </el-pagination>

  <div id="btns">
    <el-button type="primary" icon="el-icon-edit" @click="newItem">新建</el-button>
    <el-button type="success" icon="el-icon-check" @click="configSave">保存</el-button>
  </div>


  <config-dialogue :show = "edit_show" :default_data ="curr_data" @save="save" @close="close">
  </config-dialogue>
  <edit
</div>
</template>

<script src="https://cdn.bootcss.com/jquery/1.10.2/jquery.min.js"></script>
<script>
import configDialogue from "./configDialogue.vue"
import {HOST} from '../utils/config'
  export default {
    components:{
      configDialogue
    },

    data() {
      return {
        table_data: [],
        edit_show:false,

        curr_data:{
          index: Number,
          data:{
            key:String,
            value:[],
          }
        },
        id:"",//通过id来获取数据
        config:{},
        // total:0,
        currentPage: 1,
        currentPageSize: 10

      }
    },
    created(){
      this.id = this.$route.query.id;
      this.$ajax({
      //7 向站点请求{"_id":"5b470ba5fc6a38858a673ec8","lib_name":"Component Check"}的数组
        method:'POST',
        url:HOST+'/config/get_config',
        data: {"_id":this.id},
      }).then(response=>{
        this.config = response.data.config;
        console.log("this.config is ");
        console.log(this.config);
      }).catch(function(err){
        console.log(err);
      });
    },

    computed:{
      total(){
        if(!this.config.config_list){
          return 0;
        }
        return this.config.config_list.length;
      },

      pagedData(){
        if(!this.config.config_list){
          return [];
        }
        return this.config.config_list.slice((this.currentPage - 1) * this.currentPageSize, this.currentPage * this.currentPageSize)
      }
    },

    methods: {
      newItem() {
        var item = {};
        item.key="new";
        item.value=[];
        item.value.push("new");
        this.config.config_list.push(item);
      },
      handleEdit(index, row) {
        // console.log(index, row);
        // console.log("被点击的这行数据是：");
        // console.log(row);
        //console.log(index, row);
        var real_index = (this.currentPage - 1) * this.currentPageSize + index;
        this.editDialogue(real_index, row);
      },
      handleDelete(index, row) {
        // console.log("要删除的这行是");
        this.config.config_list.splice(index, 1);
        // console.log(row);
      },

      editDialogue(index, row){
        // console.log("进入showDialogue函数");
        this.edit_show = true;
        // console.log("this.edit_show"+this.edit_show);
        this.curr_data.data.key = row.key;

        this.curr_data.data.value = [].concat(row.value);

        this.curr_data.index = index;
        // console.log(this.curr_data);
      },
      close(){
        this.edit_show = false;
      },
      save(res){
        this.edit_show = false;
        // console.log(res);
        this.curr_data = res;
        console.log(this.curr_data);
        this.config.config_list[res.index].key = res.data.key;
        this.config.config_list[res.index].value = res.data.value;

      },

      pageSizeChange(size) {
        this.currentPageSize = size
      },
      pageChange(page) {
          this.currentPage = page
      },
      configSave(){
        this.$ajax({
          //5 向站点请求包含metadata和nodedata属性的字典数据，传参是被查询的lib的id
          method:'POST',
      //dataType:"jsonp",
          url:HOST + '/config/refresh_config',
          data: JSON.stringify(this.config),
        }).then(response=>{
          //node_data = response.data.nodedata;
          //6 路由跳转并传递lib的id， meta_data， node_data
          console.log(response.data);
          alert("保存成功");

        }).catch(function(err){
          console.log(err);
        });
      }
    }
  }
</script>
<style scoped>
/* #container{
  height: 90%;
} */

#config_container{
  position: relative;
  width: 60%;
  left: 20%;
}

/* .el-table {
    position: relative;
    width: 60%;
    left: 20%;
} */

.el-table .cell{
  text-align: center;
}

.el-tag{
  display:inline;
}

.el-pagination{
  position: relative;
  left: 10%;
}

#btns{
  position: relative;
  left: 50%;
  top: 10%;
}


</style>
