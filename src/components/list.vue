<template>
<div id="container">
  <div v-show="description_show" id="text_container">
    <h2>自然语言描述</h2>
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

  <div  v-show="snl_show" id="snl_container">
    <span>
      <span>标签：</span>
        <el-tag v-for = "(tag, index) in current_node.tags" :key="index" size="medium">
          {{ tag }}
        </el-tag>
    </span>
    <!--用于展示规则的列表-->
    <el-table
    :data="show_snls"
    style="width: 100%">
      <el-table-column label="SNL语句">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.snl }}</el-tag>
          </div>
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

    <el-button type="primary" icon="el-icon-edit" @click="newItem">新建SNL语句</el-button>

    <el-table
    :data="show_rules"
    style="width: 100%">
      <el-table-column label="SNL语句">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.snl }}</el-tag>
          </div>
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

    <edit-dialogue :show = "edit_show"
    :default_data ="current_snl"
    :default_tags = "current_tags"
    ref = "edit_dialog"
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
        // index: Number,
        // snl: String,
        // spl:[]
      },
      current_tags:[],
      edit_show:false,
      description_show:false,
      snl_show:false,// 决定当前界面显示的是SNL列表，还是规则列表
      show_snls:[],//储存显示的SNL数组，要注意的是目录下所有的孩子的SNL,
      show_rules:[]
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

      console.log(row);

      this.current_snl.index = index;
      this.current_snl.snl = row.snl;
      this.current_snl.spl = [].concat(row.spl);
      this.$refs.edit_dialog.updateDefaultData(this.current_snl);
      this.edit_show = true;
      console.log(this.current_snl);
    },

    handleDelete(index, row){
      console.log("进入handleDelet函数");
      console.log("被删除的row.snl是" + row.snl);
      // console.log("this.list_data.id" + this.list_data.id);
      // console.log("this.list_data.text" + this.list_data.text);
      // console.log("this.list_data.description" + this.list_data.description);
      this.show_snls.splice(index, 1);
      //alert("删除本行");
    },

    showList(current_node){
      console.log("进入show_list函数");
      console.log(current_node);
      this.snl_show = true;
      this.current_node = current_node;
      if(this.current_node.is_rule){
        //叶子节点处理
        this.show_snls = current_node.snl_spl_pairs;
        this.description_show = true;
      }
      else{
        //目录节点处理
        this.description_show = false;
        this.show_snls = [];//首先清空
        this.getRules(current_node.children);
        // this.getShowSnls(this.current_node.children);
      }
    },
    getShowSnls(arr){
      //递归实现
      // console.log("进入getShowSnls函数");
      // console.log(arr);
      for(var child of arr){
        if(child.is_rule){
          //this.show_snls.push();
          // console.log("parent 是 ");
          // console.log(arr);
          this.show_snls = this.show_snls.concat(child.snl_spl_pairs);
          // console.log("孩子规则节点是：");
          // console.log(child);
        }
        else{
          // console.log("孩子目录节点是：");
          // console.log(child.children);
          this.getShowSnls(child.children);
        }
      }
      console.log("this.show_snls是:");
      console.log(this.show_snls);
    },
    //
    getRules(arr){
      for(var child of arr){
        if(child.is_rule){
          //this.show_snls.push();
          // console.log("parent 是 ");
          // console.log(arr);
          this.show_rules.push(child.text);
          // console.log("孩子规则节点是：");
          // console.log(child);
        }
        else{
          // console.log("孩子目录节点是：");
          // console.log(child.children);
          this.getShowSnls(child.children);
        }
      }
      console.log("this.rules是:");
      console.log(this.show_rules);
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
<style scoped>
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
  background-color: #EBEEF5;
  text-align: left;
}

#btns{
  position: relative;
  width: 60%;
}

.el-tag{
  display:inline;
}



</style>
