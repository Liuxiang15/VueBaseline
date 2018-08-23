<template>
  <el-header class="header">
    <el-menu
    class="menu"

    mode="horizontal"
    @select="handleSelect"
    :router="true"

    >
      <el-menu-item clsss="item_logo" index="/index" >主页面</el-menu-item>

      <el-submenu clsss="item_user" index="2" >
        <template slot="title">{{this.$store.state.user.name}}</template>
        <el-menu-item index="2-1">
          <!--<i class="el-icon-setting"></i>-->
          设置</el-menu-item>
        <el-menu-item index="/">登出</el-menu-item>
      </el-submenu>
    </el-menu>
  </el-header>
</template>

<script>
  export default {
    name: 'DemoHeader',
    data(){
      return{
        activeIndex: "/index"
      }
    },
    methods: {
      importExcelPath: function () {
        return this.$route.query.id;
      },

      handleSelect(key, keyPath){
        console.log(key, keyPath);
      }
    }
  }
</script>

<style scoped>

  .header
  {
    display: flex;
    justify-content: center;
    width: 100%;
    background: #FFFFFF;
    height: 10% !important;
    box-shadow: 0 1px 1px rgba(0,0,0,.08);
    padding: 0;
    margin-bottom: 0px;
  }

  .menu{
    width: 60%;
    position: relative;
    margin: auto;
  }

  .el-menu-item{
    font-size: 24px;
  }

  .el-submenu{
    position: relative;
    float: right;
  }

</style>
