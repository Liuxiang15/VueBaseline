<template>
  <div>
    <demo-header></demo-header>
    <el-container>
      <el-aside width="30%">
        <left-tree id="left_tree" :meta="meta" v-on:listenToNodeClick="showMsgFromChild"
        >
        </left-tree>
      </el-aside>
      <el-main width="60%">
        <list :node_data="node_data" ref="snlLists"></list>
          <edit-dialogue id="dialog" v-on:editDialogue = "showDialogue">
          </edit-dialogue>
      </el-main>
    </el-container>
  </div>
</template>

<script src="https://cdn.bootcss.com/jquery/1.10.2/jquery.min.js"></script>
<script>

import DemoHeader from '../components/demoHeader'
import LeftTree from '../components/leftTree'
import saveAs from "../../FileSaver.js"
import editDialogue from "../components/editDialogue.vue"
import List from '../components/list'

export default {
  name: 'layout',
  components:{
    DemoHeader,
    LeftTree,
    editDialogue,
    List
  },
  data() {
    return {
      pnodedata: {},
      meta: {},
      node_data: {},
      data:{}
    }
  },
  created(){
    //debugger;
    console.log("$route.params.id = " + this.$route.params.id);
    // console.log("in index meta_data = ");
    // console.log(meta_data);
    // console.log("in index node_data = ");
    // console.log(node_data);
    console.log("in layout $route.query.meta_data = ");
    // console.log(this.$route.params.meta_data);
    console.log(this.$route.query.meta_data);
    console.log("in layout $route.query.node_data = ");
    console.log(this.$route.query.node_data);
  //   this.$ajax({
  //     //
  //     method:'POST',
  //     url:'http://101.5.82.179:8099/data/get_data',
  //     //101.5.82.179:8099/data/index
  //     data: {"_id":"5b470ba5fc6a38858a673ec8"},
  //   }).then(response=>{
  //     console.log(response.data);
  //
  //     this.meta = response.data.metadata;
  //     this.node_data = response.data.nodedata;
  //     console.log(this.meta);
  //   }).catch(function(err){
  //     console.log(err);
  //   });
  // },
  //this.$route.query.method = 'get';
    this.meta = this.$route.query.meta_data;
    this.node_data = this.$route.query.node_data;
},
  methods:{
    showMsgFromChild:function(data){
      console.log("enter showMsgFromChild函数");
      this.pnodedata = data;

      //执行list的显示函数
      var _this = this;
      _this.$refs.snlLists.show_list(this.pnodedata);

    },
    showDialogue:function(){
      console.log("进入showDialogue函数");
      $("#OK").dialogFormVisible = true;
    },
    get_meta_node_data:function(){
      this.meta = this.$route.query.meta_data;
      this.node_data = this.$route.query.node_data;
    }
  },
  watch:{
    meta(){
      this.get_meta_node_data();
    }
  }
}
</script>

<style>
.el-textarea__inner {
    width: 100%;
}

.el-tag {
    white-space: inherit !important;
}

.el-tag--medium {
    height: 100%;
}

.el-textarea.is-disabled .el-textarea__inner {
    color: black;
}

#dialog{
  /*display:none;*/
}

#left_tree{
  position: relative;
  width: 90%;
  left: 10%;
}
</style>
