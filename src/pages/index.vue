<template>
  <div id="container">
    <h1>规则库列表</h1>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column  prop="lib_name" label="规则库名字">
        <template slot-scope="scope">
          <i class="el-icon-document"></i>
          <span style="margin-left: 10px">{{ scope.row.lib_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="props">
          <el-button @click.native="showDetail(props.$index, props.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--cell-click当某个单元格被点击时会触发该事件row, column, cell, event-->
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      tableData: [],
      lib_names:[],
      lib_names_ids:[]
    }
  },
  created(){
    this.$ajax({
      method:'GET',
      url:'http://101.5.82.179:8099/data/index'
    }).then(response=>{
      console.log("response.data是"+response.data);
      console.log("response.data.data是"+response.data.data);
      this.lib_names = response.data.data;
      console.log("this.lib_names是"+this.lib_names);
    }).catch(function(err){
      console.log(err);
    });

    // var libs_file = require("../../libs.json");
    // var libs = libs_file.data;
    // console.log("before loop this.lib_names是"+this.lib_names);
    // var tempTable = [];       //用来存储 tableData的值
    // //便历数组来查询 id = "strId"的字典
    // var temp = this.lib_names;
    // console.log("temp是"+temp);
    // for(var lib_name of temp){
    //     var dict = {};
    //     console.log(lib_name.lib_name);
    //     dict.lib_name = lib_name.lib_name; //字典或者对象
    //     tempTable.push(dict);
    // }
    // this.tableData = tempTable;
  },
  methods:{
    showDetail(index, data){
      // console.log(index);
      console.log("data是" + data);
      console.log(data.lib_name);
      for(var item in data){
        console.log("data里的属性有" + item);
      }
      //console.log("目前点击了规则库的第"+index+"行");
      //console.log("data.this_id是"+data.this_id);

      var id = "";
      for(var lib_id of this.lib_names_ids){
        if(lib_id.lib_name == data.lib_name){
          id = lib_id._id;
          console.log("_id = "+ id);
          break;
        }
      }
      var meta_data = {};
      var node_data = {};
      this.$ajax({
        //
        method:'POST',
        url:'http://101.5.82.179:8099/data/get_data',
        //101.5.82.179:8099/data/index
        //data: {"_id":"5b470ba5fc6a38858a673ec8"},
        data: {"_id":id},
      }).then(response=>{
        console.log(response.data);

        meta_data = response.data.metadata;
        node_data = response.data.nodedata;
        console.log("in index meta_data = ");
        console.log(meta_data);
        console.log("in index node_data = ");
        console.log(node_data);

        this.$router.push({
          path: '/data',
          name: "layout" ,
          params:{
              id: id
          },
          query: {
            // meta_data: JSON.stringify(meta_data),
            // node_data: JSON.stringify(node_data)
            meta_data: meta_data,
            node_data: node_data
          }
        });//路由传lib的_id参数和nodedata,metadata

      }).catch(function(err){
        console.log(err);
      });
      // debugger;

    },
    getData(){
      this.$ajax({
        method:'GET',
        url:'http://101.5.82.179:8099/data/index'
      }).then(response=>{
        // console.log("response.data是"+response.data);
        // console.log("response.data.data是"+response.data.data);
        this.lib_names = response.data.data;
        // console.log("this.lib_names是"+this.lib_names);
      }).catch(function(err){
        console.log(err);
      });
      var tempTable = [];       //用来存储 tableData的值
      //便历数组来查询 id = "strId"的字典
      var temp = this.lib_names;
      // console.log("temp是"+temp);
      for(var lib_id of temp){
          var dict = {};    //帮助存储lib_names
          // console.log(lib_name.lib_name);
          var _dict = {};   //帮助存储lib_names_ids
          dict.lib_name = lib_id.lib_name; //字典或者对象
          _dict.lib_name = lib_id.lib_name;
          _dict._id = lib_id._id;
          tempTable.push(dict);
          this.lib_names_ids.push(_dict);
      }
      this.tableData = tempTable;
    }
  },
  watch:{
    lib_names(){
      this.getData();
    }
  }
}
</script>

<style>
#container{
  position: relative;
  text-align: center;
  width:40%;
  left:30%;
}

.el-table th > .cell {
    text-align: center;
}
</style>
