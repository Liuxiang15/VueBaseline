<template>
<div>
  <div id="test">
    <p>description</p>
    <el-input
      type="textarea"
      id="textarea"
      placeholder="请输入内容"
      v-model="textarea"
      v-bind:disabled= "disableFlag"
    >
    </el-input>
    <p></p>
    <div id="btns">
      <el-button type="primary" v-on:click='handleEditText()' >修改</el-button>
      <el-button type="success" v-on:click='SaveText()' >保存</el-button>
      <p></p>
    </div>
  </div>

  <p>SNL语句</p>
  <!--用于展示规则的列表-->
  <div>
    <el-table
    :data="tableData"
    style="width: 100%">

    <el-table-column
      label="SNL语句">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>snl语句: {{ scope.row.snl }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.snl }}</el-tag>
          </div>
        </el-popover>
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
  </div>
  </div>
</template>

<script>
//import layout from '../pages/layout.vue'
import LeftTree from '../components/leftTree'
export default {
  props: {
    node_data: {}
  },
  components:{
    LeftTree
  },
  data() {
    return {
      disableFlag:true,
      tableData: [],
      textarea:"",
      strId:"",
      list_data:[]
    }
  },
  methods:{
    handleEditText(){
      console.log("enter handleEditText函数");
      this.disableFlag = false;
    },


    SaveText(){
      // console.log("用户输入的text是"+this.textarea);
      console.log("enter saveText 函数");
      var newInfo = {};   //存储新增的｛text,snls｝对象
      var strId = this.list_data["id"].toString();
      newInfo[strId] = {};
      newInfo[strId].text = this.textarea;

      var node_datas = this.node_data.data;
      newInfo[strId].snl = node_datas[strId]["snl"];
    },

    handleEdit(index, row){
      //触发父组件对话框弹出
      console.log("enter handleEdit 函数");
      this.$emit("editDialogue");
    },

    handleDelete(index, row){

    },

    show_list(data){
      console.log("进入show_list函数");
      this.list_data = data;`
      //先将"description"赋值给text`
      this.textarea = this.list_data.description;

      //读入nodedata
      var node_datas = this.node_data.data;
      console.log("in list nodedata_file is " + node_datas);

      var strId = data["id"].toString();
      //保存当前list的id属性
      this.strId = strId;
      var tempTable = [];       //用来存储 tableData的值
      //便历数组来查询 id = "strId"的字典
      for(var node_data of node_datas){
          if(node_data.this_id == strId){
            var snl_spl_pairs = node_data["snl_spl_pairs"];
            for(var snl_spl of snl_spl_pairs){
                // console.log("enter the for loop");
                var dict = {};
                dict.snl = snl_spl.snl; //字典或者对象
                tempTable.push(dict);
            }
            this.tableData = tempTable;
            break;
          }
        }
    }
  }
}
</script>
<style>
p{
  text-align: center;
}

#btns{
  position: relative;
  width: 60%;
}
</style>
