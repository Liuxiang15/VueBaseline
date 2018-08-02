<template>
  <div class="app-container">

    <upload-excel-component :on-success='handleSuccess' :before-upload="beforeUpload"
                            ref="upload-excel-component"></upload-excel-component>

    <el-container>
      <el-aside v-show="showUpload()" style="width: 480px">
        <el-form label-width="100px" label-position="left" v-for="(def,def_index) in templateDefs" style="padding: 5px">
          <el-card v-show="def_index > 0">
            <el-form-item label="逻辑关系">
              <el-select v-model="def.relation">
                <el-option key="and" label="并且"
                           value="and"></el-option>
                <el-option key="or" label="或者"
                           value="or"></el-option>
              </el-select>
            </el-form-item>
          </el-card>

          <el-card>
            <el-form-item label="规则类型">
              <el-select v-model="def.kind">
                <el-option v-for="kind of templateKinds" :key="kind.key" :label="kind.value"
                           :value="kind.key"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="主语" v-show="showPart(def.kind,'subject')">
              <el-select v-model="def.subject" placeholder="未定义">
                <el-option v-for="item of tableHeader" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="条件" v-for="(cond,index) in def.condition" v-show="showPart(def.kind,'condition')">


              <el-select v-model="def.condition_connection[index]" v-show="index>0" placeholder="未定义">
                <el-option key="and" label="并且"
                           value="and"></el-option>
                <el-option key="or" label="或者"
                           value="or"></el-option>
              </el-select>


              <el-select v-model="def.condition[index]" placeholder="未定义">
                <el-option v-for="item of tableHeader" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <br/>
              <el-button icon="el-icon-circle-plus-outline"
                         @click="addSimple( def.condition,def.condition_connection,index)"></el-button>
              <el-button icon="el-icon-remove-outline"
                         @click="deleteSimple( def.condition,def.condition_connection,index)"
                         v-show="def.condition.length>1"></el-button>
            </el-form-item>


            <el-form-item label="结论" v-for="(conclusion,index) in def.conclusion"
                          v-show="showPart(def.kind,'conclusion')">


              <el-select v-model="def.conclusion[index]" placeholder="未定义">
                <el-option v-for="item of tableHeader" :key="item" :label="item" :value="item"></el-option>
              </el-select>

              <br/>

              <el-button icon="el-icon-circle-plus-outline"
                         @click="addSimple( def.conclusion,def.conclusion_connection,index)"></el-button>
              <el-button icon="el-icon-remove-outline"
                         @click="deleteSimple( def.conclusion,def.conclusion_connection,index)"
                         v-show="def.conclusion.length>1"></el-button>


            </el-form-item>

            <el-form-item>
              <el-button @click="addDef(def_index)">增加</el-button>
              <el-button @click="deleteDef(def_index)" v-show="templateDefs.length>1">删除</el-button>
            </el-form-item>
          </el-card>

        </el-form>
      </el-aside>

      <el-main>

        <!--<el-row>-->


        <!--<el-form-item v-for="(item,index) in templateDefs" v-bind:label="tableHeader[index]">-->
        <!--<el-select v-model="templateDefs[index]" placeholder="请选择">-->
        <!--<el-option-->
        <!--v-for="item in options"-->
        <!--:key="item.value"-->
        <!--:label="item.label"-->
        <!--:value="item.value">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--</el-form>-->

        <!--</el-row>-->
        <el-card>
          <el-table :data="tableData" border highlight-current-row style="width: 100%">
            <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item' empty-text=" "
                             :render-header="renderHeader">
            </el-table-column>
          </el-table>

        </el-card>
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
        templateDefs: [],
        templateKinds: [{key: 'if', value: '条件结论型'}, {key: 'regex', value: '命名规范型'}, {key: 'exists', value: '属性存在型'}],
        showMask: {
          'if': ['subject', 'condition', 'conclusion'],
          'regex': ['subject', 'conclusion'],
          'exists': ['subject', 'subject', 'conclusion']
        }
        // },
        // defaultDef: {
        //   kind: 'if',
        //   relation: 'and',
        //   subject: '',
        //   condition: [''],
        //   condition_connection: ['and'],
        //   conclusion: [''],
        //   conclusion_connection: ['and'],
        // }
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
        this.templateDefs = [{
          kind: 'if',
          relation: 'and',
          subject: '',
          condition: [''],
          condition_connection: ['and'],
          conclusion: [''],
          conclusion_connection: ['and'],
        }]

      },
      handleImportExcel() {
        console.log("click on import excel")


        let def_map = {'exclusion': [], 'subject': '', 'condition': [], 'conclusion': [], 'classification': []};
        for (let index = 0; index < this.templateDefs.length; index++) {
          this.templateDefs[index] = Object.assign({}, def_map, this.templateDefs[index])
        }

        this.$refs["upload-excel-component"].upload2Server(this.templateDefs)
      },


      renderHeader: function (createElement, {column, $index}) {
        return column.label
      },

      showUpload() {

        return !!this.tableData && this.tableData.length;
      },

      addSimple(simples, relations, index) {
        simples.splice(index + 1, 0, '');
        relations.splice(index + 1, 0, 'and')
      },

      deleteSimple(simples, relations, index) {
        simples.splice(index, 1);
        relations.splice(index, 1)
      },
      addDef(index) {
        this.templateDefs.splice(index + 1, 0, {
          kind: 'if',
          relation: 'and',
          subject: '',
          condition: [''],
          condition_connection: ['and'],
          conclusion: [''],
          conclusion_connection: ['and'],
        })
      },
      deleteDef(index) {
        this.templateDefs.splice(index, 1)
      },

      showPart(kind, part) {
        console.log(part)
        return this.showMask[kind].indexOf(part) >= 0
      }
    },

  }
</script>

<style scoped>
  .app-container {
    padding: 20px;
  }

  .el-aside {
    padding: 15px;
  }

</style>
