<template>
  <div>
    <demo-header></demo-header>
    <el-container>

    <el-aside width="500px">
      <left-tree v-on:listenToNodeClick="showMsgFromChild"></left-tree>
    </el-aside>
    <el-main>
      <p> {{pnodedata}}对应的text</p>
      <div id="test">
        <el-input
          type="textarea"
          id="textarea"
          placeholder="请输入内容"
          v-model="textarea"
          v-bind:disabled= "disableFlag"
          >
        </el-input>
        <el-button type="primary" v-on:click='handleEditText' >修改</el-button>
        <el-button type="success" v-on:click='SaveText' >保存</el-button>
      </div>

      <p> {{pnodedata}}对应的SNL语句</p>
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

      <!--修改SNL语句弹出对话框-->
      <div>
        <el-button type="text" @click="dialogFormVisible = true">SNL编辑页面</el-button>
        <el-dialog title="弹出对话框" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="新的SNL语句" :label-width="formLabelWidth">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="Label等其他属性" :label-width="formLabelWidth">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>
      </div>

    </el-main>
  </el-container>
  </div>
</template>

<script src="https://cdn.bootcss.com/jquery/1.10.2/jquery.min.js"></script>
<script>

import DemoHeader from '../components/demoHeader'
import LeftTree from '../components/leftTree'
import saveAs from "../../FileSaver.js"

export default {
  name: 'layout',
  components:{
    DemoHeader,
    LeftTree
    //list needs imported
  },
  data() {
    return {
      disableFlag:true,
      pnodedata: {},
      tableData: [],
      textarea:"",
      //以下属性是为了弹出对话框而设置的
      dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
    }
  },
  methods:{
    showMsgFromChild:function(data){
      this.pnodedata = data;
      var snlData = require("../../ruleObjects.json");
      var strId = this.pnodedata["id"].toString();
      var tempTable = [];       //用来存储 tableData的值
      if(!(strId in snlData["data"])){
          console.log("there are no snl sentences for id "+ strId);
      }
      else{
          this.textarea = [snlData["data"][strId]["text"]];
          var tempTable = [];
          var snls = snlData["data"][strId]["snl"];
          for(var i = 0; i < snls.length; i++){
            var dict = {};
            dict.snl = snls[i]; //字典或者对象
            tempTable.push(dict);
        }
        this.tableData = tempTable;
        console.log(tableData);
      }
    },
    handleEditText(){
      this.disableFlag = false;
    },
    SaveText(){
      console.log("用户输入的text是"+this.textarea);
      //var jsonFile = new File([""], "newruleObjects.json", { type: "text/plain;charset=utf-8" });
      //saveAs(jsonFile);
      //console.log("enter saveText 函数");
      var newInfo = {};   //存储新增的｛text,snls｝对象
      var strId = this.pnodedata["id"].toString();
      newInfo[strId] = {};
      newInfo[strId].text = this.textarea;
      var snlData = require("../../ruleObjects.json");
      newInfo[strId].snl = snlData["data"][strId]["snl"];
    },

  }
}
</script>

<style>
.el-tag {
    white-space: inherit !important;
}

.el-tag--medium {
    height: 100%;
}

.el-textarea.is-disabled .el-textarea__inner {
    color: black;
}

/* .el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}


/* .el-aside {
   background-color: #D3DCE6;
   color: #333;
   text-align: center;
   line-height: 200px;
   width:800px;
 } */

 /* .el-main {
   background-color: #E9EEF3;
   color: #333;
   text-align: center;
   line-height: 160px;
 }
.el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
    width:800px;
  } */
</style>
