<template>
  
  <el-menu theme="dark" default-active="1" class="el-menu-demo" mode="horizontal" :router="true">
    <el-menu-item index="/">主页面</el-menu-item>
    <el-submenu index="2">
      <template slot="title">次页面</template>
      <!--<el-menu-item index="/">menu-item-2-1</el-menu-item>-->
      <el-menu-item index="/importExcel">Excel导入</el-menu-item>
      <el-menu-item index="/">menu-item-2-2</el-menu-item>
      <el-menu-item index="/">menu-item-2-3</el-menu-item>
    </el-submenu>
    <el-menu-item index="/">三页面</el-menu-item>
  </el-menu>
  
</template>

<script>
  export default {
    name: 'DemoHeader'
  }
</script>

<style>
.el-menu {
  position: relative;
  width: 100%;
  padding-left: 20%;
  padding-right: 20%;
  background-color: #333;
  border: none;
  box-sizing: border-box;
}
</style>



