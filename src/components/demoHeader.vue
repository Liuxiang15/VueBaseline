<template>
  <div id="header">
    <el-menu theme="dark" default-active="1" class="el-menu-demo" mode="horizontal" :router="true">
        <el-menu-item index="/">主页面</el-menu-item>
        <el-submenu index="2">
            <template slot="title">次页面</template>
            <el-menu-item index="/">menu-item-2-1</el-menu-item>
            <el-menu-item index="/">menu-item-2-2</el-menu-item>
            <el-menu-item index="/">menu-item-2-3</el-menu-item>
        </el-submenu>
        <el-menu-item index="/">三页面</el-menu-item>
    </el-menu>
  </div>
</template>


<script>
export default {

  name: 'DemoHeader',

}
</script>

<style>
#header{
  background-color: #0d71d0;
  color: #0d71d0;
}
</style>
