<template>
<div id="config_container">
  <!--<el-input-->
  <!--placeholder="输入关键字进行过滤"-->
  <!--v-model="filter_key"-->
<!--&gt;-->
<!--</el-input>-->
  <el-table :data="pagedData">

    <!-- 为了防止循环第一项显示在最后一项 -->
    <el-table-column>
      <el-table-column
        width="1"
      >
      </el-table-column>
    </el-table-column>
    <el-table-column label="key" width="180" align="center">
      <!--<el-table-row-->
        <!--:render-header='addSearch'-->
        <!--show-overflow-tooltip-->
      <!--&gt;-->
      <!--</el-table-row>-->

      <template slot-scope="scope">
        <el-tag size="medium">{{ scope.row.key }}</el-tag>
      </template>

    </el-table-column>

    <el-table-column label="value" >
      <!--<el-table-column-->
        <!--:render-header='addSearch'-->
        <!--show-overflow-tooltip-->
      <!--&gt;-->
      <!--</el-table-column>-->

      <!--<el-table-row-->
        <!--:render-header='addSearch'-->
        <!--show-overflow-tooltip-->
      <!--&gt;-->
      <!--</el-table-row>-->

      <template slot-scope="scope">
        <div slot="reference" class="name-wrapper">
            <el-tag size="medium" v-for = "(val, index) in scope.row.value"
            :key = "index">
                {{val}}
            </el-tag>
          </div>
      </template>
    </el-table-column>

    <el-table-column class="operation-btn"label="操作">
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
</div>
</template>

<script src="https://cdn.bootcss.com/jquery/1.10.2/jquery.min.js"></script>
<script>
import configDialogue from "./configDialogue.vue"
import {HOST} from '../utils/config'
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

        current_index:-1,


      }
    },
    created(){
      this.id = this.$route.query.id;
      this.$ajax({
      //7 向站点请求{"_id":"5b470ba5fc6a38858a673ec8","lib_name":"Component Check"}的数组
        method:'POST',
        url:HOST+'/config/get_config',
        data: {"_id":this.id},
      }).then(response=>{
        this.config = response.data.config;
        // console.log("this.config is ");
        // console.log(this.config);
      }).catch(function(err){
        console.log(err);
      });
    },

    computed:{
      total(){
        if(!this.config.config_list){
          return 0;
        }
        return this.config.config_list.length;
      },

      pagedData(){
        if(!this.config.config_list){
          return [];
        }
        return this.config.config_list.slice((this.currentPage - 1) * this.currentPageSize, this.currentPage * this.currentPageSize)
      }
    },

    methods: {
      newItem() {
        // var item = {};
        // item.key="new";
        // item.value=[];
        // item.value.push("new");
        // this.config.config_list.push(item);
        // let max_page = Math.ceil(this.total / this.currentPageSize);
        // this.pageChange(max_page);

        //往头部插入元素
        var item = {};
        item.key="new";
        item.value=[];
        item.value.push("new");
        // var new_config_list = this.config.config_list.slice(0);
        this.config.config_list.unshift(item);


        // this.pageChange(6);
        //接下来要实现的是页面跳转
      },
      handleEdit(index, row) {
        // console.log(index, row);
        // console.log("被点击的这行数据是：");
        // console.log(row);
        //console.log(index, row);
        var real_index = (this.currentPage - 1) * this.currentPageSize + index;
        this.editDialogue(real_index, row);
      },
      handleDelete(index, row) {
        // console.log("要删除的这行是");
        this.config_delete_show = true;
        this.current_index = index;
        // this.config.config_list.splice(index, 1);
        // console.log(row);
      },

      editDialogue(index, row){
        // console.log("进入showDialogue函数");
        this.edit_show = true;
        // console.log("this.edit_show"+this.edit_show);
        this.curr_data.data.key = row.key;

        this.curr_data.data.value = [].concat(row.value);

        this.curr_data.index = index;
        // console.log(this.curr_data);
      },
      close(){
        this.edit_show = false;
      },
      save(res){
        this.edit_show = false;
        // console.log(res);
        this.curr_data = res;
        console.log(this.curr_data);
        this.config.config_list[res.index].key = res.data.key;
        this.config.config_list[res.index].value = res.data.value;

      },

      pageSizeChange(size) {
        this.currentPageSize = size
      },
      pageChange(page) {
          this.currentPage = page
      },
      configSave(){
        this.$ajax({
          method:'POST',
          url:HOST + '/config/refresh_config',
          data: JSON.stringify(this.config),
        }).then(response=>{
          console.log(response.data);
        }).catch(function(err){
          console.log(err);
        });
      },
      filterHandler(value, row, column) {
        console.log("FFFFFFFFFFFFFFFFFFFFFFF");
        console.log(value);
        console.log(row);
        console.log(column);
        const property = column['property'];
        return row[property] === value;
      },
      configCancelDelete(){
        this.config_delete_show = false;
      },

      configSureDelete(){
        this.config.config_list.splice(this.current_index, 1);
        this.config_delete_show = false;
      },
      addSearch (h, {column}) {
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

    },
    watch:{
      filter_key(){
        this.filter_text = [];
        var temp = {};
        temp.text = this.filter_key;
        temp.value = this.filter_key;
        this.filter_text.push(temp);
      }
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
  left: 10%;
}

#btns{
  position: relative;
  left: 50%;
  top: 10%;
}
/*.operation-btn{*/
  /*min-width: 20%;*/
  /*max-width: 20%;*/
/*}*/


</style>
