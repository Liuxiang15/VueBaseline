<template>
  <div>
    <demo-header></demo-header>
    <div class="app-container">

      <upload-excel-component :on-success='handleSuccess' :before-upload="beforeUpload"
                              ref="upload-excel-component"></upload-excel-component>

      <el-container>
        <el-aside v-show="showUpload()" style="width: 480px">
          <el-form label-width="100px" label-position="left" v-for="(def,def_index) in templateDefs" :key="def_index"
                   style="padding: 5px">
            <el-card v-show="def_index > 0">
              <el-form-item label="逻辑关系">
                <el-select v-model="def.relation">
                  <el-option key="and" label="并且"
                             value="and"></el-option>
                  <!--<el-option key="or" label="或者"-->
                  <!--value="or"></el-option>-->
                </el-select>
              </el-form-item>
            </el-card>

            <el-card>

              <el-form-item :label="'规则'+(def.no)"></el-form-item>

              <el-form-item label="规则类型">
                <el-select v-model="def.kind">
                  <el-option v-for="(kind,temkind_index) of templateKinds" :key="temkind_index" :label="kind.value"
                             :value="kind.key"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="主语" v-show="showPart(def.kind,'subject')">
                <el-select v-model="def.subject" placeholder="未定义">
                  <el-option v-for="(item,head_index) of tableHeader" :key="head_index" :label="item"
                             :value="item"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="条件" v-for="(cond,cond_index) in def.condition" :key="cond_index"
                            v-show="showPart(def.kind,'condition')">


                <el-select v-model="def.condition_connection[cond_index]" v-show="cond_index>0" placeholder="未定义">
                  <el-option key="and" label="并且"
                             value="and"></el-option>
                  <el-option key="or" label="或者"
                             value="or"></el-option>
                </el-select>

                <el-select v-model="def.condition_verb[cond_index]">
                  <el-option v-for="verb of verbs" :key="verb.key" :label="verb.value"
                             :value="verb.key"></el-option>
                </el-select>

                <el-select v-model="def.condition[cond_index]" placeholder="未定义">
                  <el-option v-for="(item,head_index) of tableHeader" :key="head_index" :label="item"
                             :value="item"></el-option>
                </el-select>
                <br/>
                <el-button icon="el-icon-circle-plus-outline"
                           @click="addSimple( def.condition,def.condition_connection,def.condition_verb,cond_index)"></el-button>
                <el-button icon="el-icon-remove-outline"
                           @click="deleteSimple( def.condition,def.condition_connection,def.condition_verb,cond_index)"
                           v-show="def.condition.length>1"></el-button>
              </el-form-item>


              <el-form-item label="结论" v-for="(con,conclusion_index) in def.conclusion"
                            :key="conclusion_index+'con'"
                            v-show="showPart(def.kind,'conclusion')">

                <el-select v-model="def.conclusion_connection[conclusion_index]" v-show="conclusion_index>0"
                           placeholder="未定义">
                  <el-option key="and" label="并且"
                             value="and"></el-option>
                  <!--v-show处理了不完整的一阶逻辑-->
                  <el-option key="or" label="或者" v-show="def.condition.length>1"
                             value="or"></el-option>
                </el-select>


                <el-select v-model="def.conclusion_verb[conclusion_index]">
                  <el-option v-for="verb of verbs" :key="verb.key" :label="verb.value"
                             :value="verb.key"></el-option>
                </el-select>

                <el-select v-model="def.conclusion[conclusion_index]" placeholder="未定义">
                  <el-option v-for="(item,head_index) of tableHeader" :key="head_index" :label="item"
                             :value="item"></el-option>
                </el-select>

                <br/>

                <el-button icon="el-icon-circle-plus-outline"
                           @click="addSimple( def.conclusion,def.conclusion_connection,def.conclusion_verb,conclusion_index)"></el-button>
                <el-button icon="el-icon-remove-outline"
                           @click="deleteSimple( def.conclusion,def.conclusion_connection,def.conclusion_verb,conclusion_index)"
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

          <el-card>
            <el-table :data="tableData" border highlight-current-row style="width: 100%">
              <el-table-column v-for='(item,head_index) of tableHeader' :prop="item" :label="item" :key='head_index'
                               empty-text=" "
                               :render-header="renderHeader">
              </el-table-column>

              <el-table-column
                prop="defs"
                label="规则" v-if="tableData.length>0">
                <template slot-scope="scope">
                  <el-select v-model="rowDefs[scope.$index]" multiple placeholder="未选择">
                    <el-option
                      v-for="item in templateDefs"
                      :key="item.no"
                      :label="'规则'+(item.no)"
                      :value="item.no">
                    </el-option>
                  </el-select>
                </template>
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
  </div>
