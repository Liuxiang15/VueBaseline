<template>
  <div>
    <demo-header></demo-header>
    <div id="container">
      <h1>规则库列表</h1>
      <el-table
        :data="lib_names"
        border
        style="width: 100%">
        <el-table-column prop="lib_names" label="规则库名字">
          <template slot-scope="scope">
            <i class="el-icon-document"></i>
            <span style="margin-left: 10px">{{ scope.row.lib_name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="props">
            <el-button @click.native="showDetail(props.$index, props.row)">查看详情</el-button>
            <el-button @click.native ="editConfig(props.$index, props.row)">编辑config</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import DemoHeader from '../components/demoHeader'
import config from '../components/editConfig.vue'

import {HOST} from '../utils/config'

export default {
  name: "index",
  data() {
    return {
      // 1 tableData存储lib_name的字典列表，
      //lib_names是存储包含id和snl_spl_pairs属性的字典的列表
      //lib_names_ids是包含lib_name和_id属性的字典的列表
      lib_names:[],
    }
  },

  // dynamically set transition based on route change
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  },

  components:{
    DemoHeader
  },
  created() {
    //2 向指定网页发送get请求并接收存储metadata和nodedata的字典
	  console.log("enter created 函数");
    console.log("!!!!!!!!!!!!HOST:"+HOST)
    this.$ajax({
    //7 向站点请求{"_id":"5b470ba5fc6a38858a673ec8","lib_name":"Component Check"}的数组
      method:'GET',
      url:HOST+'/data/index'
    }).then(response=>{
      this.lib_names = response.data.data;
      console.log(this.lib_names);

    }).catch(function(err){
      console.log(err);
    });

  },
  methods:{
    showDetail(index, row){
      //3 点击某一行规则库名后的按钮触发的事件，
      //index是点击行在列表中的下标(从0开始)
      //data是点击该行存储的数据，具体内容可看console语句输出

      // console.log(row);

      var id = row._id;
      this.$ajax({
        //5 向站点请求包含metadata和nodedata属性的字典数据，传参是被查询的lib的id
        method:'POST',
		//dataType:"jsonp",
        url:HOST+'/data/get_metadata',
        data: {"_id":id},
      }).then(response=>{
        console.log("in index response.data =  ");
        console.log(response.data);

        //node_data = response.data.nodedata;
        //6 路由跳转并传递lib的id， meta_data， node_data
        this.$router.push({
          path: '/data',
          name: "layout" ,
          props: true,
          params:{
              id: id
          },
          query: {
            meta_data: response.data,
            //node_data: node_data
          }
        });

      }).catch(function(err){
        console.log(err);
      });
    },
    editConfig(index, data){

      var id = "";
      // console.log("===========");
      // console.log(data);
      id = data._id;
      //
      // for(var lib_id of this.lib_names_ids){
      //   //4 在this.lib_names_ids寻找lib_name属性与被点击行元素相同的元素
      //   //并将其_id属性值赋值给id
      //   if(lib_id.lib_name == data.lib_name){
      //     id = lib_id._id;
      //     console.log("_id = "+ id);
      //     break;
      //   }
      // }

      this.$ajax({
      //7 向站点请求{"_id":"5b470ba5fc6a38858a673ec8","lib_name":"Component Check"}的数组
        method:'POST',
        url:HOST+'/config/get_config',
        data: {"_id":id},
      }).then(response=>{
        // console.log("config file is ");
        // //console.log(response.data);
        // console.log(response.data.config.config_list);
        var config = response.data.config;
        this.$router.push({
          path: '/config',
          name: "config" ,
          props: true,
          params:{
            config: config,
          }
        });
      }).catch(function(err){
        console.log(err);
      });
    },

  },
}
</script>

<style scoped>
#container{
  position: relative;
  text-align: center;
  width:40%;
  left:30%;
}

.el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding-left: 10px;
    text-align: center !important;
}

.el-table th > .cell {
    text-align: center !important;
}


.el-table td, .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5;
    text-align: center;
}

::-webkit-scrollbar {
  display:none;
}


.el-table .cell{
  text-align: center;
}

.el-table th{
  text-align: center !important;
}

div{
  text-align: center !important;
}
</style>
