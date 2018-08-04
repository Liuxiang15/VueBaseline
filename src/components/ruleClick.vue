<template>
  <div id="snl_box">
    <div id="description_container">
      <h2>{{this.current_node.text}}自然语言描述</h2>
      <el-input
        type="textarea"
        id="text_area"
        rows=3
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
        <el-tag  v-for = "(tag, index) in current_node.tags"
          :key="tag" size="medium"  closable
          @close="handleClose(tag)">
          {{ tag }}
        </el-tag>
        <el-select v-model="label" filterable placeholder="新增规则库标签"
          @change="selectTag(label)"
        >
          <el-option
            v-for="item in tag_options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <!--用于展示规则的列表-->
      <el-button id="new-snl"type="primary" icon="el-icon-edit" @click="newSNL">新建SNL语句</el-button>
      <el-table
        :data="this.current_node.snl_spl_pairs">
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
              @click="snlEdit(scope.$index, scope.row) ">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="snlDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <edit-dialogue
        :show = "edit_show"
        ref = "edit_dialog"
        :parent = "parent_name"
        :config_keys="config_keys"
        @save = "save" @close="close" >
      </edit-dialogue>

      <el-dialog
        title="删除提示"
        :visible.sync="snl_delete_show"
        center>
        <span>您确定删除选中的SNL语句吗？</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="snlCancelDelete">取 消</el-button>
        <el-button type="primary" @click="snlSureDelete">确 定</el-button>
      </span>
      </el-dialog>


    </div>
  </div>

</template>

<script>
import editDialogue from "../components/editDialogue.vue"
import {HOST} from '../utils/config'

export default {

  //id是用来查询规则库的标识
  props:["tag_options", "id", "config_keys"],
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
      snl_delete_show:false,
      current_snl:{},
      parent_name:"rule",
      label:"",//v-model的值为当前被选中的el-option的 value 属性值


    }
  },

  created(){
    // console.log("进入ruleClick的create函数");
  },
  methods:{
    showList(current_node){
      // console.log("进入show_list函数");
      // console.log(current_node);
      this.current_node = current_node;
      console.log("id is --------------------------------");

      console.log(this.id);
      // this.$ajax({
      // //7 向站点请求{"_id":"5b470ba5fc6a38858a673ec8","lib_name":"Component Check"}的数组
      //   method:'POST',
      //   data:{"_id":this.id},
      //   url:HOST+'/config/get_config'
      // }).then(response=>{
      //   console.log("in editDialogue get config is ")
      //   console.log(response.data);
      //
      // }).catch(function(err){
      //   console.log(err);
      // });

    },

    editDescription(){
      this.disable_flag = false;
    },

    saveDescription(){
      this.disable_flag = true;
    },

    snlEdit(index, row_data){

      this.current_snl = this.current_node.snl_spl_pairs[index];
      // this.current_snl.index = index;
      console.log("this.current_snl是");
      console.log(this.current_snl);
      console.log(this.config_keys);
      this.$refs.edit_dialog.updateDefaultData(this.current_snl, index, this.config_keys);
      this.edit_show = true;
    },

    snlDelete(index, row_data){
      console.log("进入SNL删除函数");
      this.current_snl = this.current_node.snl_spl_pairs[index];
      this.snl_delete_show = true;
      console.log(this.current_snl);
      console.log(this.current_node);
      // this.current_node.snl_spl_pairs.splice(index, 1);
    },

    snlSureDelete(){
      let index = this.current_node.snl_spl_pairs.indexOf(this.current_snl);
      this.current_node.snl_spl_pairs.splice(index, 1);
      this.snl_delete_show = false;
    },

    snlCancelDelete(){
      this.snl_delete_show = false;
    },

    newSNL() {
      var item = {
        snl:"new",
        spl:[],
      };
      // item.snl="new";
      // item.spl=[];
      this.current_node.snl_spl_pairs.push(item);
    },

    save(new_data){
      this.edit_show = false;
      console.log("进入ruleClick的save函数");
      console.log(new_data);
      console.log(this.current_node);
      this.current_node.snl_spl_pairs[new_data.index].snl = new_data.snl;
      console.log(this.current_node);
    },

    close(){
      this.edit_show = false;
    },

    handleClose(tag){
      console.log("要删除的标签是：");
      console.log(tag);
      this.current_node.tags.splice(this.current_node.tags.indexOf(tag), 1);
    },

    selectTag(value){
      console.log("被选中的标签是：");
      console.log(value);
      console.log("label 是" + this.label);
      //判断选中的标签是否已经存在标签中
      if(this.current_node.tags.indexOf(value) >= 0){
        console.log(value);
        console.log("标签已经存在于该规则中");
        alert("标签已经存在于该规则中");
      }
      else{
        this.current_node.tags.push(value);
      }
    },
  }
}
</script>
<style scoped>
/* #snl_box{
  width: 100%;
  /* border-top: 2px solid #DCDFE6; */
/* } */

#description_container{

  position: relative;
  /* left: 20%; */
  padding-left: 20%;
  padding-right: 20%;
  max-height: 30%;
  width: 100%;
  box-sizing: border-box;
  /* background-color: #F2F6FC; */
  padding:2% 2%;
  border-bottom: 2px solid #DCDFE6;
}

/* #text_area{
  max-width: 60% !important;
} */

.el-textarea{
  position: relative;
  width: 60%;
  left: 20%;
}

#snl_container{
  position: relative;
  padding-top: 2%;
  padding-left: 5%;
  padding-right: 5%;
  width: 90%;
  max-height: 70%;
  box-sizing: border-box;
  border-top: 2px solid #DCDFE6;
}

#tag-span{
  position: relative;
  width: 100%;
  display: inline-flex;
  justify-content:space-around;
}

#new-snl{
  position: relative;
  left: 85%;
  top:20px;
}
/* p{
  text-align: center;
} */

.el-table{
    /* width:80%;
    padding-left: 10%; */
    position: relative;
    top:20px;
}

.el-table td {
  background-color: #EBEEF5;
  text-align: left;
}

.el-table th div {
    padding-right: 10px;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
}

#btns{
  position: relative;
  top:5%;
  left:80%;
}

h2{
  text-align: center;
  padding: 0 !important;
  margin-top:0;
}
/* .el-tag{
  display:inline;
} */



</style>
