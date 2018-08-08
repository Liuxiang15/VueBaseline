<template>
    <el-container @click.native="divClick" >
      <el-aside >
        <left-tree ref="mytree" id="left_tree" :meta_data="meta_data" @metadataSend="metadataSend"
                   v-on:listenToNodeClick="showMsgFromChild">
        </left-tree>
      </el-aside>

      <el-main>
        <div id="main-content" >
          <content-click v-show="content_click_show" :rule_snls="rule_snls"
                         :config_keys="config_keys"
          @snlSaveFromContent="snlSaveFromContent"
                         @showRuleFromContent="showRuleFromContent"
           ref="ruleLists"></content-click>
          <rule-click
            v-show="rule_click_show" ref="snlLists"
            :id="this.$route.query.id"
            :tag_options="tag_options"
            :config_keys="config_keys"
            @metadataSend="metadataSend"
            >
          </rule-click>
        </div>
        <div id="btn-group">

          <el-button @click = "showImportExcel()" icon="el-icon-upload">
            Excel导入
          </el-button>

          <el-button @click.native ="editConfig()">编辑config</el-button>

          <el-button @click.native ="editAlias()">编辑alias</el-button>

          <!--<el-button id="save_metadata" type="success" icon="el-icon-check" @click="metadataSend">保存全部修改</el-button>-->
          <el-button type="primary" icon="el-icon-download">
            <a :href="downloadLink()" style='text-decoration:none;color:inherit;'>
              下载SPL
            </a>
          </el-button>
          <el-button type="primary" @click="manageLibTags">
            管理规则库标签
          </el-button>
          <el-dialog title="管理规则库标签" :visible.sync="tagsDialogShow">
            <el-tag  v-for = "(tag, index) in tag_options"
              :key="tag" size="medium"  closable
              @close="handleClose(tag)">
              {{ tag }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small"
              type="primary" icon="el-icon-edit"
             @click="showInput">+ New Tag</el-button>
          </el-dialog>

          <el-button id="checkout" type="primary" @click="checkAllSNLs">检查所有SNL语句</el-button>



          <el-alert  title="" v-show="right_show" type="success"
            show-icon>
            msg:{{this.check_result.msg}}
          </el-alert>
          <el-alert title="" v-show="wrong_show" type="error"
            show-icon>
            msg:{{this.check_result.msg}}
            <br>
            <div v-for="info in check_result.output">
            {{info}}
            </div>
          </el-alert>
        </div>

      </el-main>
    </el-container>
</template>


<script src="https://cdn.bootcss.com/jquery/1.10.2/jquery.min.js"></script>
<script>
  import {HOST} from '../utils/config'
  import DemoHeader from '../components/demoHeader'
  import LeftTree from '../components/leftTree'
  import List from '../components/list'
  import RuleClick from "../components/ruleClick"
  import ContentClick from "../components/contentClick"


  import {getMetadataById} from '../api/rulelib'

  export default {
    name: 'layout',
    components: {
      DemoHeader,
      LeftTree,
      List,
      RuleClick,
      ContentClick,
    },
    data() {
      return {
        //1 current_node存储当前节点的内容，meta_data和node_data分别存储目录和snl的json内容
        current_node: {},
        meta_data: {},
        rule_click_show: false,
        content_click_show: true,
        rule_snls:[],//存储当前目录(分类)下所有的规则及其对应的SNL语句数组
        rule_order:0,//存储单条规则在当下分类下的孩子排序
        find_rule_order:0,
        check_result:{},
        right_show:false,
        wrong_show:false,
        tag_options:[],
        value:"",
        tagsDialogShow:false,//为了展示tag对话框
        inputVisible: false,
        inputValue: '',//都是对话框的属性
        config_keys:[],//存储config里key便于高亮

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

        newline_words:["如果","if","那么","then"],//需要换行的word


      }
    },
    created() {
      var id = this.$route.query.id;
      // console.log("传参id = ");
      // console.log(id);
      // console.log("in layout create metadata = ");


      this.$ajax({
        //5 向站点请求包含metadata和nodedata属性的字典数据，传参是被查询的lib的id
        method: 'POST',
        url: HOST + '/data/get_metadata',
        data: {"_id": id},
      }).then(response => {
          this.meta_data = response.data;
          for(var tag of this.meta_data.metadata.tags){
          this.tag_options.push(tag);
          }
        }).catch(function (err) {
        console.log(err);
      });

      this.$ajax({
      //7 向站点请求{"_id":"5b470ba5fc6a38858a673ec8","lib_name":"Component Check"}的数组
        method:'POST',
        data:{"_id":id},
        url:HOST+'/config/get_config'
      }).then(response=>{
        // console.log(response.data);
        for(var config of response.data.config.config_list){
          this.config_keys.push(config.key);
        }


        //初始化的时候就在关键词数组里搞进去config的主语key数组
        this.key_words.push(config_keys);
        // console.log(this.config_keys);
      }).catch(function(err){
        console.log(err);
      });
    },
    methods: {
      showMsgFromChild(data) {
        //2 左侧树上节点被点击后触发的响应事件，data存储被点击节点的信息
        // console.log("enter showMsgFromChild函数");
        // console.log(data);
        // console.log("---------------------------------------");
        // console.log(this.meta_data);
        console.log("in layout this.current_node  is ");

        this.current_node = data;
        console.log(this.current_node);
        if(data.is_rule){
          this.$refs.snlLists.showList(data);
          this.rule_click_show = true;
          this.content_click_show = false;
        }
        else{

          this.rule_order = 0;//记住每次获取目录下所有rule_snls的时候必须清0
          this.rule_snls = [];
          this.getRuleSNLs(data.children);
          console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++");
          console.log(this.rule_snls);
          this.$refs.ruleLists.showRules(this.rule_snls);
          this.rule_click_show = false;
          this.content_click_show = true;
        }


      },
      checkAllSNLs(){
        var id = this.$route.query.id;
        this.$ajax({
          method: 'POST',
          url: HOST + '/data/check_snl_all',
          data: {"_id": id},
        }).then(response => {

          console.log(response.data);
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

      handleClose(tag){
        console.log("要删除的标签是：");
        console.log(tag);
        // this.current_node.tags.splice(this.current_node.tags.indexOf(tag), 1);
        // this.tag_options.splice(this.tag_options.indexOf(tag), 1);
        // this.meta_data.metadata.tags.splice(
        //   this.meta_data.metadata.tags.indexOf(tag.label), 1
        // );
        this.tag_options.splice(this.tag_options.indexOf(tag), 1);
        this.meta_data.metadata.tags.splice(
          this.meta_data.metadata.tags.indexOf(tag), 1);
        this.metadataSend();
      },

      manageLibTags(){
        console.log(this.tag_options);
        this.tagsDialogShow = true;
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          if(this.tag_options.indexOf(inputValue) != -1){
            alert("你新添加的标签已存在于规则库中，请重新添加");
          }
          else{
            this.meta_data.metadata.tags.push(inputValue);
            this.tag_options.push(inputValue);
            this.metadataSend();
          }
        }
        this.inputVisible = false;
        this.inputValue = '';
      },

      divClick(){
        console.log("div被点击了");
        this.$refs.mytree.hideMenu();
        //this.$refs.snlLists.close();
        // alert("hello");
      },

      metadataSend() {
        console.log("要传输的数据是-------------------------------------------------------------");
        console.log(this.meta_data);
        this.$ajax({
          //5 向站点请求包含metadata和nodedata属性的字典数据，传参是被查询的lib的id
          method: 'POST',
          //dataType:"jsonp",
          url: HOST + '/data/refresh_metadata',
          data: JSON.stringify(this.meta_data),
        }).then(response => {
          //node_data = response.data.nodedata;
          //6 路由跳转并传递lib的id， meta_data， node_data
          console.log(response.data);
          // alert("保存成功");
        }).catch(function (err) {
          console.log(err);
        });
        // alert("您做的修改已保存到服务器！");
      },
      downloadLink() {
        return HOST + '/data/download_spl_file/' + this.$route.query.id
      },
      showImportExcel() {

        this.$router.push({
          path: '/importExcel',
          props: true,
          query:{
            metadata_id:this.$route.query.id
          }
        });
      },

      showMenu() {
        this.menu_show = true;
        // console.log("enter showMenu函数");
      },
      closeMenu() {
        this.$refs.mytree.close();
        // console.log("进入clickMenu函数");
      },
      downloadSpl() {
      },

      getRuleSNLs(arr){
        for(var child of arr){
          if(child.is_rule){
            var new_item = {};
            new_item.text = child.text;
            new_item.order = this.rule_order;
            new_item.label = child.order;
            new_item.snl = child.snl_spl_pairs;
            //因为每条规则被单击后都有index这么一个属性，所以不需要单独存储
            this.rule_order += 1;
            this.rule_snls.push(new_item);
          }
          else{
            this.getRuleSNLs(child.children);
          }
        }
        console.log("in getRuleSNLs ");
        console.log(this.rule_snls);
    },


    findTargetSNL(arr, index_i, index, snl){
        //根据点击节点的孩子数组，index_i是这条规则在所有子孙中的排序，index是snl语句的顺序
      console.log("index_i是！！！！！！！！！！！！！！！！！！！！！！！！");
      console.log(index_i);
      for(var child of arr){

        if(child.is_rule){
          if(this.find_rule_order == index_i){
            console.log("要改动的规则就是：-----------------------");
            console.log(child);
            child.snl_spl_pairs[index].snl = snl;
            return true;
          }
          else{
            this.find_rule_order++;
          }
        }
        else{
          this.findTargetSNL(child.children, index_i,index, snl);
        }
      }
      return false;
      console.log("index_i是！！！！！！！！！！！！！！！！！！！！！！！！");
      console.log(index_i);
    },

      findTargetRule(arr, index){
        console.log("index 是！！！！！！！！！！！！！！！");
        console.log(index);
        for(var child of arr){
          if(child.is_rule){
            if(this.find_rule_order == index){
              this.$refs.snlLists.showList(child);
              this.rule_click_show = true;
              this.content_click_show = false;
              return;
            }
            else{
              this.find_rule_order++;
            }
          }
          else{
            this.findTargetRule(child.children, index);
          }
        }
      },

    snlSaveFromContent(new_data){
      console.log("进入layout的的snlSaveFromContent函数");
      console.log();
      console.log(new_data);
      this.find_rule_order = 0;
      var result =  this.findTargetSNL(this.current_node.children,new_data.parent_index, new_data.index,new_data.snl);
      this.metadataSend();

      // console.log("要改动的规则就是：！！！！！！！！！！！！！！！！！！");
      // console.log(target_rule);
      // target_rule.snl_spl_pairs[new_data.index].snl = new_data.snl;
      console.log("修改成功，请看测试");
    },

      showRuleFromContent(index){
        this.find_rule_order = 0;
        this.findTargetRule(this.current_node.children, index);
      },

    editConfig(){

      var id = this.meta_data.metadata._id;
      var data = {"_id":id};

      this.$ajax({
        method:'POST',
        data:data,
        url:HOST+'/config/get_config'
      }).then(response=>{
        console.log(response.data);
        this.$router.push({
          path: '/config',
          name: "config" ,
          props: true,
          query:{
            id:id
          },
          params:{
            config: response.data.config,
          }
        });
      }).catch(function(err){
        console.log(err);
      });
    },

    editAlias(index, data){

      var id = this.meta_data.metadata._id;
      console.log("id = " + id);
      this.$ajax({
      //7 向站点请求{"_id":"5b470ba5fc6a38858a673ec8","lib_name":"Component Check"}的数组
        method:'POST',
        url:HOST+'/alias/get_alias',
        data: {"_id":id},
      }).then(response=>{
        console.log("alias file is ");
        console.log(response.data);
        // console.log(response.data.config.alias_list);
        // var alias_list = response.data.config.alias_list;
        this.$router.push({
          path: '/alias',
          name: "alias" ,
          props: true,
          params:{
            response: response.data,
          }
        });
      }).catch(function(err){
        console.log(err);
      });
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

<!-- 使用vue 引入一个组件时，组件中的css样式将作用域全局 ,解决方法-->
<style  scoped>
  body {
    height: 100%;
  }

  div {
    box-sizing: border-box;
  }

  .el-header {
    /* height: 10% ; */
    /* 我们希望 header 采用固定的高度，只占用必须的空间 */
    /* 0 flex-grow, 0 flex-shrink, auto flex-basis */
    /* flex: 0 1 auto; */
    height: 10% ;
    background-color: #333;
    color: #333;
    text-align: center;
    line-height: 60px;
    box-sizing: border-box;
    width: 100%;
    /* padding: 0 !important; */
  }

  #main-content{
      flex: 0 1 70%;
      padding-right: 2%;
      border-right: 2px solid #DCDFE6;
  }

  .el-container {
    display: flex;
    height: 90%;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    /* overflow: scroll;
    &::-webkit-scrollbar{
        background-color:transparent;
    } */
  }

  ::-webkit-scrollbar{
    display: none;
  }

  .el-aside {
    width: 25% !important;
    height: 100%;
    border-right: 2px solid #DCDFE6;
    /* background-color: #DCDFE6; */
  }

  .el-main {
    /* height: 100%; */
    width: 75% !important;
    display: inline-flex;
    box-sizing: border-box;

  }



  .el-tag {
    white-space: inherit;
  }

  .el-tag--medium {
    height: 100%;
  }

  .el-textarea.is-disabled .el-textarea__inner {
    color: black;
  }

  #btn-group {
    display: inline-flex;
    flex-direction: column;
    position: relative;
    left:5%;
    top:5%;
    flex: 0 0 10%;
  }

  button{
    /* max-width: 50%; */
    margin: 5%;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
