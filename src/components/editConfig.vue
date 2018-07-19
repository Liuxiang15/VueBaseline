<template>
<div>
  <el-table
    :data="config.config_list"
    style="width: 100%">

    <el-table-column label="key" width="180" align="center">
      <template slot-scope="scope">
        <el-tag size="medium">{{ scope.row.key }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="value" width="180">
      <template slot-scope="scope">
        <div slot="reference" class="name-wrapper">
          <el-tag size="medium" v-for = "val in scope.row.value ">
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

  <el-button type="primary" icon="el-icon-edit" @click="newItem">新建</el-button>

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

        config:{},

      }
    },
    created(){
      console.log("in editConfig ");
      console.log(this.$route.params.config);
      this.config = this.$route.params.config;
      // this.config_list = this.$route.params.config.config_list;

    },
    // watch:{
    //   curr_data:{
    //     handler: function (val) {
    //       console.log("++++++++");
    //       console.log(val);
    //       this.config_list[val.index].key = val.data.key;
    //       this.config_list[val.index].value = val.data.value;
    //     },
    //     deep: true
    //   }
    // },
    methods: {
      newItem() {
        var item = {};
        item.key="new";
        item.value=[];
        item.value.push("new");
        this.config.config_list.push(item);
      },
      handleEdit(index, row) {
        console.log(index, row);
        console.log("被点击的这行数据是：");
        console.log(row);
        //console.log(index, row);
        this.editDialogue(index, row);
      },
      handleDelete(index, row) {
        console.log("要删除的这行是");
        this.config.config_list.splice(index, 1);
        console.log(row);
      },

      editDialogue(index, row){
        console.log("进入showDialogue函数");
        this.edit_show = true;
        console.log("this.edit_show"+this.edit_show);
        this.curr_data.data.key = row.key;

        this.curr_data.data.value = [].concat(row.value);

        this.curr_data.index = index;
        console.log("lalalalalalalalaal");
        console.log(this.curr_data);
      },
      close(){
        this.edit_show = false;
      },
      save(res){
        this.edit_show = false;
        console.log("---------");
        console.log(res);
        this.curr_data = res;
        console.log(this.curr_data);
        this.config.config_list[res.index].key = res.data.key;
        this.config.config_list[res.index].value = res.data.value;

      }
    }
  }
</script>
