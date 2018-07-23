<template>
  <el-table
    :data="gridData">
    <el-table-column width="150" label="操作"

     prop="action"></el-table-column>
  </el-table>
</template>

<script>
  export default {
    name:"mymenu",
    // props:[
    //   "show"
    // ],
    data() {
      return {
        gridData: [{
          action:'新建目录'

        }, {
          action:'新建叶子节点'
        }, {
          action:'重命名'
        }, {
          action:'删除'
        }]
      };
    }
  };
</script>

<style scoped>
.el-table__header-wrapper {
    overflow: hidden;
    display: none;
}

.el-table__body-wrapper {
    background-color: #DCDFE6;
}

.el-table__row{
  /* display: none; */
}

.el-table th, .el-table tr {
    background-color: #DCDFE6;
}

.el-menu {

  background-color: white;

}

.el-menu-item {
    color: #000000 !important;
}

</style>
