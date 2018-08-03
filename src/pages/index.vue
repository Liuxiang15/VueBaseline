<template>
  <el-main class="container">
    <el-row type="flex" justify="space-around">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-card
        class="overview-panel"
        :body-style="{ padding: '20px' }">
          <div slot="header" class="title">
            <el-row>
              <el-col :span="18">
                <i class="el-icon-document"></i>
                <span>规则库列表</span>
              </el-col>
              <el-col :span="1">
                <el-button @click.native ="createRuleBase()">创建规则库</el-button>
              </el-col>
            </el-row>
          </div>
          <div class="overview-content">
            <el-table
            class="table"
            :data="lib_names">
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
                <el-button @click.native ="editAlias(props.$index, props.row)">编辑alias</el-button>
                <el-button type="danger" @click.native ="libDelete(props.$index, props.row)">删除</el-button>
                <el-button @click.native ="libRename(props.$index, props.row)">重命名</el-button>
              </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="规则库重命名" :visible.sync="rename_dialog_show">
      <el-input v-model="new_libname">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" icon="el-icon-close" @click="closeDialog">关闭</el-button>
        <el-button type="success" icon="el-icon-check" @click="saveRename">确定</el-button>
      </div>
    </el-dialog>
  </el-main>
</template>

<script>
import config from '../components/editConfig.vue'
import alias from '../components/editAlias.vue'
import {findLibList} from '../api/rulelib'

import {HOST} from '../utils/config'

export default {
  name: "index",
  data() {
    return {
      // 1 tableData存储lib_name的字典列表，
      //lib_names是存储包含id和snl_spl_pairs属性的字典的列表
      //lib_names_ids是包含lib_name和_id属性的字典的列表
      lib_names:[],
      rename_dialog_show:false,
      new_libname:"",
      index:0,
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

  created() {
    //2 向指定网页发送get请求并接收存储metadata和nodedata的字典
	  console.log("enter created 函数");
    console.log("!!!!!!!!!!!!HOST:"+HOST)

    // findLibList().then(response => {
    //   this.lib_names = response.data.data;
    //   console.log(this.lib_names);
    // })


    findLibList(response => {
      this.lib_names = response.data.data;
      console.log(this.lib_names);
    })

    // this.$ajax({
    // //7 向站点请求{"_id":"5b470ba5fc6a38858a673ec8","lib_name":"Component Check"}的数组
    //   method:'GET',
    //   url:HOST+'/data/index'
    // }).then(response=>{
    //   this.lib_names = response.data.data;
    //   console.log(this.lib_names);
    //
    // }).catch(function(err){
    //   console.log(err);
    // });

  },
  methods:{
    showDetail(index, row){
      //3 点击某一行规则库名后的按钮触发的事件，
      //index是点击行在列表中的下标(从0开始)
      //data是点击该行存储的数据，具体内容可看console语句输出
      var id = row._id;
      this.$router.push({
        path: '/data',
        name: "layout" ,
        props: true,
        query: {
            id: id,
        }
      });
    },
    editConfig(index, data){

      var id = data._id;
      var data = {"_id":id};

      this.$ajax({
        method:'POST',
        data:data,
        url:HOST+'/config/get_config'
      }).then(response=>{
        console.log(response.data);
        this.$router.push({
          path: '/config',
          name: "config" ,
          props: true,
          query:{
            id:id
          },
          params:{
            config: response.data.config,
          }
        });
      }).catch(function(err){
        console.log(err);
      });

      //var response_data = requestData("POST", data, GET_CONFIG_API);



    },
    createRuleBase(){
      this.$ajax({
      //7 向站点请求{"_id":"5b470ba5fc6a38858a673ec8","lib_name":"Component Check"}的数组
        method:'POST',
        url:HOST+'/data/create_metadata'
      }).then(response=>{
        console.log(response.data);
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
      }).catch(function(err){
        console.log(err);
      });

    },

    libDelete(index, data){
      var id = "";
      id = data._id;
      this.lib_names.splice(index, 1);
      console.log("id = " + id);
      this.$ajax({
      //7 向站点请求{"_id":"5b470ba5fc6a38858a673ec8","lib_name":"Component Check"}的数组
        method:'POST',
        url:HOST+'/data/delete_metadata',
        data: {"_id":id},
      }).then(response=>{

      }).catch(function(err){
        console.log(err);
      });
    },
    libRename(index, data){
      this.index = index;
      this.new_libname = this.lib_names[index].lib_name;
      this.rename_dialog_show = true;
    },
    closeDialog(){
      this.rename_dialog_show = false;
    },

    saveRename(){
      // console.log(this.new_libname);
      // console.log("FFFFFFFFFFFFFF");
      // console.log(this.lib_names[this.index].lib_name );
      this.rename_dialog_show = false;
      this.lib_names[this.index].lib_name = this.new_libname;
      // var data = {};
      // data._id = this.lib_names[this.index]._id;
      // data.lib_name = this.new_libname;
      // data._id = this.lib_names[this.index].id;
      //
      this.$ajax({
      //7 向站点请求{"_id":"5b470ba5fc6a38858a673ec8","lib_name":"Component Check"}的数组
        method:'POST',
        data:{
          "_id":this.lib_names[this.index]._id,
          "lib_name":this.new_libname
        },
        url:HOST+'/data/change_lib_name'
      }).then(response=>{
        console.log(response.data);

      }).catch(function(err){
        console.log(err);
      });
    },

    editAlias(index, data){

      var id = "";
      id = data._id;
      console.log("id = " + id);
      this.$ajax({
      //7 向站点请求{"_id":"5b470ba5fc6a38858a673ec8","lib_name":"Component Check"}的数组
        method:'POST',
        url:HOST+'/alias/get_alias',
        data: {"_id":id},
      }).then(response=>{
        console.log("alias file is ");
        console.log(response.data);
        // console.log(response.data.config.alias_list);
        // var alias_list = response.data.config.alias_list;
        this.$router.push({
          path: '/alias',
          name: "alias" ,
          props: true,
          params:{
            response: response.data,
          }
        });
      }).catch(function(err){
        console.log(err);
      });
    },

  },
}
</script>

<style lang="stylus" scoped>
.container
  width 60%
  position relative
  left 20%
  .overview-panel
    width 100%
    .overview-content
      overflow auto
      .table
        width 100%
</style>
