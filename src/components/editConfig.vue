<template>
<div id="config_container">
  <h2>编辑config界面</h2>
  <div class="filter-input">
    <el-input placeholder="请输入搜索内容" class="input-with-select"
              v-model="filter_text"
    >
      <el-select v-model="select_method" slot="prepend" placeholder="请选择搜索方式" style="width: 200px;">
        <el-option label="根据key搜索" value="key"></el-option>
        <!--<el-option label="根据value搜索" value="value"></el-option>-->
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click.native="handleFilter">
        搜索
      </el-button>
    </el-input>
  </div>
  <el-table :data="pagedData">

    <!-- 为了防止循环第一项显示在最后一项 -->
    <el-table-column>
      <el-table-column
        width="1"
      >
      </el-table-column>
    </el-table-column>

    <el-table-column label="key" width="180" align="center"  >
      <template slot-scope="scope">
        <el-tag size="medium">{{ scope.row.key }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="value" min-width="80%">
      <template slot-scope="scope">
        <div slot="reference" class="name-wrapper">
            <el-tag size="medium" v-for = "(val, index) in scope.row.value" :key = "index"
                    closable
                    @close="tagDelete(scope.$index, scope.row, val)"
            >
                {{val}}
            </el-tag>
          </div>
      </template>
    </el-table-column>

    <el-table-column class="operation-btn"label="操作" min-width="20%">
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

  <el-pagination :total="total" :current-page="currentPage"
    :page-size="currentPageSize"
    layout="total, sizes, prev, pager,next, jumper"
    @size-change="pageSizeChange" @current-change="pageChange">
  </el-pagination>

  <div id="btns">
    <el-button type="primary" icon="el-icon-edit" @click="newItem">新建</el-button>
    <el-button type="success" icon="el-icon-check" @click="configSave">保存</el-button>
  </div>


  <config-dialogue :show = "edit_show" :default_data ="curr_data" @save="save" @close="close">
  </config-dialogue>

  <el-dialog
  title="删除提示"
  :visible.sync="config_delete_show"
  center>
  <span>您确定删除选中的config语句吗？</span>
  <span slot="footer" class="dialog-footer">
          <el-button @click="configCancelDelete">取 消</el-button>
          <el-button type="primary" @click="configSureDelete">确 定</el-button>
        </span>
</el-dialog>

  <el-dialog
    title="删除提示"
    :visible.sync="tag_delete_show"
    center>
    <span>您确定删除选中的标签吗？</span>
    <span slot="footer" class="dialog-footer">
          <el-button @click="tagCancelDelete">取 消</el-button>
          <el-button type="primary" @click="tagSureDelete">确 定</el-button>
        </span>
  </el-dialog>
</div>
</template>

<script src="https://cdn.bootcss.com/jquery/1.10.2/jquery.min.js"></script>
<script>
import configDialogue from "./configDialogue.vue"
import {HOST} from '../utils/config'
import {getConfigById} from '../api/rulelib'
import {saveConfig} from '../api/rulelib'
  export default {
    components:{
      configDialogue
    },

    data() {
      return {
        table_data: [],
        edit_show:false,

        curr_data:{
          index: Number,
          data:{
            key:String,
            value:[],
          }
        },
        id:"",//通过id来获取数据
        config:{},
        // total:0,
        currentPage: 1,
        currentPageSize: 10,
        filter_key:"",
        filter_text:[],
        config_delete_show:false,
        tag_delete_show:false,
        current_index:-1,//当前点击序号
        current_search_index:-1,
        delete_tag:"",
        filter_text:"",
        select_method:"",
        search_array:[],
        copy_list:[],
        mode:"normal",//分为搜索模式和普通浏览模式
      }
    },
    created(){
      this.id = this.$route.query.id;
      getConfigById({"_id":this.$route.query.id}).then(
        response=> {
          this.config = response.data.config;
          this.copy_list = [].concat(this.config.config_list);
        });
    },

    computed:{
      total(){
        if(!this.copy_list){
          return 0;
        }
        return this.copy_list.length;
      },

      pagedData(){
        if(!this.copy_list){
          return [];
        }
        return this.copy_list.slice((this.currentPage - 1) * this.currentPageSize, this.currentPage * this.currentPageSize)
      }
    },

    methods: {
      addSearch(h, {column}){
        let inputValue = {}
        return h('Input', {
          props: {
            placeholder: 'Search' + ' ' + column.label,
            icon: 'ios-search-strong'
          },
          style: {
            paddingRight: '5px'
          },
          on: {
            input: val => {
              inputValue = val
              if (!inputValue) {
                this.vaildInputValue(column.label, inputValue)
              }
            },
            class: 'ivu-input-icon',
            'on-click': () => {
              this.vaildInputValue(column.label, inputValue)
            },
            'on-enter': () => {
              console.log('enter')
              this.vaildInputValue(column.label, inputValue)
            }
          }
        })
      },

      newItem() {
        //往头部插入元素
        let item = {};
        item.key="new";
        item.value=[];
        item.value.push("new");
        this.config.config_list.unshift(item);
      },

      handleEdit(index, row) {
        //先获取修改语句的下标
        if(this.mode == "normal"){
          let real_index = (this.currentPage - 1) * this.currentPageSize + index;
          this.current_search_index = real_index;
          this.editDialogue(real_index, row);
        }
        else{
          let real_index = row.real_index;
          this.current_search_index = this.copy_list[index].real_index;
          this.editDialogue(real_index, row);
          console.log("被修改的key是");
          console.log(row);
        }

      },
      handleDelete(index, row) {
        this.config_delete_show = true;
        this.current_index = (this.currentPage - 1) * this.currentPageSize + index;
      },

      editDialogue(index, row){
        // console.log("进入showDialogue函数");
        this.edit_show = true;
        this.curr_data.data.key = row.key;
        this.curr_data.data.value = [].concat(row.value);
        this.curr_data.index = index;
        if(this.mode == "search"){

        }
      },

      close(){
        this.edit_show = false;
      },

      save(new_data){
        console.log("保存的结果是");
        console.log(new_data);
        if(this.mode === "normal"){
          this.edit_show = false;
          this.curr_data = new_data;
          console.log(this.curr_data);
          this.config.config_list[new_data.index].key = new_data.data.key;
          this.config.config_list[new_data.index].value = new_data.data.value;
        }
        else{
          this.edit_show = false;
          this.curr_data = new_data;
          console.log("修改search的config是");
          console.log(this.current_search_index);
          console.log(this.config.config_list[this.current_search_index]);
          this.config.config_list[this.current_search_index].key = new_data.data.key;
          this.config.config_list[this.current_search_index].value = new_data.data.value;
        }
      },

      pageSizeChange(size) {
        this.currentPageSize = size
      },
      pageChange(page) {
          this.currentPage = page
      },
      configSave(){
        console.log("in configSave");
        for(let config of this.config.config_list){
          delete config.real_index;
        }
        console.log(this.config);
        saveConfig(JSON.stringify(this.config)).then(
          response=>{
          console.log(response.data);
        })
      },
      filterHandler(value, row, column) {
        // console.log(value);
        // console.log(row);
        // console.log(column);
        const property = column['property'];
        return row[property] === value;
      },
      configCancelDelete(){
        this.config_delete_show = false;
      },

      configSureDelete(){
        if(this.mode == "normal"){
          this.config.config_list.splice(this.current_index, 1);
        }
        else{
          this.config.config_list.splice(this.current_search_index, 1);
        }
        this.config_delete_show = false;
      },

      tagDelete(index, row, tag){
        console.log("删除的下标是" + index);
        console.log(row);
        console.log(tag);
        this.current_index = (this.currentPage - 1) * this.currentPageSize + index;
        this.tag_delete_show = true;
        this.delete_tag = tag;
      },

      tagCancelDelete(){
        this.tag_delete_show = false;
      },

      tagSureDelete(){
        console.log("删除的标签是：");
        console.log(this.config.config_list[this.current_index]);
        let index = this.config.config_list[this.current_index].value.length - 1;
        for(;index >= 0; index--){
          if(this.config.config_list[this.current_index].value[index] == this.delete_tag){
            this.config.config_list[this.current_index].value.splice(index, 1);
          }
        }

        this.tag_delete_show = false;
      },

    },
    watch:{
      filter_key(){
        this.filter_text = [];
        var temp = {};
        temp.text = this.filter_key;
        temp.value = this.filter_key;
        this.filter_text.push(temp);
      },

      filter_text(val){
        // console.log(this.config.config_list);
        if(!val)
        {
          this.copy_list = [].concat(this.config.config_list);
          return;
        }
        this.mode = "search";
        this.search_array = [];
        for(let config of this.copy_list){
          if(val === config.key){
            config.real_index = this.config.config_list.indexOf(config);
            this.search_array.push(config);
          }
        }
        if(this.search_array.length == 0)
          return;
        this.copy_list = this.search_array;
      },

      "config.config_list"(val){
        this.copy_list = [].concat(val);
        this.mode = "normal"

        console.log("修改后的copylist是");
        console.log(this.copy_list);
      },
    },
  }
</script>
<style scoped>
/* #container{
  height: 90%;
} */

#config_container{
  position: relative;
  width: 60%;
  left: 20%;
  overflow: hidden;
}

h2{
  text-align: center;
}
/* .el-table {
    position: relative;
    width: 60%;
    left: 20%;
} */

.el-table .cell{
  text-align: center;
}

.el-tag{
  display:inline;
}

.el-pagination{
  position: relative;
  width: 80%;
  top: 5px;
  left: 20%;
}

#btns{
  position: relative;
  left: 80%;
  top: 2%;
}
/*.operation-btn{*/
  /*min-width: 20%;*/
  /*max-width: 20%;*/
/*}*/


</style>
