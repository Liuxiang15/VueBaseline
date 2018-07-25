<template>
<div id="container">
  <div id="text_container">
    <h2>description</h2>
    <el-input
      type="textarea"
      id="text_area"
      placeholder="请输入内容"
      v-model="current_node.description"
      v-bind:disabled= "disable_flag"
    >
    </el-input>
    </br>
    <div id="btns">
      <el-button type="primary" v-on:click='handleEditText()' >修改</el-button>
      <el-button type="success" v-on:click='saveText()' >保存</el-button>
      <p></p>
    </div>
  </div>



  <div id="snl_container">
    <span>
      <span>tags:</span>

        <el-tag v-for = "tag in current_node.tags" size="medium">
          {{ tag }}
        </el-tag>
    </span>


    <!-- <h2>SNL语句</h2> -->

    <!--用于展示规则的列表-->
    <el-table
    :data="current_node.snl_spl_pairs"
    style="width: 100%">
      <el-table-column label="SNL语句">
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


    <el-button type="primary" icon="el-icon-edit" @click="newItem">新建</el-button>
    <!-- <el-button type="success" icon="el-icon-check" @click="snlSave">保存</el-button> -->
    <edit-dialogue :show = "edit_show" :default_data ="current_snl"
    :default_tags = "current_tags"
    @save = "save" @close="close" >
    </edit-dialogue>
  </div>
</div>

</template>



<script>
import editDialogue from "../components/editDialogue.vue"
import {HOST} from '../utils/config'

export default {

  components:{
    editDialogue,
  },

  data() {
    return {
      //2 disable_flag决定了description是否可以编辑，table_data是table的数据来源
      //text_area存储输入框里的值，current_node存储当前被点击节点的信息
      //list_data存储当前节点的所有信息
      //edit_show决定对话框是否显示
      //default_tags是传入对话框的参数数组
      disable_flag:true,
      table_data: [],
      text_area:"",
      list_data:[],
      current_node:{},
      current_snl:{
        index: Number,
        snl: String,
        spl:[]
      },
      current_tags:[],
      edit_show:false,
    }
  },
  methods:{
    handleEditText(){
      console.log("enter handleEditText函数");
      this.disable_flag = false;
    },

    saveText(){
      // console.log("enter saveText 函数");
      var newInfo = {};
      var strId = this.list_data["id"].toString();
      newInfo[strId] = {};
      newInfo[strId].text = this.text_area;
      //var node_datas = this.node_data.data;
      //newInfo[strId].snl = node_datas[strId]["snl"];
    },

    handleEdit(index, row){
      //3 触发父组件对话框弹出
      // console.log("enter handleEdit 函数");
      // console.log("1111111111111111111111111");
      // console.log(index);
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(row);
      this.edit_show = true;
      this.current_snl.index = index;
      this.current_snl.snl = row.snl;
      this.current_snl.spl = [].concat(row.spl);
      //this.current_tags = [].concat();
    },

    handleDelete(index, row){
      // console.log("进入handleDelet函数");
      // console.log("被删除的row.snl是" + row.snl);
      // console.log("this.list_data.id" + this.list_data.id);
      // console.log("this.list_data.text" + this.list_data.text);
      // console.log("this.list_data.description" + this.list_data.description);
      this.current_node.snl_spl_pairs.splice(index, 1);
      //alert("删除本行");
    },

    showList(current_node){
      // console.log(current_node);
      // console.log("进入show_list函数");
      this.current_node = current_node;
      console.log("in showList");
      console.log(this.current_node);
      //先将"description"赋值给text
    },

    close(){
      this.edit_show = false;
    },

    save(res){
      this.edit_show = false;
      this.current_node.snl_spl_pairs[res.index].snl = res.snl;
      // console.log(res);
      // console.log(this.current_node);
      // console.log(this.current_node);
      //console.log(this.current_node[res.index]);
    },

    newItem() {
      var item = {};
      item.snl="new";
      item.spl=[];
      this.current_node.snl_spl_pairs.push(item);
    },

  }
}
</script>
<style>
#container{
  width: 70%;
  position: relative;
  left: 15%;
}

#text_container{
  max-height: 70%;
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

.el-tag{
  display:inline;
}



</style>
