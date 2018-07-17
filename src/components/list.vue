<template>
<div>
  <div id="test">
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
export default {
  props: {
    node_data: {}
    //1 在layout中传入node_data的json内容
  },

  data() {
    return {
      //2 disable_flag决定了description是否可以编辑，table_data是table的数据来源
      //text_area存储输入框里的值，
      disable_flag:true,
      tableData: [],
      text_area:"",
      list_data:[]
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
      newInfo[strId].snl = node_datas[strId]["snl"];
    },

    handleEdit(index, row){
      //3 触发父组件对话框弹出
      console.log("enter handleEdit 函数");
      this.$emit("editDialogue");
    },

    handleDelete(index, row){
      alert("删除本行");
    },

    showList(data){
      console.log("进入show_list函数");
      this.list_data = data;`
      //先将"description"赋值给text`
      this.text_area = this.list_data.description;

      var node_datas = this.node_data.data;
      // console.log("in list nodedata_file is " + node_datas);
      var strId = data["id"].toString();
      var tempTableData = [];       //用来存储 tableData的值
      //4 便历数组来查询 id = "strId"的字典并将其snl属性赋值给tempTableData
      for(var node_data of node_datas){
          if(node_data.this_id == strId){
            var snl_spl_pairs = node_data["snl_spl_pairs"];
            for(var snl_spl of snl_spl_pairs){
                var dict = {};
                dict.snl = snl_spl.snl;
                tempTableData.push(dict);
            }
            this.tableData = tempTableData;
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
