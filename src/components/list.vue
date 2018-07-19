<template>
<div id="container">
  <div id="text_container">
    <p>description</p>
    <el-input
      type="textarea"
      id="text_area"
      placeholder="请输入内容"
      v-model="text_area"
      v-bind:disabled= "disable_flag"
    >
    </el-input>
    <p></p>
    <div id="btns">
      <el-button type="primary" v-on:click='handleEditText()' >修改</el-button>
      <el-button type="success" v-on:click='saveText()' >保存</el-button>
      <p></p>
    </div>
  </div>
  <div id="snl_container">
    <p>SNL语句</p>
    <!--用于展示规则的列表-->
    <el-table
    :data="table_data"
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
            @click="handleEdit(scope.$index, scope.row) ">编辑</el-button>
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

import {HOST} from '../utils/config'

<script>
export default {

  data() {
    return {
      //2 disable_flag决定了description是否可以编辑，table_data是table的数据来源
      //text_area存储输入框里的值，current_node存储当前被点击节点的信息
      //list_data存储当前节点的所有信息
      disable_flag:true,
      table_data: [],
      text_area:"",
      list_data:[],
      current_node:{}
    }
  },
  methods:{
    handleEditText(){
      console.log("enter handleEditText函数");
      this.disable_flag = false;
    },

    saveText(){
      console.log("enter saveText 函数");
      var newInfo = {};
      var strId = this.list_data["id"].toString();
      newInfo[strId] = {};
      newInfo[strId].text = this.text_area;
      //var node_datas = this.node_data.data;
      //newInfo[strId].snl = node_datas[strId]["snl"];
    },

    handleEdit(index, row){
      //3 触发父组件对话框弹出
      console.log("enter handleEdit 函数");
      this.$emit("editDialogue");
    },

    handleDelete(index, row){
      console.log("进入handleDelet函数");
      console.log("被删除的row.snl是" + row.snl);
      console.log("this.list_data.id" + this.list_data.id);
      console.log("this.list_data.text" + this.list_data.text);
      console.log("this.list_data.description" + this.list_data.description);
      for(var index = 0; index < this.table_data.length; index++){
        //在存储列表数据的table_data里遍历并删除该元素
        if(this.table_data[index].snl == row.snl){
          this.table_data.splice(index, 1);
        }
      }
      //alert("删除本行");
    },

    showList(current_node){
      console.log(current_node);
      console.log("进入show_list函数");
      this.list_data = current_node;
      //先将"description"赋值给text
      this.text_area = this.list_data.description;
      // console.log("in list nodedata_file is " + node_datas);
      //var strId = data["id"].toString();
      var strId = current_node.id;
      var snl_spl_pairs = {};
      this.$ajax({
        //5 向站点请求包含metadata和nodedata属性的字典数据，传参是被查询的lib的id
        method:'POST',
		//dataType:"jsonp",
        url:HOST + '/data/get_snl_spl_pairs',
        data: {"_id":strId},
      }).then(response=>{
        console.log("list收到的snl_spl_pairs是：");
        console.log(response.data.snl_spl_pairs.data);
        snl_spl_pairs = response.data.snl_spl_pairs.data;
        var tempTableData = [];       //用来存储 tableData的值
        //4 便历数组来查询 id = "strId"的字典并将其snl属性赋值给tempTableData
        for(var snl_spl of snl_spl_pairs){
            var dict = {};
            console.log("============");
            console.log(snl_spl);
            dict.snl = snl_spl.snl;
            tempTableData.push(dict);
        }
        this.table_data = tempTableData;
        console.log("this.table_data是：");
        console.log(this.table_data);
      }).catch(function(err){
        console.log(err);
      // });
    });

    }
  }
}
</script>
<style>
#container{

}

#text_container{
  max-height: 50%;
  box-sizing: border-box;
  background-color: #F2F6FC;
  padding:5% 10%;
}

#snl_container{
  max-height: 60%;
  box-sizing: border-box;
}

p{
  text-align: center;
}

.el-table td, .el-table th.is-leaf {

    background-color: ##EBEEF5;
}

#btns{
  position: relative;
  width: 60%;
}

</style>
