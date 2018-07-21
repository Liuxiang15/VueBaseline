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


</div>
</template>



<script>

import {HOST} from '../utils/config'

export default {
  props: {
    meta_data: {}
  },
  components: {

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

      

      }
  },
  created () {
    console.log("enter leftTree的create函数");
    console.log("in leftTree this.meta_data = ");
    console.log(this.meta_data);

    this.data = this.meta_data.metadata.data;
    this.data = this.meta_data.metadata.data;
    this.group = this.meta_data.metadata.tags;

},

  methods: {
      handleNodeClick(data, node) {
        this.$emit("listenToNodeClick", node.data);
        console.log("被点击的node是");
        console.log(node.data);
      },
      handleRightClick(e, obj, node, self){
        // console.log("进入handleRightClick函数");
        // alert("弹出新增目录或者节点对话框");og(0)
        console.log("event是");
        console.log(e);
        console.log("obj是");
        console.log(obj);
        console.log("node是");
        console.log(node);
        // console.log(self);
        this.$emit("listenRightClick");
        /*1捕获鼠标右键*/
          e.preventDefault();
          var x = e.clientX;
          var y = e.clientY;


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
    height: 100%;
    white-space: nowrap;
    /* outline: 0; */
    /* background-color: #C0C4CC; */
}
</style>
