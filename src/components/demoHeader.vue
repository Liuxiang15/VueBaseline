<template>
  <el-header class="header">
    <el-menu
    class="menu"

    mode="horizontal"
    @select="handleSelect"

    >
      <el-menu-item clsss="item_logo" index="1" >主页面</el-menu-item>

      <el-submenu clsss="item_user" index="2" >
        <template slot="title">{{this.$store.state.user.name}}</template>
        <el-menu-item index="2-1">
          <!--<i class="el-icon-setting"></i>-->
          设置</el-menu-item>
        <el-menu-item index="2-2">登出</el-menu-item>
      </el-submenu>
    </el-menu>
  </el-header>
</template>

<script>
  export default {
    name: 'DemoHeader',
    methods: {
      importExcelPath: function () {
        return this.$route.query.id;
      },

      handleSelect(key, keyPath){
        console.log(key, keyPath);
        if (key === "2-2") {
          localStorage.name = ''
          localStorage.status = 'logout'
          localStorage.id = ''
          localStorage.token = ''
          this.$store.state.user.name = ''
          this.$store.state.user.id = ''
          this.$store.state.user.status = 'logout'
          this.$store.state.user.token = ''
          this.$router.push('/login')
        }

        if (key === "1") {
          this.$router.push('/index')
        }
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
