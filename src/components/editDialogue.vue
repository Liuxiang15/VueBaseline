<template>
    <el-dialog title="弹出对话框" :visible.sync="dialogFormVisible">
      <!-- <el-form :model="form">
        <el-form-item label="SNL" :label-width="formLabelWidth">
          <el-input
          contenteditable="value"
          type="textarea" v-model="default_data.snl" auto-complete="off"></el-input>
        </el-form-item>
      </el-form> -->
      <div  id="snl_div"
      contenteditable="true"
      v-html="this.snl_html"
      @input = "changeText"
      @onfocus="lastIndex"
      @click = "keepLastIndex"
      >
      <!-- {{this.default_data.snl}} -->
      </div>


      <div v-for = "(val,index) in default_data.spl">
        <el-form>
          <el-form-item label="spl" :label-width="formLabelWidth">
            <el-input v-model="default_data.spl[index]"
            auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">

        <el-button type="danger" icon="el-icon-close" @click="close">关闭</el-button>
        <el-button type="success" icon="el-icon-check" @click="save">确定</el-button>
      </div>
    </el-dialog>
</template>

<script>
  export default {
    // 1 dialogFormVisible决定了对话框是否显现，初始值在本组件里定义
    // 在layout.vue里实现了对该属性修改的函数
    //key_words存储关键词
    //snl_html是snl的HTML版本，比如把关键词用span包围
    name:"editDialogue",
    props:[
      "show", "default_data",
    ],

    data() {
      return {
        dialogTableVisible: this.show,
        dialogFormVisible: false,
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
          ["'", "，", '"', '“','”']
        ],
        formLabelWidth: '120px',
        snl_html:"",
        new_snl:""//随时保存当下snl_html对应的snl
      };
    },
    created(){
      this.keepLastIndex();
    },
    watch:{
      show(val){
        this.dialogFormVisible = val;
      },
      default_data(){
        console.log("this.default_data在起变化");
        console.log(this.default_data);
      },
      "default_data.snl":function(){
        console.log("default_data.snl起变化");
      }
    },
    methods:{
      //2 调用父组件的close函数使的对话框消失
      close() {
        //this.dialogFormVisible = false;
        this.new_snl = "";
        this.$emit('close');
      },

      save() {
        //this.dialogFormVisible = false
        // this.new_snl = this.new_snl.replace("&nbsp;", "");
        this.default_data.snl = this.new_snl.replace("&nbsp;", "");;
        // this.new_snl = "";
        this.$emit('save', this.default_data);
      },

      updateDefaultData(default_data){
        this.default_data = default_data;
        this.snl_html = this.snlToHtml(this.default_data.snl);
      },

      //遍历关键词数组返回词语类型
      typeKeyWord(word){
        for(var type in this.key_words){
          for(var key of this.key_words[type]){
            if(word == key){
              return type;
            }
          }
        }
        return -1;
      },
      lastIndex(){
        console.log("enter lastIndex 函数！！！！！！！！！！");
        var e = event.srcElement;
        var r =e.createTextRange();
        r.moveStart('character',e.value.length);
        r.collapse(true);
        r.select();
      },

      changeText(){
        console.log(this.$el.innerHTML);
        //解析html获取对话框显示的html元素
        var new_snl_html = this.getSnlHtml(this.$el.innerHTML);
        var label_array = new_snl_html.split("&nbsp;");
        console.log("snl_html对应的标签数组是：");
        console.log(label_array);
        var word_array = [];
        for(var label of label_array){
          word_array.push(this.getWord(label));
        }
        // console.log(new_snl_html);
        var new_snl = "";
        // while(new_snl_html.indexOf("</span>&nbsp;") != -1){
        //   var first_pos = new_snl_html.indexOf(">");
        //   var word = new_snl_html.slice(first_pos+1, new_snl_html.indexOf("</span>&nbsp;"));
        //   //这里要注意的就是word可能是符号的html化："=",">=",">","<=","<"
        //   word = this.symbolDetection(word);
        //   // if(word.length > 0){
        //   new_snl += word;
        //   new_snl += ' ';
        //   var next_pos = new_snl_html.indexOf("</span>&nbsp;") + "</span>&nbsp;".length;
        //   new_snl_html = new_snl_html.substr(next_pos, new_snl_html.length);
        //   // console.log("in whileLoop new_snl = ");
        //   // console.log(new_snl);
        //   // }
        // }
        // if(new_snl_html.indexOf("</span>") != -1 ){
        //   //考虑删除操作
        //   var first_pos = new_snl_html.indexOf(">");
        //   var word = new_snl_html.slice(first_pos+1, new_snl_html.indexOf("</span>"));
        //   //这里要注意的就是word可能是符号的html编码"=",">=",">","<=","<"
        //   word = this.symbolDetection(word);
        //   if(word.length > 0){
        //     new_snl += word;
        //     new_snl += ' ';
        //     var next_pos = new_snl_html.indexOf("</span>") + "</span>".length;
        //     new_snl_html = new_snl_html.substr(next_pos, new_snl_html.length);
        //   }
        //
        //   // console.log("in if span new_snl = ");
        //   // console.log(new_snl);
        // }
        // if(new_snl_html.indexOf("&nbsp;") != -1){
        //   // console.log("enter nbsp new_snl = ");
        //   // console.log(new_snl);
        //
        //   new_snl_html = new_snl_html.replace("&nbsp;", "");
        //   //继续修改snl
        //   //如果被替换后new_snl_html为空，那么此时new_snl不需要再多加空格
        //   if(new_snl_html.length > 0){
        //     new_snl += new_snl_html;
        //     new_snl += ' ';
        //     this.new_snl = new_snl;
        //     // console.log("new_snl是--------------------------------");
        //     // console.log(new_snl);
        //     this.snl_html = this.snlToHtml(new_snl);
        //   }
        //
        //   // console.log("after nbsp new_snl = ");
        //   // console.log(new_snl);
        // }
        // this.new_snl = new_snl;
        // console.log("after changeText ");
        // console.log(new_snl);
      },
      symbolDetection(word){
        //这里要注意的就是word可能是符号的html化版
        //"=",">=",">","<=","<"
        var return_word;
        if(word.indexOf("&lt;") != -1 ){
          return_word = word.replace("&lt;", "<");
          // console.log("被处理过的符号是：" + word);
        }
        else if(word.indexOf("&gt;") != -1){
          return_word = word.replace("&gt;", ">");
          // console.log("被处理过的符号是：" + word);
        }
        else{
          return_word = word;
        }
        return return_word;
      },

      snlToHtml(input_str){
        var words = input_str.split(' ');
        var snl_html = "";
        for(var word of words){
          word = this.symbolDetection(word);
          var type = this.typeKeyWord(word);
          var str = "";
          if(type == -1){
            str = '<span class="common">' + word + '</span>';
          }
          else if(type >= 0 && type <= 2){
            str = '<span class="other">' + word + '</span>';
          }
          else if(type >= 3 && type <= 5){
            str = '<span class="num_compare">' + word + '</span>';
          }
          else if(type >= 6 && type <= 9){
            str = '<span class="logic_connect">' + word + '</span>';
          }
          snl_html += str;
          snl_html += "&nbsp";
        }
        return snl_html;
      },
      getSnlHtml(div_html){
        var str1 = div_html.match(/<div id="snl_div"([\s\S]*)/)[0];
        if(div_html.indexOf('<div id="snl_div" contenteditable="true"><br></div>') != -1){
          //此时当用户输入为空时
          return "<span></span>";
        }
        else{
          var str2 = str1.match(/<span([\s\S]*)div>/)[0];
          var pos = str2.indexOf("</div>");
          var new_snl_html = str2.slice(0, pos);
          //console.log("in getSnlHtml test new_snl_html is ------------------------------------");
          //console.log(new_snl_html);
          return new_snl_html;
        }
      },

      getWord(input_str){
        //假设输入都是带有<span></span>的html元素
        if(input_str.indexOf("<span>") == -1 && input_str.indexOf("</span>") == -1){
          console.log("解析后的单词是------------------------------");
          console.log(input_str);
          return input_str;
        }
        else{
          var first_pos = input_str.indexOf(">");
          var second_pos = input_str.indexOf("</");
          var word = input_str.slice(first_pos+1, second_pos);
          return word;
          console.log("解析后的单词是~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
          console.log(word);
        }
      },

      keepLastIndex(){

        // var oText = $("#snl_div");
        // var vLen = this.snl_html.length;
        // // if(oText.setSelectionRange){                    //非ie
        // //   oText.setSelectionRange(vLen,vLen);
        // // }
        // // else{                                         //ie
        //   var a = oText.createTextRange();            //ie支持creatTextRange
        //   a.moveStart('character',vLen);
        //   a.collapse(true);
        //   a.select();                                //选中操作
        // // }
      },
      //光标聚集在最后
      // keepLastIndex(obj) {
      //   if (window.getSelection) {//ie11 10 9 ff safari
      //       obj.focus(); //解决ff不获取焦点无法定位问题
      //       var range = window.getSelection();//创建range
      //       range.selectAllChildren(obj);//range 选择obj下所有子内容
      //       range.collapseToEnd();//光标移至最后
      //   }
      //   else if (document.selection) {//ie10 9 8 7 6 5
      //       var range = document.selection.createRange();//创建选择对象
      //       //var range = document.body.createTextRange();
      //       range.moveToElementText(obj);//range定位到obj
      //       range.collapse(false);//光标移至最后
      //       range.select();
      //   }
      // },
      htmlToSnl(input_html){

      }

    }
  };
</script>
<style>
/* .structure .operation */
.other {
  color: green;
  background-color: yellow;
}
/* .regex  .property_name */
.num_compare  {
  color: blue;
  background-color: green;
}
/* .relation_compare .four_operations .quote */
.logic_connect {
  color: red;
  background-color: green;

}

.el-dialog__headerbtn .el-dialog__close {
    color: #909399;
    display: none;
}

#snl_div{
  border: 1px solid black;
}


</style>
