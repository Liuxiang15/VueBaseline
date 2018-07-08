<template>
  <div>
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">
      asd
    </el-tree>
  </div>
</template>


<script>
export default {
  data () {
      return {
        data: [],
        defaultProps: {}
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
      handleNodeClick(data) {
        console.log(data);
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
