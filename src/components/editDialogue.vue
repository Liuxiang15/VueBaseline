<template>
    <el-dialog title="在线编辑SNL" :visible="show" @close="close">
      <div id="html_div" v-html="snl_html"></div>
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入SNL语句"
        v-model="input_snl"
        >
      </el-input>

      <div v-for = "(val,index) in default_data.spl" :key="index">
        <el-form>
          <el-form-item label="spl" :label-width="formLabelWidth">
            <el-input v-model="default_data.spl[index]"
            auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-alert  title="" v-show="right_show" type="success"
        show-icon>
        msg:{{this.check_result.msg}}
      </el-alert>
      <el-alert title="" v-show="wrong_show" type="error"
        show-icon>
        msg:{{this.check_result.msg}}
        <br>
        Output:{{this.check_result.output}}
      </el-alert>


      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkSNL">检查</el-button>
        <el-button type="danger" icon="el-icon-close" @click="close">关闭</el-button>
        <el-button type="success" icon="el-icon-check" @click="save">确定</el-button>
      </div>
    </el-dialog>
</template>

<script>
  import {HOST} from '../utils/config'
  export default {
    // 1 dialogFormVisible决定了对话框是否显现，在layout.vue里实现了对该属性修改的函数
    //key_words存储关键词
    //snl_html是snl的HTML版本，比如把关键词用span包围
    name:"editDialogue",
    props:[
      "show",
      "parent",//存储它的父亲组件
    ],

    data() {

      return {
        default_data:{},
        check_result:{},
        right_show:false,
        wrong_show:false,
        attrbute_flag:false,
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
        formLabelWidth: '120px',
        snl_html:"",
        input_snl:"",
        snl_index:0,
        class_names:["other", "structure", "operation", "num_compare", "regex", "property_name", "logic_connect", "relation_compare", "four_operations", "quote", "subject","common"],
        newline_words:["如果","if","那么","then"],//需要换行的word
        line_order:1,//存储当前编辑的行数,
        config_keys:[],
      };
    },
    created(){

    },
     watch:{
      show(val){
        this.input_snl = this.default_data.snl;
      },

      input_snl(){
        //这里要实现对用户输入snl的检查同时生成相应的html
        // this.snl_html = this.snlToHtml(this.input_snl);
      },
    },
    methods:{
      //2 调用父组件的close函数使的对话框消失
      close() {
        // this.new_snl = this.default_data.snl;
        this.$emit('close');
        this.right_show = false;
        this.wrong_show = false;
      },

      save() {
        // this.default_data.snl = this.input_snl;
        //this.current_snl.index
        let temp = {};
        temp.snl = this.input_snl;
        temp.index = this.snl_index;
        //以不同途径保存SNL的修改结果，传递的参数并不相同
        if(this.parent == "rule"){
          this.$emit('save', temp);
        }
        else if(this.parent == "content"){
          temp.parent_index = this.default_data.parent_index;
          this.$emit('save', temp);
        }
        else if(this.parent == "meta_data"){
          console.log("进入对话框的metadata保存函数");
          temp.parent_index = this.default_data.parent_index;
          this.$emit('save', temp);
        }
      },

      checkSNL(){
        this.$ajax({
          //5 向站点请求包含metadata和nodedata属性的字典数据，传参是被查询的lib的id
          method: 'POST',
          url: HOST + '/data/check_snl',
          data: {"snl": this.input_snl},
        }).then(response => {
          this.check_result = JSON.parse(response.data.data);
          if(this.check_result.msg === "correct"){
            this.right_show = true;
            this.wrong_show = false;
          }
          else{
            this.right_show = false;
            this.wrong_show = true;
          }
        }).catch(function (err) {
          console.log(err);
        });
      },

      updateDefaultData(default_data, index, config_keys){
        //初始化对话框的相关参数
        this.default_data = default_data;
        this.snl_html = this.snlToHtml(this.default_data.snl);
        this.snl_index = index;
        if(!this.default_data["parent_index"]){
          //如果传参default_data没有这个属性
            this.key_words.push(config_keys);
        }
      },

      typeKeyWord(word){
        //遍历关键词数组返回词语类型,其实返回的数值就是数组中的下标，
        // 如果找不到，就返回最大下标+1，也就是this.key_words.length
        for(var type in this.key_words){
          for(var key of this.key_words[type]){
            if(word === key){
              return type;
            }
          }
        }
        return this.key_words.length;
      },

      snlToHtml(input_str){
        let line_index = 1;
        while(input_str.indexOf("\n") != -1){
          input_str = input_str.replace("\n", ' ');
        }
        while(input_str.indexOf("\r") != -1){
          input_str = input_str.replace("\r", ' ');
        }
        let words = input_str.split(' ');
        let snl_html = "";
        for(var word of words){
          if(word.length == 0 || word==" "){
            continue;//空格的话进入下一单词的检测
          }
          var type = this.typeKeyWord(word);
          var str = "";
          var _class = "";
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
          str += '<span class="' + _class + '">' + word + '</span>';
          snl_html += str;
          snl_html += "&nbsp";
        }
        return snl_html;
      },

    }
  };
</script>
<style >

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


#html_div{
  display: block;
  height: 100%;
  resize: vertical;
  padding: 5px 15px;
  margin-bottom: 5%;
  line-height: 1.5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  border-radius: 4px;

}




</style>
