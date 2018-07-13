<template>
  <div>
    <demo-header></demo-header>
    <el-container>
      <el-aside width="500px">
        <left-tree :meta="meta" v-on:listenToNodeClick="showMsgFromChild"></left-tree>
      </el-aside>
      <el-main>
        <list :node_data="node_data" ref="snlLists"></list>
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
    components: {
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
        data: {}
      }
    },
    created() {
      this.$ajax({
        method: 'POST',
        url: 'http://101.5.82.179:8099/data/get_data',
        data: {"_id": "5b470ba5fc6a38858a673ec8"},
      }).then(response => {
        console.log(response.data);

        this.meta = response.data.metadata;
        this.node_data = response.data.nodedata;
        console.log(this.meta);


      }).catch(function (err) {
        console.log(err);
      });
      // this.meta_data = response_data.metadata;
      // this.node_data = response_data.nodedata;
      // console.log("in layout this.meta_data是" + this.meta_data);

    },
    methods: {
      showMsgFromChild: function (data) {
        console.log("enter showMsgFromChild函数");
        this.pnodedata = data;
        //执行list的显示函数
        var _this = this;
        _this.$refs.snlLists.show_list(this.pnodedata);

      },
    },
  }
</script>

<style>
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
