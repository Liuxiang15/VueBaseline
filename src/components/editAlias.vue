<template>
<div id="alias_container">
  <el-table :data="alias_list">

    <!-- config.config_list -->
    <el-table-column label="key" width="180" align="center">
      <template slot-scope="scope">
        <el-tag size="medium">{{ scope.row.key }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="value" >
      <template slot-scope="scope">
        <el-tag size="medium">{{ scope.row.value }}</el-tag>
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

  <el-dialog :title="title" :visible.sync="dialog_show">
    <el-form>
      <el-form-item label="key">
        <el-input v-model="new_key" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item label="value">
        <el-input  v-model="new_value" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" icon="el-icon-close" @click="close">关闭</el-button>
      <el-button type="success" icon="el-icon-check" @click="save">确定</el-button>
    </div>
  </el-dialog>
  <div id="btns">
    <el-button type="primary" icon="el-icon-edit" @click="newItem">新建</el-button>
    <el-button type="success" icon="el-icon-check" @click="aliasSave">保存</el-button>
  </div>
</div>
</template>

<script src="https://cdn.bootcss.com/jquery/1.10.2/jquery.min.js"></script>
<script>
// import configDialogue from "./configDialogue.vue"
import {HOST} from '../utils/config'
  export default {
    // components:{
    //   configDialogue
    // },

    data() {
      return {
        response:{},
        alias_list:[],
        dialog_show:false,
        new_key:"",
        new_value:"",
        current_index: 0,
        operation: 0,
        title:""
        //operation=1时，编辑，2时新建
      }
    },
    created(){
      this.response = this.$route.params.response;
      this.alias_list = this.$route.params.response.alias.alias_list;
      console.log("in created ");
      console.log(this.alias_list);
    },

    methods:{
      handleEdit(index, row){
        this.operation = 1;
        this.title = "编辑alias"
        this.dialog_show = true;
        this.current_index = index;
        this.new_key = this.alias_list[this.current_index].key;
        this.new_value = this.alias_list[this.current_index].value;

      },
      handleDelete(index, row) {
        this.alias_list.splice(index, 1);
      },

      close(){
        //所有对话框和菜单栏不可见
        this.dialog_show = false;
        this.new_key = "";
        this.new_value = "";
      },
      save(){
        // this.alias_list[this.current_index] = {
        //   key: this.new_key,
        //   value: this.new_value
        // };
        if(this.operation == 1){
          this.alias_list[this.current_index].key = this.new_key;
          this.alias_list[this.current_index].value = this.new_value;

          console.log(this.current_index);
          console.log(this.alias_list[this.current_index]);
        }
        else{
          const new_item = {
            key: this.new_key,
            value: this.new_value
          };
          this.alias_list.push(new_item);
          console.log("新增后的list是");
          console.log(this.alias_list);
        }

        this.new_key = "";
        this.new_value = "";
        this.dialog_show = false;
        console.log(this.response);
      },
      newItem(){
        console.log("进入newItem函数");
        this.operation = 2;
        this.title = "新建alias"
        this.dialog_show = true;
      },

      aliasSave(){

        this.$ajax({
          //5 向站点请求包含metadata和nodedata属性的字典数据，传参是被查询的lib的id
          method:'POST',
      //dataType:"jsonp",
          url:HOST + '/alias/refresh_alias',
          data: JSON.stringify(this.response.alias),
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
<style>
#alias_container{
  position: relative;
  width: 60%;
  left: 20%;
}

#btns{
  position: relative;
  left: 60%;
  top: 30%;
}

.el-dialog__headerbtn .el-dialog__close {
    color: #909399;
    display: none;
}
</style>
