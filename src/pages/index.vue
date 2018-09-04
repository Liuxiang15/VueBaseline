<template>
  <div>
    <demo-header></demo-header>

    <el-main class="container">
      <el-row type="flex" justify="space-around">
        <el-col :xs="24" :sm="24" :lg="24">
          <el-card class="overview-panel" :body-style="{ padding: '0px' }">
            <div slot="header" class="clearfix">
              <i class="el-icon-document"></i>
              <span>公共规则库列表</span>
              <el-button style="float:right" @click.native="createPublicLib()">创建规则库</el-button>
            </div>
            <div class="overview-content">
              <el-table class="table" :data="public_lib_names">
                <el-table-column prop="public_lib_names" label="规则库名字">
                  <template slot-scope="scope">
                    <i class="el-icon-document"></i>
                    <span style="margin-left: 10px">{{ scope.row.lib_name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="props">
                    <el-button @click.native="showDetail(props.$index, props.row)">查看详情</el-button>
                    <el-button @click.native="libRename(props.$index, props.row, public_type)">重命名</el-button>
                    <el-button type="danger" @click.native="libDelete(props.$index, props.row, public_type)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row type="flex" justify="space-around">
        <el-col :xs="24" :sm="24" :lg="24">
          <el-card class="overview-panel" :body-style="{ padding: '0px' }">
            <div slot="header" class="clearfix">
              <i class="el-icon-document"></i>
              <span>私有规则库列表</span>
              <el-button style="float:right" @click.native="createPrivateLib">创建规则库</el-button>
            </div>
            <div class="overview-content">
              <el-table class="table" :data="private_lib_names">
                <el-table-column prop="private_lib_names" label="规则库名">
                  <template slot-scope="scope">
                    <i class="el-icon-document"></i>
                    <span style="margin-left: 10px">{{ scope.row.lib_name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="props">
                    <el-button @click.native="showDetail(props.$index, props.row)">查看详情</el-button>
                    <el-button @click.native="libRename(props.$index, props.row, private_type)">重命名</el-button>
                    <el-button type="danger" @click.native="libDelete(props.$index, props.row, private_type)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-dialog title="规则库重命名" :visible.sync="rename_dialog_show">
        <el-input v-model="new_libname">
        </el-input>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" icon="el-icon-close" @click="closeDialog">关闭</el-button>
          <el-button type="success" icon="el-icon-check" @click.native="saveRename()">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="删除提示"
        :visible.sync="centerDialogVisible"
        width="500px"
        center>
        <span>您确定删除选中的规则库吗？</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="cancalDelete">取 消</el-button>
        <el-button type="primary" @click="sureDelete">确 定</el-button>
      </span>
      </el-dialog>

    </el-main>
  </div>
</template>

<script>
  import config from '../components/editConfig.vue'
  import alias from '../components/editAlias.vue'
  import {findPublicLibList} from '../api/rulelib'
  import {findPrivateLibList} from '../api/rulelib'
  import {createRuleLib} from '../api/rulelib'
  import {createPrivateRuleLib} from '../api/rulelib'
  import {_libDelete} from '../api/rulelib'
  import {changeLibName} from '../api/rulelib'
  import DemoHeader from '../components/demoHeader'

  import {HOST} from '../utils/config'

  export default {
    name: "index",
    components: {DemoHeader},
    data() {
      return {
        //lib_names是存储包含id和snl_spl_pairs属性的字典的列表
        //lib_names_ids是包含lib_name和_id属性的字典的列表
        public_lib_names: [],
        private_lib_names: [],
        rename_dialog_show: false,
        new_libname: "",
        current_index: 0,
        centerDialogVisible: false,
        public_type: "public",
        private_type: "private",
        type: "",  //操作的规则库类型
      }
    },

    // dynamically set transition based on route change
    watch: {
      '$route'(to, from) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }
    },

    created() {
      //2 向指定网页发送get请求并接收存储metadata和nodedata的字典
      findPublicLibList(response => {
        this.public_lib_names = response.data.data;
        console.log(this.public_lib_names);
      });

      findPrivateLibList({"user_id": this.$store.state.user.id}).then(
        response => {
          this.private_lib_names = response.data.data;
          console.log("收到的private 信息是");
          console.log(response.data);
        }
      );

      this.$notify({
        title: "公告：20180904--新功能发布",
        message: "Excel导入新增动词'等于'，默认情况不用改变,选择包含即可",
        duration: 0
      });

      // console.log(localStorage)
    },
    methods: {
      showDetail(index, row) {
        //3 点击某一行规则库名后的按钮触发的事件，index是点击行在列表中的下标(从0开始)
        //data是点击该行存储的数据，具体内容可看console语句输出
        this.$router.push({
          path: '/data',
          name: "layout",
          props: true,
          query: {id: row._id,}
        });
      },


      createPublicLib() {
        createRuleLib(response => {
          // console.log("新建规则库的调试信息有：");
          // console.log(response.data);
        }).then(
          findPublicLibList(response => {
            this.public_lib_names = response.data.data;
            // console.log("新增公共规则库后的结果是：")
            // console.log(response.data.data);
          })
        )
      },

      libDelete(index, data, type) {
        this.centerDialogVisible = true;
        this.current_index = index;
        this.type = type;
      },

      sureDelete() {
        this.centerDialogVisible = false;
        //这个先后顺序不能换
        if (this.type === "private") {
          _libDelete({"_id": this.private_lib_names[this.current_index]._id}).then(response => {// console.log(response.data);
              this.private_lib_names.splice(this.current_index, 1);
            }
          );
        }
        else if (this.type === "public") {
          _libDelete({"_id": this.public_lib_names[this.current_index]._id});
          this.public_lib_names.splice(this.current_index, 1);
        }
      },

      cancalDelete() {
        this.centerDialogVisible = false;
        this.current_index = -1;
      },

      libRename(index, data, type) {
        this.type = type;
        this.current_index = index;
        if (type === "private") {
          this.new_libname = this.private_lib_names[index].lib_name;
        }
        else if (type === "public") {
          this.new_libname = this.public_lib_names[index].lib_name;
        }
        // console.log(this.type);
        // console.log("libname是-------------------------------"+this.new_libname);
        this.rename_dialog_show = true;
      },

      closeDialog() {
        this.rename_dialog_show = false;
      },

      saveRename() {
        this.rename_dialog_show = false;
        // console.log("进入saveRename函数");
        // console.log(this.public_lib_names[this.current_index]);
        if (this.type === "private") {
          this.private_lib_names[this.current_index].lib_name = this.new_libname;
          changeLibName({
            "_id": this.private_lib_names[this.current_index]._id,
            "lib_name": this.new_libname,
          });
        }
        else if (this.type === "public") {
          this.public_lib_names[this.current_index].lib_name = this.new_libname;
          changeLibName({
            "_id": this.public_lib_names[this.current_index]._id,
            "lib_name": this.new_libname,
          });
        }
      },

      createPrivateLib() {
        createPrivateRuleLib({"user_id": this.$store.state.user.id}).then(
          response => {
            findPrivateLibList({"user_id": this.$store.state.user.id}).then(
              response => {
                this.private_lib_names = response.data.data;
                console.log("收到的private 信息是");
                console.log(response.data);
                ;
              }
            );
          })
      },

    },
  }
</script>

<style lang="stylus" scoped>

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .container
    width 60%
    position relative
    left 20%
    .overview-panel
      width 100%
      .overview-content
        overflow auto
        .table
          width 100%
</style>
