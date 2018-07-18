<template>
  <!-- 屏蔽页面右键默认显示的工具菜单
  为元素绑定一个 oncontextmenu 事件 -->
  <!-- <div oncontextmenu="self.event.returnValue=false"> -->
  <div>
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
  </div>
</template>

<script>
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
        //1 点击树的节点后，会将node_data的id和text传到layout组件里
        //请注意this_id才是节点的唯一标识
        var node_data = {};
        node_data.id = node.data.this_id;
        node_data.text = node.data.text;
        node_data.description = node.data.description;
        this.$emit("listenToNodeClick", node_data);
        // console.log("node_data.description=" + node_data.description);
        // console.log("this.data是" + this.data);
        // var str="";
        // for (var item in this.data){
        //     str +=item+":"+this.data[item]+"\n";
        // }
        //
        // console.log("this.data==:\n"+str);
      },
      handleRightClick(){
        // console.log("进入handleRightClick函数");
        // alert("弹出新增目录或者节点对话框");
      },

      getData(){
        this.data = this.meta_data.metadata.data;
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

</style>
