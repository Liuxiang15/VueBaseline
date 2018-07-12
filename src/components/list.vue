<template>
<div>
  <p> id= {{this.strId}}对应的text</p>
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

  <p>id= {{this.strId}}对应的SNL语句</p>
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
      this.disableFlag = false;
    },
    SaveText(){
      console.log("用户输入的text是"+this.textarea);
      //var jsonFile = new File([""], "newruleObjects.json", { type: "text/plain;charset=utf-8" });
      //saveAs(jsonFile);
      //console.log("enter saveText 函数");
      var newInfo = {};   //存储新增的｛text,snls｝对象
      var strId = this.list_data["id"].toString();
      newInfo[strId] = {};
      newInfo[strId].text = this.textarea;
      var snlData = require("../../ruleObjects.json");
      newInfo[strId].snl = snlData["data"][strId]["snl"];
    },
    show_list(data){
      console.log("进入show_list函数");
      this.list_data = data;`

      //先将"description"赋值给text`
      console.log("this.list_data.description是" + this.list_data.description);
      console.log("this.list_data.id是" + this.list_data.id);
      this.textarea = this.list_data.description;


      var nodedata_file = require("../../get_nodedata.json");
      var node_datas = nodedata_file["data"]["data"];
      console.log("node_datas是"+node_datas);
      var strId = data["id"].toString();

      this.strId = strId;


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

    }

  }
}
</script>
