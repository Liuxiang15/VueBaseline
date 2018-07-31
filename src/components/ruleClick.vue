<template>
  <div id="snl_box">
    <div id="description_container">
      <h2>{{this.current_node.text}}的自然语言描述</h2>
      <el-input
        type="textarea"
        id="text_area"
        rows=6
        v-model="current_node.description"
        v-bind:disabled= "disable_flag"
      >
      </el-input>
      <div id="btns">
        <el-button type="primary" v-on:click='editDescription()' >修改</el-button>
        <el-button type="success" v-on:click='saveDescription()' >保存</el-button>
      </div>
    </div>

    <div id="snl_container">
      <div id="tag-span">
        <span>标签：</span>
        <el-tag v-for = "(tag, index) in current_node.tags" :key="index" size="medium">
          {{ tag }}
        </el-tag>
      </div>
      <!--用于展示规则的列表-->
      <el-table
        :data="this.current_node.snl_spl_pairs"
        style="width: 100%">
        <el-table-column label="SNL语句">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              {{ scope.row.snl }}
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

      <!-- <edit-dialogue :show = "edit_show"
        :default_data ="current_snl"
        :default_tags = "current_tags"
        ref = "edit_dialog"
        @save = "save" @close="close" >
      </edit-dialogue> -->
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
      //2 disable_flag决定了description是否可以编辑
      //text_area存储输入框里的值，current_node存储当前被点击节点的信息
      //list_data存储当前节点的所有信息
      //edit_show决定对话框是否显示
      //default_tags是传入对话框的参数数组
      disable_flag:true,
      text_area:"",
      current_node:{},
      edit_show:false,
    }
  },
  methods:{
    showList(current_node){
      console.log("进入show_list函数");
      console.log(current_node);
      this.current_node = current_node;
    },

    editDescription(){
      this.disable_flag = false;
    },

    saveDescription(){
      this.disable_flag = true;
    }
}
}
</script>
<style scoped>

#description_container{
  max-height: 40%;
  box-sizing: border-box;
  background-color: #F2F6FC;
  padding:2% 2%;
}

#snl_container{
  max-height: 70%;
  box-sizing: border-box;
}

#tag-span{
  position: relative;
  min-width: 30%;
  max-width: 40%;
  display: inline-flex;
  justify-content:space-around;
}
/* p{
  text-align: center;
} */

.el-table td, .el-table th.is-leaf {
  background-color: #EBEEF5;
  text-align: left;
}

#btns{
  position: relative;
  width: 60%;
}

/* .el-tag{
  display:inline;
} */



</style>
