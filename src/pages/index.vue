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
                <el-button @click.native ="createARuleLib()">创建规则库</el-button>
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
                <el-button @click.native ="libRename(props.$index, props.row)">重命名</el-button>
                <el-button type="danger" @click.native ="libDelete(props.$index, props.row)">删除</el-button>
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
        <el-button type="success" icon="el-icon-check" @click.native="saveRename()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="删除提示"
      :visible.sync="centerDialogVisible"
      center>
      <span>您确定删除选中的规则库吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancalDelete">取 消</el-button>
        <el-button type="primary" @click="SureDelete">确 定</el-button>
      </span>
    </el-dialog>
  </el-main>
</template>

<script>
import config from '../components/editConfig.vue'
import alias from '../components/editAlias.vue'
import {findLibList} from '../api/rulelib'
import {createRuleLib} from '../api/rulelib'
import {_libDelete} from '../api/rulelib'
import {changeLibName} from '../api/rulelib'

import {HOST} from '../utils/config'

export default {
  name: "index",
  data() {
    return {
      //lib_names是存储包含id和snl_spl_pairs属性的字典的列表
      //lib_names_ids是包含lib_name和_id属性的字典的列表
      lib_names:[],
      rename_dialog_show:false,
      new_libname:"",
      current_index:0,
      centerDialogVisible:false,

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
    findLibList(response => {
      this.lib_names = response.data.data;
      console.log(this.lib_names);
    })
  },
  methods:{
    showDetail(index, row){
      //3 点击某一行规则库名后的按钮触发的事件，index是点击行在列表中的下标(从0开始)
      //data是点击该行存储的数据，具体内容可看console语句输出
      var id = row._id;
      this.$router.push({
        path: '/data',
        name: "layout" ,
        props: true,
        query: {id: id,}
      });
    },


    createARuleLib(){
      createRuleLib().then(
        findLibList(response=>{
          this.lib_names = response.data.data;
          console.log(this.lib_names);
        })
      )
    },

    libDelete(index, data){
      this.centerDialogVisible = true;
      this.current_index = index;
    },
    SureDelete(){
      this.centerDialogVisible = false;
      //这个先后顺序不能换
      _libDelete({"_id":this.lib_names[this.current_index]._id});
      this.lib_names.splice(this.current_index, 1);
    },

    cancalDelete(){
      this.centerDialogVisible = false;
      this.current_index = -1;
    },

    libRename(index, data){
      this.current_index = index;
      this.new_libname = this.lib_names[index].lib_name;
      this.rename_dialog_show = true;
    },

    closeDialog(){
      this.rename_dialog_show = false;
    },

    saveRename(){
      this.rename_dialog_show = false;
      console.log("进入saveRename函数");
      console.log(this.lib_names[this.current_index]);
      this.lib_names[this.current_index].lib_name = this.new_libname;
      changeLibName({
        "_id":this.lib_names[this.current_index]._id,
        "lib_name":this.new_libname
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
