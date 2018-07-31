<template>
  <div>
    HHHHHHHHHHHHHHHHHHHHHHHH{{this.rule_snls}}
    <!-- <el-card v-for="rule_snl in this.rule_snls" shadow="hover"  class="box-card"> -->
      <!-- <div slot="header" class="clearfix">
        <span>规则名:{{rule_snl.text}}</span>
        <div v-for="snl_spl in rule_snl">
          {{snl_spl.snl}}
        </div>
      </div> -->

    <!-- </el-card> -->
</div>
</template>

<script>
import editDialogue from "../components/editDialogue.vue"
import {HOST} from '../utils/config'

export default {

  components:{
    editDialogue,
    props:["rule_snls"]
  },

  data() {
    return {
      rule_snls:"GGGGGGGGGGGGGGGG"
    }
  },

  created(){
    this.rule_snls = "GGGGGGG";
    console.log("in contentClick this.rule_snls");
    console.log(this.rule_snls);
  },
  methods:{
    showRules(rule_snls){
      // this.rule_snls = rule_snls;
      // console.log("in showRules");
      // console.log(rule_snls);
    }
  },
  watch:{
    rule_snls(data){
      // this.rule_snls = data;

    }
  }



<style scoped>

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>
