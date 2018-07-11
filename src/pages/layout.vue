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
        <el-button type="primary" v-on:click='handleEditText()' >修改</el-button>
        <el-button type="success" v-on:click='SaveText()' >保存</el-button>
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
      <edit-dialogue>这里是对话框</edit-dialogue>

    </el-main>
  </el-container>
  </div>
</template>

<script src="https://cdn.bootcss.com/jquery/1.10.2/jquery.min.js"></script>
<script>

import DemoHeader from '../components/demoHeader'

import LeftTree from '../components/leftTree'
import saveAs from "../../FileSaver.js"
import editDialogue from "../components/editDialogue.vue"

export default {
  name: 'layout',
  components:{
    DemoHeader,
    LeftTree,
    editDialogue
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
      console.log("enter showMsgFromChild函数");
      this.pnodedata = data;
      var nodedata_file = require("../../get_nodedata.json");
      var node_datas = nodedata_file["data"]["data"];
      console.log("node_datas是"+node_datas);
      var strId = this.pnodedata["id"].toString();
      var tempTable = [];       //用来存储 tableData的值
      //便历数组来查询 id = "strId"的字典
      for(var node_data of node_datas){
          // console.log("node_data是"+node_data);
          // console.log("node_data的id是"+node_data.id);
          // console.log("node_data的snl_spl_pairs是"+node_data.snl_spl_pairs);
          // console.log("node_data的snl_spl_pairs[0].snl是"+node_data.snl_spl_pairs[0].snl);
          // //console.log("node_data的snl_spl_pairs[1].snl是"+node_data.snl_spl_pairs[1].snl);
          // console.log("node_data.id是"+node_data.id);
          // console.log("strId是"+strId);
          // console.log(node_data.id == strId);
          if(node_data.id == strId){
            console.log(node_data.id);
            console.log(strId);
            var snl_spl_pairs = node_data["snl_spl_pairs"];
            console.log("snl_spl_pairs是"+snl_spl_pairs);
            console.log("snl_spl_pairs[0].snl是:"+snl_spl_pairs[0].snl);
            console.log("snl_spl_pairs的length是"+snl_spl_pairs.length);
            for(var snl_spl of snl_spl_pairs){
                console.log("enter the for loop");
                var dict = {};
                dict.snl = snl_spl.snl; //字典或者对象
                console.log("node_data的snl_spl_pairs[0].snl是"+node_data.snl_spl_pairs[0].snl);
                tempTable.push(dict);
                console.log(tempTable);
            }
            this.tableData = tempTable;
            console.log("this.table 是 " + this.tableData);
            break;
          }
      }
    },
        // if(!(strId in node_datas)){
        //     console.log("there are no snl sentences for id "+ strId);
        // }
        // else{
        //     this.textarea = [snlData["data"][strId]["text"]];
        //     var tempTable = [];
        //     var snls = snlData["data"][strId]["snl"];
        //     for(var i = 0; i < snls.length; i++){
        //       var dict = {};
        //       dict.snl = snls[i]; //字典或者对象
        //       tempTable.push(dict);
        //   }
        //   this.tableData = tempTable;
        //   console.log(tableData);
        // }
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
