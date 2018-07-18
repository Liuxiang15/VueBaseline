<template>
  <div class="container">
    <el-header>
      <demo-header></demo-header>
    </el-header>
    <el-container>
      <el-aside>
        <left-tree id="left_tree" :meta_data="meta_data" v-on:listenToNodeClick="showMsgFromChild"
        >
        </left-tree>
      </el-aside>
      <el-main>
        <list  ref="snlLists" @editDialogue="editDialogue"></list>
        <edit-dialogue :show = "edit_show" @save="save" @close="close">
        </edit-dialogue>
      </el-main>
    </el-container>
    <el-footer>Footer</el-footer>
  </div>
</template>

<script src="https://cdn.bootcss.com/jquery/1.10.2/jquery.min.js"></script>
<script>

import DemoHeader from '../components/demoHeader'
import LeftTree from '../components/leftTree'
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
      //1 current_node存储当前节点的内容，meta_data和node_data分别存储目录和snl的json内容
      //edit_show决定对话框是否显示
      current_node: {},
      meta_data: {},
      node_data: {},
      edit_show:false
    }
  },
  created(){
    this.meta_data = this.$route.query.meta_data;
    console.log("in layout this.meta_data = ");
    console.log(this.meta_data);
    for(var i in this.meta_data){
      console.log(this.meta_data[i]);
    }
    //this.node_data = this.$route.query.node_data;
},
  methods:{
    showMsgFromChild(data){
      //2 左侧树上节点被点击后触发的响应事件，data存储被点击节点的信息
      console.log("enter showMsgFromChild函数");
      this.current_node = data;
      this.$refs.snlLists.showList(this.current_node);

    },
    editDialogue(){
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
      this.meta_data = this.$route.query.meta_data;
      console.log("in layout this.meta_data = ");
      console.log(this.meta_data);
      //this.node_data = this.$route.query.node_data;
    }
  },
  watch:{
    meta_data(){
      console.log("in layout this.meta_data = ");
      console.log(this.meta_data);
      this.get_meta_node_data();
    }
  }
}
</script>

<style>
body{
  height: 100%;
}

div{
  box-sizing: border-box !important;
}
.container{
  height: 100%;
  box-sizing: border-box;
  background-color: #DCDFE6 !important;
}

.el-header{
  height: 10% !important;
  /* 我们希望 header 采用固定的高度，只占用必须的空间 */
  /* 0 flex-grow, 0 flex-shrink, auto flex-basis */
  flex: 0 0 auto;
  color: #333;
  text-align: center;
  line-height: 60px;
  box-sizing: border-box;
  padding: 0 !important;
}

.el-footer {
  height: 10% !important;
  /* 我们希望 header 采用固定的高度，只占用必须的空间 */
  /* 0 flex-grow, 0 flex-shrink, auto flex-basis */
  flex: 0 0 auto;

  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
  box-sizing: border-box;
}

.el-container{
  /* height: 80%; */
  min-height: 80%;
  max-height: 80%;
  flex: 1 0 auto;
  box-sizing: border-box;
}

.el-aside {
  height: 100%;
  width: 40%;
  box-sizing: border-box;
}
.el-main {
  height: 100%;
  width:50%;
  box-sizing: border-box;
}

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

</style>
