<template>
    <el-container >
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
                         ref="ruleLists"
          >
          </content-click>
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
          <el-button @click = "showImportExcel()" icon="el-icon-upload">Excel导入</el-button>
          <el-button @click.native ="editConfig()">编辑config</el-button>
          <el-button @click.native ="editAlias()">编辑alias</el-button>
          <el-button type="primary" icon="el-icon-download">
            <a :href="downloadLink()" style='text-decoration:none;color:inherit;'>
              下载SPL
            </a>
          </el-button>
          <el-button type="primary" @click="showExcelHistory()">查看Excel历史</el-button>
          <el-dialog title="Excel导入历史" :visible.sync="excel_history_show" @close="excel_close">
            <el-collapse accordion>
              <el-collapse-item v-for="(row, index) in excel_history">
                <template slot="title">
                  <el-row class="row-border" type="flex" align="middle">
                    <el-col :span="8">{{row.org_name}}</el-col>
                    <el-col :span="8">{{row.create_date}}</el-col>
                    <el-col :span="8">
                      <el-button type="text">
                        <a :href="downloadExcel() + row._id" style='text-decoration:none;color:inherit;'>下载</a>
                      </el-button>
                    </el-col>
                  </el-row>
                </template>
                <pre class="pj">{{row.excel_template_definition}}</pre>
              </el-collapse-item>
            </el-collapse>
          </el-dialog>

          <el-button type="primary" @click="manageLibTags">
            管理规则库标签
          </el-button>
          <el-dialog title="管理规则库标签" :visible.sync="tagsDialogShow">
            <el-tag  v-for = "(tag, index) in tag_options"
              :key="index" size="medium"  closable
              @close="handleClose(tag)"
            >
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
                       @click="showInput">
              + New Tag
            </el-button>
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
  import RuleClick from "../components/ruleClick"
  import ContentClick from "../components/contentClick"


  import {getMetadataById} from '../api/rulelib'
  import {getExcelHistoryById} from '../api/rulelib'

  export default {
    name: 'layout',
    components: {
      DemoHeader,
      LeftTree,
      RuleClick,
      ContentClick,
    },
    data() {
      return {
        //1 current_node存储当前节点的内容，meta_data和node_data分别存储目录
        excel_history: [],
        current_node: {},
        meta_data: {},
        rule_click_show: false,
        content_click_show: true,
        excel_history_show: false,
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
      this.$ajax({
        // 向站点请求包含metadata和nodedata属性的字典数据,同时把tag分离出来
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
      // 向站点请求config数组，并存储key值数组作为关键词识别
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
        this.current_node = data;
        // console.log("in layout this.current_node  is ");
        // console.log(this.current_node);
        if(data.is_rule){
          this.$refs.snlLists.showList(data);
          this.rule_click_show = true;
          this.content_click_show = false;
        }
        else{
          this.rule_order = 0;//记住每次获取目录下所有rule_snls的时候必须清0
          this.rule_snls = [];
          this.getRuleSNLs(data.children);
          this.$refs.ruleLists.showRules(this.rule_snls);
          this.rule_click_show = false;
          this.content_click_show = true;
        }
      },
      showExcelHistory () {
        // this.excel_history_show = true
        var id = this.$route.query.id;
        this.$ajax({
          // 向站点请求包含metadata和nodedata属性的字典数据,同时把tag分离出来
          method: 'POST',
          url: HOST + '/excel/excel_history',
          data: {"_id": id},
        }).then(response => {
            console.log(response)
            this.excel_history=response.data.data
          }).catch(function (err) {
          console.log(err);
        });
        this.excel_history_show = true
      },
      excel_close () {
        this.excel_history_show = false
      },
      checkAllSNLs(){
        this.$ajax({
          method: 'POST',
          url: HOST + '/data/check_snl_all',
          data: {"_id": this.$route.query.id},
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
        // console.log("要删除的标签是：");
        // console.log(tag);
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
            alert("您新添加的标签已存在于规则库中，请重新添加");
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
      },

      metadataSend() {
        // console.log("要向传输的数据是：");
        // console.log(this.meta_data);
        this.$ajax({
          method: 'POST',
          url: HOST + '/data/refresh_metadata',
          data: JSON.stringify(this.meta_data),
        }).then(response => {
          console.log(response.data);
        }).catch(function (err) {
          console.log(err);
        });
      },

      downloadLink() {
        return HOST + '/data/download_spl_file/' + this.$route.query.id
      },

      downloadExcel() {
        console.log('----=-=------')
        // console.log(_id)
        return HOST + '/excel/download_excel_file/'
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
      getRuleSNLs(arr){
        //找点击目录下的所有规则和它的SNL语句并存储在this.rule_snls.push中
        for(var child of arr){
          if(child.is_rule){
            var new_item = {};
            new_item.text = child.text;
            new_item.order = this.rule_order;
            new_item.label = child.order;
            new_item.snl = child.snl_spl_pairs;
            this.rule_order += 1;
            this.rule_snls.push(new_item);
          }
          else{
            this.getRuleSNLs(child.children);
          }
        }
        // console.log("in getRuleSNLs ");
        // console.log(this.rule_snls);
    },
    findTargetSNL(arr, index_i, index, snl){
      //根据点击节点的孩子数组，index_i是这条规则在所有子孙中的排序，index是snl语句在规则中的顺序找规则
      //并修改该规则的SNL语句
      for(var child of arr){
        if(child.is_rule){
          if(this.find_rule_order === index_i){
            if(child.snl_spl_pairs[index] == "undefined"){
              return "undefined error";
            }
            child.snl_spl_pairs[index].snl = snl;
            this.metadataSend();
            return true;
          }
          else{
            this.find_rule_order++;
          }
        }
        else{
          this.findTargetSNL(child.children, index_i,index, snl);
          return false;
        }
      }
      return false;
    },

      findTargetRule(arr, index){
        //点击目录的查看规则按钮执行的函数，找相应规则
        for(var child of arr){
          if(child.is_rule){
            if(this.find_rule_order == index){
              this.$refs.snlLists.showList(child);
              this.rule_click_show = true;
              this.content_click_show = false;
              this.find_rule_order = 0;
              return true;
            }
            else{
              this.find_rule_order++;
            }
          }
          else{
            this.findTargetRule(child.children, index);
            return false;
          }
        }
        return false;
      },

    snlSaveFromContent(new_data){
      //目录节点的内容修改后执行的保存函数
      this.find_rule_order = 0;
      var result =  this.findTargetSNL(this.current_node.children,new_data.parent_index, new_data.index,new_data.snl);
    },

    showRuleFromContent(index){
      this.find_rule_order = 0;
      this.findTargetRule(this.current_node.children, index);
    },

    editConfig(){
      var data = {"_id":this.meta_data.metadata._id};
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
            id:this.meta_data.metadata._id
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
      this.$ajax({
        method:'POST',
        url:HOST+'/alias/get_alias',
        data: {"_id":this.meta_data.metadata._id},
      }).then(response=>{
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
      // console.log("在snl转化成HTML的过程中，snl是");
      // console.log(input_str);
      var words = input_str.split(' ');
      var snl_html = "";
      for(var word of words){
        var type = this.typeKeyWord(word);
        var str = "";
        if(this.newline_words.indexOf(word) != -1){
          str += "<br/>";
        }
        var _class = this.class_names[type];
        if(this.attrbute_flag){
          _class="attribute";
          this.attrbute_flag = false;
        }
        if(word == "的"){
          this.attrbute_flag = true;
        }
        str += '<span class="' + _class + '">' + word + '</span>';
        snl_html += str;
        snl_html += "&nbsp";
      }
      return snl_html;
    },

    typeKeyWord(word){
        //返回匹配关键词结果
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
<style scoped>
  .row-border {
    /* border-bottom: 1px solid; */
    border-color: #9F79EE;
    height: 50px;
  }

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

  .el-tree-node__content {
    padding: 6px;
    font-size: 35px !important;
  }

  .el-tree-node__expand-icon.expanded {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
    font-size: 35px !important;
  }

  .el-tree-node__content {

    padding: 1% !important;
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
