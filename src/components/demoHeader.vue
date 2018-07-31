<template>
  <el-header class="header">
  <el-menu
  class="menu"
  default-active="1"
  mode="horizontal"
  :router="true">
    <el-menu-item calss="item" index="/">主页面</el-menu-item>
    <el-submenu index="/">
      <template slot="title">次页面</template>
      <!--<el-menu-item index="/">menu-item-2-1</el-menu-item>-->
      <el-menu-item index="/":route="{path:'/importExcel?metadata_id='+importExcelPath()}" v-if="showExcelImport()">
        Excel导入
      </el-menu-item>
    </el-submenu>
  </el-menu>
</el-header>
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

<style lang="stylus" scoped>
.header
  width 100%
  background #FFFFFF
  height 60px
  box-shadow 0 1px 1px rgba(0,0,0,.08)
  z-index 999
  padding 0
  .menu
    margin auto
    .item
      left 25%


</style>
