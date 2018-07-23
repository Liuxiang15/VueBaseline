<template>
  <!-- 屏蔽页面右键默认显示的工具菜单
  为元素绑定一个 oncontextmenu 事件 -->
  <!-- <div oncontextmenu="self.event.returnValue=false"> -->
  <div id="aside_container">
    <el-tree
      oncontextmenu="return false"
      draggable
      :data="data"
      default-expand-all
      node-key="id"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      ref="tree"
      :props="defaultProps"
      @node-click="handleNodeClick"
      @node-contextmenu="handleRightClick"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>{{ node.data.text }} </span>
      </span>
    </el-tree>
    <!-- <mymenu v-show="menu_show" id="mymenu"></mymenu> -->
    <el-menu
      v-show="menu_show"
      class="el-menu-vertical-demo">
      <el-menu-item index="1-1" @click.native="newContent">新建目录</el-menu-item>
      <el-menu-item index="1-2" @click.native="newRule">新建规则</el-menu-item>
      <el-menu-item index="1-3" @click.native="deleleNode">删除节点</el-menu-item>
      <el-menu-item index="1-4" @click.native="rename">重命名</el-menu-item>
    </el-menu>

    <new-content></new-content>
</div>
</template>



<script>
import mymenu from "./mymenu.vue"
import newContent from "./newContent.vue"
import {HOST} from '../utils/config'

export default {
  props: {
    meta_data: {}
  },
  components: {
    mymenu,
    newContent,

  },
  data () {
      return {
        data: [],
        config: "",
        group: "",
        defaultProps: {
          "children": "children",
          "label": "order"
        },
        menu_show: false,
      }
  },
  created () {
    // console.log("enter leftTree的create函数");
    // console.log("in leftTree this.meta_data = ");
    // console.log(this.meta_data);

    this.data = this.meta_data.metadata.data;
    this.group = this.meta_data.metadata.tags;
},

  methods: {
      handleNodeClick(data, node) {
        this.$emit("listenToNodeClick", node.data);
        console.log("被点击的node是");
        console.log(node.data);
      },
      handleRightClick(e, nodedata, node, self){
        // console.log("进入handleRightClick函数");
        // alert("弹出新增目录或者节点对话框");og(0)
        this.menu_show = true;
        // console.log("event是");
        // console.log(e);
        console.log("nodedata是");
        console.log(nodedata);
        // console.log("node是");
        // console.log(node);
        /*1捕获鼠标右键*/
        e.preventDefault();
        var x = e.clientX;
        var y = e.clientY;
        console.log("鼠标点击的位置是");
        console.log(x);
        console.log(y);
        // jquery给一个DIV设置坐标：
        // jquery中设置div的坐标位置的方法是通过offset实现的。
        // 1、获取到div对象并且获取到当前偏移位置
        // var p = $("#elementId");对象
        // var offset = p.offset(); 位置
        // 2、设置坐标位置，一般之关系距离顶部和左部的坐标：
        // $("#secondElementId").offset({ top: offset.top, left: offset.left})

        // var mymenu = $("#mymenu");
        // var offset = mymenu.offset();
        // console.log("mymenu的位置是");
        // console.log(offset);

        //绝对定位赋值
        // console.log(mymenu);
        // mymenu.style.position = "absolute";
        // mymenu.style.left = (x + 100) + "px";
        // mymenu.style.top = y + "px";

        // console.log("absolute");

      },
      newContent(description, text){
        console.log("进入新建目录函数！！！");

      },

      newRule(){

      },

      delete(){

      },

      rename(){

      },

      getData(){
        this.data = this.meta_data.metadata.data;
        this.group = this.meta_data.metadata.tags;
      },

      handleDragStart(node, ev) {
        console.log('drag start', node);
      },
      handleDragEnter(draggingNode, dropNode, ev) {
        console.log('tree drag enter: ', dropNode.label);
      },
      // handleDragLeave(draggingNode, dropNode, ev) {
      //   console.log('tree drag leave: ', dropNode.label);
      // },
      // handleDragOver(draggingNode, dropNode, ev) {
      //   console.log('tree drag over: ', dropNode.label);
      // },
      handleDragEnd(draggingNode, dropNode, dropType, ev) {
        console.log('tree drag end: ', dropNode && dropNode.label, dropType);
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        console.log('tree drop: ', dropNode.label, dropType);
      },
      allowDrop(draggingNode, dropNode, type) {
        // if (dropNode.data.label === '二级 3-1') {
        //   return type !== 'inner';
        // } else {
        //   return true;
        // }
      },
      allowDrag(draggingNode) {
        // return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
      },



  },
  watch:{
    meta_data(){
      //2 随时监听meta_data的变化，因为meta_data是在layout文件里给赋值的
      this.getData();
    }
  }
}
</script>

<style>
#aside_container{
  height:100%;
}

#aside{
  height:100%;
}
.el-tree{
  background-color: #DCDFE6;
  height: 100%;
}

.el-tree-node {
    height: 80%;
    white-space: nowrap;
    /* outline: 0; */
    /* background-color: #C0C4CC; */
}
.el-menu {
    background-color: #333;
    border: none;
    box-sizing: border-box;

}

</style>
