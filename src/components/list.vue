<template>
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
</template>

<script>

import LeftTree from '../components/leftTree'

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
      textarea:""
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
      console.log("newInfo is "+newInfo);
      console.log(newInfo[strId]);
      console.log(newInfo[strId]["text"]);
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

</style>
