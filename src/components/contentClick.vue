<template>
  <div id="ruleCards">
    <el-card v-for="(rule_snl, index) in rule_snls" :key="index"

     shadow="hover"
     class="box-card">
      <div slot="header" class="clearfix">
        <span>{{rule_snl.label}}{{rule_snl.text}}</span>

           <el-button class="rule-btn" @click = "turnToRule(index)" >
            查看规则
          </el-button>

      </div>
      <div>
        <!--<el-table :data="rule_snl.snl">-->
        <el-table :data="rule_snls_htmls[index]">
          <el-table-column label="SNL语句">
            <template slot-scope="scope">
              <!--<a-->
                <!--href="javascript:void(0);"-->
                <!--v-on:click="turnToSNLEdit(scope.$index, scope.row, index, $event)">-->
                <!--{{scope.row.snl}}-->
              <!--</a>-->
              <div v-on:click="turnToSNLEdit(scope.$index, scope.row, index, $event)" v-html="scope.row">
                <!--{{scope.row}}-->
              </div>
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
  props: ['rule_snls', "config_keys"],

  components:{
    editDialogue,
  },

  data() {
    return{
      edit_show:false,
      current_snl:{},//用户点击的当下SNL语句
      parent_name:"content",
      _index:1,
      snl_html_lists:[],
      rule_snls_htmls:[],
      key_words : [
        // other:
        ["的", ".", "。"],
        //structure:
        [
          "如果","if",
          "那么","then",
          "不存在","存在一个","所有",
          "不","只"
        ],
        // operation:
        [
          "contains","notcontains",
          "equals","notequals"
        ],
        // num_compare:
        [
          "=",">=",">","<=","<"
        ],
        // regex:
        ["regex"],
        // property_name:
        ["~", ",", "@", "-"],
        // logic_connect:
        ["且","并且","或","或者"],
        // relation_compare:
        ["多于","少于","至多","至少"],
        // four_operations:
        ["+","-","*","/"],
        // quote:
        ["'", '"', '“','”'],
        //subject

      ],

      class_names:["other", "structure", "operation", "num_compare", "regex", "property_name", "logic_connect", "relation_compare", "four_operations", "quote", "subject","common"],

      newline_words:["如果","if","那么","then"],//需要换行的words
    }
  },

  created(){
    console.log("进入ruleClick的create函数");
  },

  methods:{
    showRules(rule_snls){

      //先把关键词subject引进来
      console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
      this.key_words.push(this.config_keys);
      //清空数组
      this.snl_html_lists = [];

      this.rule_snls_htmls = [];
      for(var snls of rule_snls){
        var snl_htmls =  [];
        for(var snl of snls.snl){
          var snl_html = this.snlToHtml(snl.snl);
          snl_htmls.push(snl_html);
        }
        this.rule_snls_htmls.push(snl_htmls);
      }
      console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
      console.log(this.rule_snls_htmls);

      this.rule_snls = rule_snls;
      console.log("in showRules HAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
      console.log(rule_snls);
    },



    turnToSNLEdit(index, row_data, parent_index, event){
      console.log("in turnToSNLEdit this.edit_show  是：");
      console.log(this.edit_show);
      // console.log("rowdata 是");
      // console.log(row_data);
      // this.current_snl = row_data;    //z!!!!!这个赋值语句会改变rule_snls
        this.current_snl.snl = row_data.snl;
        this.current_snl.spl = [].concat(row_data.spl);

      // this.current_snl.index = index;
      this.current_snl.parent_index = parent_index;
      console.log(this.current_snl);
      this.$refs.edit_dialog.updateDefaultData(this.current_snl, index, this.config_keys);
      this.edit_show = true;
      // console.log("in contentClick.vue ");
      // console.log(event.target);
      // console.log(event.currentTarget);
    },

    turnToRule(index){
      this.$emit('showRuleFromContent', index);
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
    },

    snlToHtml(input_str){
      console.log("在snl转化成HTML的过程中，snl是");
      console.log(input_str);
      var words = input_str.split(' ');
      var snl_html = "";
      for(var word of words){
        var type = this.typeKeyWord(word);
        var str = "";
        var _class = "";
        if(this.newline_words.indexOf(word) != -1){
          str += "<br/>";
        }

        _class = this.class_names[type];

        if(this.attrbute_flag){
          _class="attribute";
          this.attrbute_flag = false;
        }

        if(word == "的"){
          //两者关系是互斥的
          this.attrbute_flag = true;
        }

        console.log("word 是");
        console.log(word);
        console.log(_class);

        str += '<span class="' + _class + '">' + word + '</span>';
        snl_html += str;
        snl_html += "&nbsp";
      }
      return snl_html;
    },

    typeKeyWord(word){
      for(var type in this.key_words){
        for(var key of this.key_words[type]){
          if(word === key){
            return type;
          }
        }
      }
      return this.key_words.length;
    },
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



  .rule-btn{
    float:right !important;
    padding: 9px 15px !important;
  }


</style>
