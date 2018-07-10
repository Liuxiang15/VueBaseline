<template>
  <div>
    <demo-header></demo-header>
    <el-container>

    <el-aside width="500px">
      <left-tree v-on:listenToNodeClick="showMsgFromChild"></left-tree>
    </el-aside>
    <el-main>
      <p> {{pnodedata}}对应的text</p>
      <div>
        <el-table
        :data="textData"
        max-height="100">
        <el-table-column
          label="text">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>text: {{ scope.row.textData }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.textData }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        </el-table>
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
    </el-main>
  </el-container>
  </div>
</template>


<script>

import DemoHeader from '../components/demoHeader'
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
      pnodedata: {},
      tableData: [],
      textData:["还未描述"],
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
          this.textData = [snlData["data"][strId]["text"]];
          console.log("this.textData"+this.textData);
          var tempTable = [];
          var snls = snlData["data"][strId]["snl"];
          for(var i = 0; i < snls.length; i++){
            var dict = {};
            dict.snl = snls[i]; //字典或者对象
            tempTable.push(dict);
        }
        this.tableData = tempTable;
        this.textData = [snlData["data"][strId]["text"]];
      }
    }
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
