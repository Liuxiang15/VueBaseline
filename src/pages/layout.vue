<template>
  <div>
    <demo-header></demo-header>
    <el-container>
      <el-aside width="30%">
        <left-tree id="left_tree" :meta_data="meta_data" v-on:listenToNodeClick="showMsgFromChild"
        >
        </left-tree>
      </el-aside>
      <el-main width="60%">
        <list :node_data="node_data" ref="snlLists" @editDialogue="editDialogue"></list>
        <edit-dialogue :show = "edit_show" @save="save" @close="close">
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
        //1 pnodedata存储当前节点的内容，meta_data和node_data分别存储目录和snl的json内容
        //edit_show决定对话框是否显示
        pnodedata: {},
        meta_data: {},
        node_data: {},
        edit_show:false
      }
    },
    created(){
      this.meta_data = this.$route.query.meta_data;
      this.node_data = this.$route.query.node_data;
    },
    methods:{
      showMsgFromChild:function(data){
        //2 左侧树上节点被点击后触发的响应事件，data存储被点击节点的信息
        console.log("enter showMsgFromChild函数");
        this.pnodedata = data;
        this.$refs.snlLists.showList(this.pnodedata);
      },
      editDialogue: function(){
        console.log("进入showDialogue函数");
        this.edit_show = true;
        console.log("this.edit_show"+this.edit_show);
      },
      save(){
        this.edit_show = false;
      },
      close(){
        this.edit_show = false;
      },
      get_meta_node_data:function(){
        this.meta = this.$route.query.meta_data;
        this.node_data = this.$route.query.node_data;
      }
    },
    watch:{
      meta_data(){
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
