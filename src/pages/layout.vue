<template>
  <div>
    <demo-header></demo-header>
    <el-container>

    <el-aside width="500px">
      <left-tree v-on:listenToNodeClick="showMsgFromChild"></left-tree>
    </el-aside>
    <el-main>
      <p> {{ pnodedata }} </p>
    </el-main>
  </el-container>
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
  data() {
    return {
      pnodedata: {}
    }
  },
  methods:{
    showMsgFromChild:function(data){
      console.log(data);
      this.pnodedata = data;
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


/* .el-aside {
   background-color: #D3DCE6;
   color: #333;
   text-align: center;
   line-height: 200px;
   width:800px;
 } */

 /* .el-main {
   background-color: #E9EEF3;
   color: #333;
   text-align: center;
   line-height: 160px;
 }
.el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
    width:800px;
  } */
</style>
