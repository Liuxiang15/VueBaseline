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

    this.$ajax({
      //5 向站点请求包含metadata和nodedata属性的字典数据，传参是被查询的lib的id
      method:'POST',
  //dataType:"jsonp",
      url:'http://166.111.83.83:8199/data/test',
      data: JSON.stringify(this.meta_data)
    }).then(response=>{
      var test = response.data;
      console.log("in index ");
      console.log(test);
      //node_data = response.data.nodedata;
      //6 路由跳转并传递lib的id， meta_data， node_data

  }).catch(function(err){
    console.log(err);
  });
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
/* #aside{
  height:100%;
} */
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
