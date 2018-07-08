<template>
  <div>
    <el-menu theme="dark" default-active="1" class="el-menu-demo" mode="horizontal" :router="true">
        <el-menu-item index="/">menu-item-1</el-menu-item>
        <el-submenu index="2">
            <template slot="title">menu-item-2</template>
            <el-menu-item index="/">menu-item-2-1</el-menu-item>
            <el-menu-item index="/">menu-item-2-2</el-menu-item>
            <el-menu-item index="/">menu-item-2-3</el-menu-item>
        </el-submenu>
        <el-menu-item index="/">menu-item-3</el-menu-item>
    </el-menu>
  </div>
</template>


<script>
export default {

  name: 'DemoHeader',

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
