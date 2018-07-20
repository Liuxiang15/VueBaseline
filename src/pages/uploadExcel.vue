<template>
  <div class="app-container">
    <upload-excel-component :on-success='handleSuccess' :before-upload="beforeUpload"
                            ref="upload-excel-component"></upload-excel-component>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
      </el-table-column>
    </el-table>
    <br/>
    <div style="text-align: center;">
      <el-button size="mini" type="success" @click="handleImportExcel">Upload</el-button>
    </div>
  </div>
</template>

<script>
  import UploadExcelComponent from '../components/UploadExcel/index.vue'
  // debugger;
  export default {
    name: "uploadExcel",
    // comments: {ImportExcel},
    components: {UploadExcelComponent},

    data() {
      return {
        tableData: [],
        tableHeader: []
      }
    },
    // created() {
    //   // debugger;
    //   console.log("ddddddddddddddssssssssygfhgkkoiuddddddddddddddd")
    // },
    methods: {
      beforeUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1

        if (isLt1M) {
          return true
        }

        this.$message({
          message: 'Please do not upload files larger than 1m in size.',
          type: 'warning'
        })
        return false
      },


      handleSuccess({results, header}) {
        this.tableData = results
        this.tableHeader = header
      },
      handleImportExcel() {
        console.log("click on import excel")
        debugger;

        this.$refs["upload-excel-component"].upload2Server()
      }
    },

  }
</script>

<style scoped>
  .app-container {
    padding: 20px;
  }
</style>
