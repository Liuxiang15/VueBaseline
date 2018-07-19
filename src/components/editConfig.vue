<template>
<div>
  <el-table
    :data="table_data"
    style="width: 100%">
    <el-table-column
      label="key"
      width="180">
      <template slot-scope="scope">
        <el-tag size="medium">{{ scope.row.key }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column
      label="value"
      width="180">
      <template slot-scope="scope">

        <div slot="reference" class="name-wrapper">
          <el-tag size="medium" v-for = "(val, index) in scope.row.value"
          :key = "index">
              {{val}}
          </el-tag>
        </div>

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

  <config-dialogue :show = "edit_show" :default_data ="curr_data" @save="save" @close="close">
  </config-dialogue>
  <edit
</div>
</template>

<script src="https://cdn.bootcss.com/jquery/1.10.2/jquery.min.js"></script>
<script>
import configDialogue from "./configDialogue.vue"

  export default {
    components:{
      //editDialogue
      configDialogue
    },

    data() {
      return {
        table_data: [],
        edit_show:false,
        curr_data:{}
      }
    },
    created(){
      console.log("in editConfig ");
      console.log(this.$route.params.config_list);
      var temp_table_data = [];

      var config_list = this.$route.params.config_list;
      for(var item of config_list){
        var dict = {};
        var str_value = [];
        //var str_value = "";
        dict.key = item.key;
        for(var val of item.value){
          // str_value += val;
          // str_value += "              ";
          //#号区分多个value值
          str_value.push(val);

        }
        dict.value = str_value;
        temp_table_data.push(dict);
      }
      this.table_data = temp_table_data;

    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
        console.log("被点击的这行数据是：");
        this.curr_data.key = row.key;
        this.curr_data.value = row.value;
        console.log(this.curr_data);
        //console.log(index, row);
        this.editDialogue();
      },
      handleDelete(index, row) {
        console.log("要删除的这行是");
        this.table_data.splice(index, 1);
        console.log(row);
      },

      editDialogue(){
        console.log("进入showDialogue函数");
        this.edit_show = true;
        console.log("this.edit_show"+this.edit_show);
      },
      close(){
        this.edit_show = false;
      },
      save(){
        this.edit_show = false;
      }


    }
  }
</script>
