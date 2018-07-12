<template>
  <div>
    <el-tree
    :data="data"
    default-expand-all
    node-key="id"
    ref="tree"
    :props="defaultProps"
    @node-click="handleNodeClick">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>{{ node.data.text }} </span>
      </span>
    </el-tree>
  </div>
</template>


<script>
//try to communicate between leftTree and list
//import layout from '../pages/layout.vue'

export default {
  // props: ["nodedata"],
  data () {
      return {
        data: [],
        "defaultProps": {
          "children": "children",
          "label": "order"
        }
      }
  },
  created () {   /* 这个是vue的钩子函数，当new Vue()实例创建完毕后执行的函数 */
      this.$http.get('/api/mytree').then((data) => {   /* 调用vue的ajax来请求数据，promise语法，并用es6的箭头函数 */
      // this.tree = data.body.datatree;
      // this.name = data.body.name
      this.data = data.body.treedata;
      this.defaultProps = data.body.treeprops;
      })
  },
  methods: {
      handleNodeClick(data, node) {
        //what is node
        // var str="";
        // for (var item in node){
        //     str +=item+":"+node[item]+"\n";
        // }
        //
        // console.log("node==:\n"+str);
        console.log("node.description=" + node.data.description);
        var node_data = {};
        node_data.id = node.id;
        node_data.description = node.data.description;
        //this.$emit("listenToNodeClick", {"id":node.id, "description":node.description});
        this.$emit("listenToNodeClick", node_data);
        console.log("node_data.description=" + node_data.description);
      }
  }
}
</script>


<style>
/* .el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
} */

</style>
