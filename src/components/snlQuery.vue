<template>
  <div class="snl-query-div">
    <el-card v-for="(rule_snl, index) in rule_snls" :key="index"
             shadow="hover"
             class="box-card">
      <div slot="header" class="clearfix">
        <span>{{rule_snl.order}}{{rule_snl.text}}</span>
        <el-button class="rule-btn" @click = "turnToRule(index)" >
          查看规则
        </el-button>
      </div>

      <div  class="html-class"  v-for="(snl_html, _index) in rule_snls_htmls[index]"
            :key="_index"
            v-on:click="turnToSNLEdit(_index, index, $event)"
            v-html="snl_html"
      >
      </div>
    </el-card>

    <edit-dialogue :show = "edit_show"
                   ref = "edit_dialog"
                   :parent="parent_name"
                   @save = "save" @close="close"
    >
    </edit-dialogue>
  </div>
</template>


<script>
  import editDialogue from "../components/editDialogue.vue"


  export default {
    // props: ['rule_snls', "config_keys"],
    props: ["config_keys"],
    components:{
      editDialogue,
    },

    data() {
      return{
        rule_snls:{},
        edit_show: false,
        current_snl:{},//用户点击的当下SNL语句
        parent_name:"meta_data",
        _index:1,
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
        snl_query_words:[],

      }
    },

    created(){
      // console.log("进入ruleClick的create函数");
    },

    methods:{
      showRules(rule_snls, snl_query_words){
        //先把关键词subject引进来
        this.key_words.push(this.config_keys);

        this.snl_query_words = snl_query_words;
        //存储所有snl语句转化的HTML语句数组
        this.rule_snls_htmls = [];
        for(var snls of rule_snls){
          let snl_htmls =  [];
          for(let snl of snls.snls){
            let snl_html = this.snlToHtml(snl);
            snl_htmls.push(snl_html);
          }
          this.rule_snls_htmls.push(snl_htmls);
        }
        console.log("this.rule_snls_htmls是");
        console.log(this.rule_snls_htmls);
        this.rule_snls = rule_snls;
        // console.log("进入SNLQuery的showRules");
        // console.log(this.rule_snls);
      },

      turnToSNLEdit(index, parent_index, event){
        console.log("in turnToSNLEdit this.edit_show  是：");
        console.log(this.rule_snls);
        console.log(parent_index);
        console.log(index);

        this.current_snl.snl = this.rule_snls[parent_index].snls[index];
        this.current_snl.spl = [];
        this.current_snl.parent_index = parent_index;
        // // console.log(this.current_snl);
        this.$refs.edit_dialog.updateDefaultData(this.current_snl, index, this.config_keys);
        this.edit_show = true;
      },

      turnToRule(index){
        this.$emit('showRuleByIndex', index);
      },

      save(new_data){
        this.edit_show = false;
        this.$emit('snlSaveFromSnlQuery', new_data);
        // this.current_snl.snl = this.rule_snls[new_data.parent_index].snl[new_data.index].snl;
        this.rule_snls[new_data.parent_index].snls[new_data.index] = new_data.snl;
        this.rule_snls_htmls[new_data.parent_index][new_data.index] = this.snlToHtml(new_data.snl);
      },

      close(){
        this.edit_show = false;
      },

      snlToHtml(input_str){
        // console.log("在snl转化成HTML的过程中，snl是" + input_str);
        let line_index = 1;
        //去除换行符和\r符
        while(input_str.indexOf("\n") != -1){
          input_str = input_str.replace("\n", ' ');
        }
        while(input_str.indexOf("\r") != -1){
          input_str = input_str.replace("\r", ' ');
        }
        var words = input_str.split(' ');
        var snl_html = "";
        for(var word of words){
          if(word.length == 0 || word==" "){
            continue;//空格的话进入下一单词的检测
          }
          let type = this.typeKeyWord(word);
          let str = "";
          let _class = "";
          if(this.newline_words.indexOf(word) != -1){
            if(line_index !== 1){
              str += "<br/>";
            }
            line_index += 1;
          }
          _class = this.class_names[type];
          //以下是判断当前关键词类型的特殊情况
          if(this.attrbute_flag){
            _class="attribute";
            this.attrbute_flag = false;
          }
          if(word == "的" || word=="有属性"){
            this.attrbute_flag = true;
            _class = "structure";
          }

          if(this.snl_query_words.indexOf(word) !== -1){
            //被搜索词直接是个单词
            str += '<span class="' + _class + ' query">' + word + '</span>';
          }
          else{
            let has_queryword = false;
            for(let query_word of this.snl_query_words){
              if(word.indexOf(query_word) !== -1){
                has_queryword = true;
                let start_index = word.indexOf(query_word);
                let end_index = start_index + query_word.length;
                let former_str = word.slice(0, start_index);
                // console.log("former_str是" + former_str);
                let latter_str = word.slice(end_index);//截取到最后一个字符
                // console.log("latter_str是" + latter_str);
                str += '<span class="' + _class + '">' + former_str + '</span>';
                str += '<span class="' + _class + ' query">' + query_word + '</span>';
                str += '<span class="' + _class + '">' + latter_str + '</span>';
              }
            }
            if(!has_queryword){
              str += '<span class="' + _class + '">' + word + '</span>';
            }
          }
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
    },


  }

</script>

<style scoped>
  .html-class{
    padding: 10px;
    border:1px solid #DCDFE6;

  }

  span{
    white-space: pre-wrap;
  }

  .html-class:hover{
    cursor: pointer;
    background:#DCDFE6;

  }

  .el-card {
    width: 70%;
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

  .query {
     background-color:yellow;
   }

  .other{

  }

  .structure{
    color: orange;
  }

  .operation{
    color: orange;
  }

  .num_compare {
    color: orange;
  }
  .regex{
    color: orange;
  }
  .property_name{
    color: orange;
  }

  .logic_connect {
    color: orange;

  }

  .relation_compare{
    color: orange;
  }

  .four_operations{
    color: orange;
  }

  .quote{

  }

  .subject{
    color:red;
  }
  .common{
    color:black;
  }

  .query {
    background-color:yellow;
  }
  .attribute{
    color:blue;
  }

</style>
