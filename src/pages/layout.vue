<template>
  <div>
    <demo-header></demo-header>
    <left-tree></left-tree>
  </div>
</template>


<script>

import DemoHeader from '../components/demoHeader'
import LeftTree from '../components/leftTree'

export default {
  name: 'layout',
  components:{
    DemoHeader,
    LeftTree
  },
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