</template>

<script>
  import UploadExcelComponent from '../components/UploadExcel/index.vue'
  import DemoHeader from '../components/demoHeader'
  // debugger;
  export default {
    name: "uploadExcel",
    // comments: {ImportExcel},
    components: {UploadExcelComponent, DemoHeader},

    data() {
      return {
        tableData: [],
        tableHeader: [],
        rowDefs: [],
        templateDefs: [],
        templateKinds: [
          {key: 'if', value: '条件结论型'},
          // {key: 'regex', value: '命名规范型'},
          {key: 'exists_attr', value: '属性存在型'}
        ],
        verbs: [
          {key: 'contains', value: '包含'},
          {key: 'equals', value: '等于'},
        ],

        showMask: {
          'if': ['subject', 'condition', 'conclusion'],
          // 'regex': ['subject', 'conclusion'],
          'exists_attr': ['subject', 'subject', 'conclusion']
        },
        maxId: 1
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
        this.maxId = 1;
        this.tableData = results;
        this.tableHeader = header;
        this.rowDefs = [];
        for (let ind = 0; ind < this.tableData.length; ind++) {
          this.rowDefs.push([]);
        }
        this.templateDefs = [];
        this.addDef(-1);

      },
      handleImportExcel() {
        console.log("click on import excel")

        let upload_defs = []
        for (let index = 0; index < this.templateDefs.length; index++) {
          let def_item = this.templateDefs[index];

          // 过滤
          let filtered_condition = [], filtered_condition_connection = [], filtered_condition_verb = [];
          for (let i = 0; i < def_item['condition'].length; i++) {
            if (def_item['condition'][i] !== '' && def_item['kind'] === 'if') {
              filtered_condition.push(def_item['condition'][i])
              filtered_condition_connection.push(def_item['condition_connection'][i])
              filtered_condition_verb.push(def_item['condition_verb'][i])
            }
          }

          let filtered_conclusion = [], filtered_conclusion_connection = [], filtered_conclusion_verb = [];
          for (let i = 0; i < def_item['conclusion'].length; i++) {
            if (def_item['conclusion'][i] !== '') {
              filtered_conclusion.push(def_item['conclusion'][i])
              filtered_conclusion_connection.push(def_item['conclusion_connection'][i])
              filtered_conclusion_verb.push(def_item['conclusion_verb'][i])
            }
          }

          let def_map = {
            'exclusion': [],
            'condition': filtered_condition,
            'condition_connection': filtered_condition_connection,
            'conclusion': filtered_conclusion,
            'condition_verb': filtered_condition_verb,
            'conclusion_connection': filtered_conclusion_connection,
            'conclusion_verb': filtered_conclusion_verb,
            'classification': []
          };

          upload_defs.push(Object.assign({}, def_item, def_map))
        }

        this.$refs["upload-excel-component"].upload2Server(upload_defs, this.rowDefs)

      },


      renderHeader: function (createElement, {column, $index}) {
        return column.label
      },

      showUpload() {

        return !!this.tableData && this.tableData.length;
      },

      addSimple(simples, relations, vbs, index) {
        simples.splice(index + 1, 0, '');
        relations.splice(index + 1, 0, 'and');
        vbs.splice(index + 1, 0, 'contains');
      },

      deleteSimple(simples, relations, vbs, index) {
        simples.splice(index, 1);
        relations.splice(index, 1);
        vbs.splice(index, 1);
      },
      addDef(index) {
        // index表示前一位的下标
        let no = this.maxId++;

        this.templateDefs.splice(index + 1, 0, {
          no: no,
          kind: 'if',
          relation: 'and',
          subject: '',
          condition: [''],
          condition_connection: ['and'],
          condition_verb: ['contains'],
          conclusion: [''],
          conclusion_connection: ['and'],
          conclusion_verb: ['contains'],
        });

        for (let ind = 0; ind < this.rowDefs.length; ind++) {
          this.rowDefs[ind].push(no)
        }
      },
      deleteDef(index) {
        let no = this.templateDefs[index].no;
        this.templateDefs.splice(index, 1);

        for (let ind = 0; ind < this.rowDefs.length; ind++) {
          let pos = this.rowDefs[ind].indexOf(no);
          if (pos > -1) {
            this.rowDefs[ind].splice(pos, 1);
          }
        }
      },

      showPart(kind, part) {
        console.log(part)
        return this.showMask[kind].indexOf(part) >= 0
      },
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
