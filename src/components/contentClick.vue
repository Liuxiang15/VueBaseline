<template>
  <div id="ruleCards">
    <el-card v-for="(rule_snl, index) in rule_snls" :key="index"
     v-on:click="getDom($event)"
     shadow="hover"
     class="box-card">
      <div slot="header" class="clearfix">
        <span>规则名:{{rule_snl.text}}</span>
      </div>
      <div>

        <el-table :data="rule_snl.snl">
          <el-table-column label="SNL语句">
            <template slot-scope="scope">
              <!-- <div slot="reference" class="name-wrapper" v-on:click="snlEdit(scope.$index, scope.row)
              > -->
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

    cardClick(e){
      // var e=e||window.event;
      // var tg=e.target||e.srcElement;
      console.log("被点击的card是： ");
      // console.log(tg);
      console.log(e);
    },
    getDom(event){
      console.log("被点击的card是： ");
      console.log(event.target);
    },

    turnToSNLEdit(index, row_data, index_i, event){
      console.log("index");
      console.log(index_i);
      console.log("in contentClick.vue ");
      console.log(event.target);
      console.log(event.currentTarget);
      console.log(index);
      console.log(row_data);
      this.current_snl = row_data;
      this.current_snl.index = index;
      this.current_snl.parent_index = index_i;
      this.$refs.edit_dialog.updateDefaultData(this.current_snl);
      this.edit_show = true;
      // alert("hello");
    },

    save(new_data){
      this.edit_show = false;
      console.log("进入contentrClick的save函数");
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
    display: flex;
    flex-wrap:wrap;
    justify-content:space-around;
  }

  .el-card {
      width: 40%;
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
