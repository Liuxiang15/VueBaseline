<template>
  <!-- 屏蔽页面右键默认显示的工具菜单
  为元素绑定一个 oncontextmenu 事件 -->
  <!-- <div oncontextmenu="self.event.returnValue=false"> -->
  <el-tree
  :data="data"
  default-expand-all
  node-key="id"
  ref="tree"
  :props="defaultProps"
  @node-click="handleNodeClick"
  @contextmenu.native="handleRightClick"
  >
    <span class="custom-tree-node" slot-scope="{ node, data }">
      <span>{{ node.label }}</span>
      <span>{{ node.data.text }} </span>
    </span>
  </el-tree>
</template>



<script>
import {HOST} from '../utils/config'

export default {
  props: {
    meta_data: {}
  },
  data () {
      return {
        data: [],
        config: "",
        group: "",
        defaultProps: {
          "children": "children",
          "label": "order"
        }
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
      },
      handleRightClick(){
        // console.log("进入handleRightClick函数");
        // alert("弹出新增目录或者节点对话框");
      },

      getData(){
        this.data = this.meta_data.metadata.data;
        this.group = this.meta_data.metadata.tags;
      }
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
#aside{
  height:100%;
}
.el-tree{
  height: 100%;
}

.el-tree-node {
    height: 100%;
    white-space: nowrap;
    /* outline: 0; */
    background-color: #C0C4CC;
}
</style>
