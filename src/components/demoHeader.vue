<template>
  <div>
    <el-menu theme="dark" default-active="1" class="el-menu-demo" mode="horizontal" :router="true">
      <el-menu-item index="/">主页面</el-menu-item>
      <el-submenu index="2">
        <template slot="title">次页面</template>
        <el-menu-item @click="handleImportExcel()">Excel导入</el-menu-item>

        <!--<el-button-->
        <!--size="mini"-->
        <!--@click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->

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

    methods: {
      handleImportExcel() {
        console.log("click on excel import")
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
