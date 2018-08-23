<template>
<div id="alias_container">
  <!--<el-input-->
    <!--placeholder="输入关键字进行过滤"-->
    <!--v-model="filter_key">-->
  <!--</el-input>-->
  <el-table :data="alias_list" >
    <el-table-column>
      <el-table-column
        width="1"
      >
      </el-table-column>
    </el-table-column>
    <el-table-column label="key" width="180" align="center" :filters="filter_text"
                     :filter-method="filterHandler">
      <template slot-scope="scope">
        <el-tag size="medium">{{ scope.row.key }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="value" >
      <template slot-scope="scope">
        <el-tag size="medium">{{ scope.row.value }}</el-tag>
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

  <el-dialog :title="title" :visible.sync="dialog_show" @close="close">
    <el-form>
      <el-form-item label="key">
        <el-input v-model="new_key" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item label="value">
        <el-input  v-model="new_value" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" icon="el-icon-close" @click="close">关闭</el-button>
      <el-button type="success" icon="el-icon-check" @click="save">确定</el-button>
    </div>
  </el-dialog>

  <el-dialog
    title="删除提示"
    :visible.sync="alias_delete_show"
    center>
    <span>您确定删除选中的alias语句吗？</span>
    <span slot="footer" class="dialog-footer">
          <el-button @click="aliasCancelDelete">取 消</el-button>
          <el-button type="primary" @click="aliasSureDelete">确 定</el-button>
        </span>
  </el-dialog>
  <div id="btns">
    <el-button type="primary" icon="el-icon-edit" @click="newItem">新建</el-button>
    <el-button type="success" icon="el-icon-check" @click="aliasSave">保存</el-button>
  </div>
</div>
</template>

<script src="https://cdn.bootcss.com/jquery/1.10.2/jquery.min.js"></script>
<script>
import {HOST} from '../utils/config'
import {getAliasById} from '../api/rulelib'
import {saveAlias} from '../api/rulelib'
  export default {

    data() {
      return {
        response:{},
        alias_list:[],
        dialog_show:false,
        new_key:"",
        new_value:"",
        current_index: 0,
        operation_type: "",
        title:"",
        filter_key:"",
        filter_text:[],
        alias_delete_show:false,
        id:"",//通过id来获取数据
        alias:{},
      }
    },
    created(){
      this.id = this.$route.query.id;
      getAliasById({"_id":this.$route.query.id}).then(
        response=> {
          this.alias = response.data.alias;
          this.alias_list = this.alias.alias_list;
        });
    },

    methods:{
      handleEdit(index, row){
        this.operation_type = "edit";
        this.title = "编辑alias"
        this.dialog_show = true;
        this.current_index = index;
        this.new_key = this.alias_list[this.current_index].key;
        this.new_value = this.alias_list[this.current_index].value;
      },
      handleDelete(index, row) {
        this.operation_type = "delete";
        this.current_index = index;
        this.alias_delete_show = true;

      },

      aliasCancelDelete(){
        if(this.operation_type == "delete"){
          this.current_index = -1;
          this.alias_delete_show = false;
        }

      },

      aliasSureDelete(){
        if(this.operation_type == "delete"){
          this.alias_list.splice(this.current_index, 1);
          this.current_index = -1;
          this.alias_delete_show = false;
        }
      },

      close(){
        //所有对话框和菜单栏不可见
        this.dialog_show = false;
        this.new_key = "";
        this.new_value = "";
      },
      save(){
        console.log("进入alias的save函数后的operation是："+this.operation_type);
        if(this.operation_type === "edit"){
          console.log("进入编辑保存函数");
          this.alias_list[this.current_index].key = this.new_key;
          this.alias_list[this.current_index].value = this.new_value;
        }
        else if(this.operation_type === "new"){
          const new_item = {
            key: this.new_key,
            value: this.new_value
          };
          this.alias_list.push(new_item);
          // console.log("新增后的list是");
          // console.log(this.alias_list);
        }

        this.new_key = "";
        this.new_value = "";
        this.dialog_show = false;
        this.operation_type = "";
      },
      newItem(){
        // console.log("进入newItem函数");
        this.operation_type = "new";
        this.title = "新建alias"
        this.dialog_show = true;
      },

      aliasSave(){
        // console.log("in aliasSave");
        saveAlias(JSON.stringify(this.alias)).then(
          response=>{
          console.log(response.data);
          alert("保存成功");
        });
      },

      filterHandler(value, row, column) {
        // console.log(value);
        // console.log(row);
        // console.log(column);
        //筛选函数没有执行
        const property = column['property'];
        return row[property] === value;
      },
    },

    watch:{
      filter_key()
      {
        this.filter_text = [];
        var temp = {};
        temp.text = this.filter_key;
        temp.value = this.filter_key;
        this.filter_text.push(temp);
      }
    }
  }


</script>

<style scoped>
#alias_container{
  position: relative;
  width: 60%;
  left: 20%;
}

#btns{
  position: relative;
  left: 60%;
  top: 30%;
}
</style>
