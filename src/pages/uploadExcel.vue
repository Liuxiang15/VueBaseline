<template>
  <div class="app-container">
    <upload-excel-component :on-success='handleSuccess' :before-upload="beforeUpload"
                            ref="upload-excel-component"></upload-excel-component>

    <el-container>
      <el-aside v-show="showUpload()">
        <el-form label-width="100px">
          <el-form-item v-for="(item,index) in tableDef" v-bind:label="tableHeader[index]">
            <el-select v-model="tableDef[index]" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="类型">-->
          <!--<el-select placeholder="请选择类定义">-->
          <!--<el-option label="主语" value="subject"></el-option>-->
          <!--<el-option label="条件" value="condition"></el-option>-->
          <!--<el-option label="结论" value="conclusion"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="类型">-->
          <!--<el-select placeholder="请选择类定义">-->
          <!--<el-option label="主语" value="subject"></el-option>-->
          <!--<el-option label="条件" value="condition"></el-option>-->
          <!--<el-option label="结论" value="conclusion"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="类型">-->
          <!--<el-select placeholder="请选择类定义">-->
          <!--<el-option label="主语" value="subject"></el-option>-->
          <!--<el-option label="条件" value="condition"></el-option>-->
          <!--<el-option label="结论" value="conclusion"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
        </el-form>
      </el-aside>
      <el-main>
        <el-table :data="tableData" border highlight-current-row style="width: 100%">
          <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item' empty-text=" "
                           :render-header="renderHeader">
          </el-table-column>
        </el-table>
      </el-main>

    </el-container>

    <br/>

    <div style="text-align: center;">
      <el-button size="mini" type="success" @click="handleImportExcel" v-show="showUpload()">Upload</el-button>
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
        tableHeader: [],
        tableDef: [],
        options: [
          {value: 'subject', label: '主语'},
          {value: 'condition', label: '条件'},
          {value: 'conclusion', label: '结论'},
          {value: 'exclusion', label: '不包含'}
        ]
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
        this.tableDef = new Array(this.tableHeader.length).fill('exclusion')

      },
      handleImportExcel() {
        console.log("click on import excel")


        let def_map = {'exclusion': [], 'subject': [], 'condition': [], 'conclusion': [],'classification':[]};
        for (let index = 0; index < this.tableHeader.length; index++) {
          def_map[this.tableDef[index]].push(this.tableHeader[index])
        }

        this.$refs["upload-excel-component"].upload2Server(def_map)
      },


      renderHeader: function (createElement, {column, $index}) {
        // debugger;

        // console.log(column.label)
        //
        // return createElement('div', [
        //   createElement('span', column.label),
        //
        //   createElement('el-select', [
        //       createElement('el-option', '主语'),
        //       createElement('el-option', '条件'),
        //       createElement('el-option', '结论')
        //     ]
        //     // on: {
        //     //   click: this.clickHandler
        //     // },
        //     // style: {
        //     //   color: 'red',
        //     //   fontSize: '14px'
        //     // }
        //   )
        // ],' ')

        return column.label
      },

      showUpload() {

        return !!this.tableData && this.tableData.length;
      }
    },

  }
</script>

<style scoped>
  .app-container {
    padding: 20px;
  }

  .el-aside {
    padding: 20px;
  }
</style>
