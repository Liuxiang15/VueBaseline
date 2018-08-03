<template>
  <div id="ruleCards">
    <el-card v-for="(rule_snl, index) in rule_snls" :key="index"
     v-on:click="getDom($event)"
     shadow="hover"
     class="box-card">
      <div slot="header" class="clearfix">
        <span>{{rule_snl.label}}{{rule_snl.text}}</span>
      </div>
      <div>
        <el-table :data="rule_snl.snl">
          <el-table-column label="SNL语句">
            <template slot-scope="scope">
              <a
                href="javascript:void(0);"
                v-on:click="turnToSNLEdit(scope.$index, scope.row, index, $event)">
                {{scope.row.snl}}
              </a>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </el-card>
    <edit-dialogue :show = "edit_show"
      ref = "edit_dialog"
      :parent="parent_name"
      @save = "save" @close="close" >
    </edit-dialogue>
</div>
</template>

<script>
import editDialogue from "../components/editDialogue.vue"
import {HOST} from '../utils/config'

export default {
  name: 'ContentClick',
  props: ['rule_snls'],

  components:{
    editDialogue,
  },

  data() {
    return{
      edit_show:false,
      current_snl:{},//用户点击的当下SNL语句
      parent_name:"content",
      _index:1
    }
  },

  created(){
    console.log("进入ruleClick的create函数");
  },

  methods:{
    showRules(rule_snls){
      this.rule_snls = rule_snls;
      console.log("in showRules");
      console.log(rule_snls);
    },

    getDom(event){
      console.log("被点击的card是： ");
      console.log(event.target);
    },

    turnToSNLEdit(index, row_data, parent_index, event){
      // console.log("in turnToSNLEdit this.current_snl  是：");
      console.log("rowdata 是");
      console.log(row_data);
      // this.current_snl = row_data;    //z!!!!!这个赋值语句会改变rule_snls
        this.current_snl.snl = row_data.snl;
        this.current_snl.spl = [].concat(row_data.spl);

      // this.current_snl.index = index;
      this.current_snl.parent_index = parent_index;
      console.log(this.current_snl);
      this.$refs.edit_dialog.updateDefaultData(this.current_snl, index, []);
      this.edit_show = true;
      // console.log("index");
      // console.log(index_i);
      // console.log("in contentClick.vue ");
      // console.log(event.target);
      // console.log(event.currentTarget);
      // console.log(index);
      // console.log(row_data);
      // alert("hello");
    },

    save(new_data){
      this.edit_show = false;
      console.log("进入contentrClick的save函数");
      console.log(new_data);
      this.$emit('snlSaveFromContent', new_data);
      // console.log(new_data.snl);
      // this.current_node.snl_spl_pairs[new_data.index].snl = new_data.snl;
    },

    close(){
      this.edit_show = false;
    },

    snlEdit(index, row_data){
      // console.log("in contentClick.vue ");
      // console.log(index);
      // console.log(row_data);
    }
  }
}

</script>


<style scoped>

  /* .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  } */
  /* .clearfix:after {
    clear: both
  } */

  /* .box-card {
    width: 480px;
  } */
  #ruleCards{
    width: 100%;
    display: flex;
    flex-wrap:wrap;
    justify-content:space-around;
  }

  .el-card {
      width: 40%;
      margin-bottom: 5%;
  }

  a{
    text-decoration: none;
  }

  .el-table thead {
    color: #909399;
    display: none !important;
    font-weight: 500;
  }
  .el-table th{
    display: none !important;
  }

  .el-table__header-wrapper {
    overflow: hidden;
    display: none;
  }
</style>
