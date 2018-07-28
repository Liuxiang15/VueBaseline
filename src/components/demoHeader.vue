<template>

  <!-- index	唯一标志	string -->
  <el-menu theme="dark" default-active="1" class="el-menu-demo" mode="horizontal" :router="true">
    <el-menu-item index="/">主页面</el-menu-item>
    <el-submenu index="/">
      <template slot="title">次页面</template>
      <!--<el-menu-item index="/">menu-item-2-1</el-menu-item>-->
      <el-menu-item index="/":route="{path:'/importExcel?metadata_id='+importExcelPath()}" v-if="showExcelImport()">
        Excel导入
      </el-menu-item>
    </el-submenu>
    <el-menu-item index="/">三页面</el-menu-item>
  </el-menu>

</template>

<script>
  export default {
    name: 'DemoHeader',
    methods: {
      showExcelImport: function () {
        return this.$route.path === '/data';
      },

      importExcelPath: function () {
        return this.$route.query.id;
      }
    }
  }
</script>

<style scoped>
  .el-menu {
    position: relative;
    width: 100%;
    padding-left: 20%;
    padding-right: 20%;
    padding-top: 1%;
    padding-bottom: 1%;
    background-color: #333;
    border: none;
    box-sizing: border-box;
  }
</style>
