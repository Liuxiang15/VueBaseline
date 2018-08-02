<template>
    <el-container>
      <el-aside>
        <left-tree ref="mytree" id="left_tree" :meta_data="meta_data" v-on:listenToNodeClick="showMsgFromChild">
        </left-tree>
      </el-aside>

      <el-main>
        <div id="main-content">
          <content-click v-show="content_click_show" :rule_snls="rule_snls"
          @snlSaveFromContent="snlSaveFromContent"
           ref="ruleLists"></content-click>
          <rule-click
            v-show="rule_click_show" ref="snlLists" :tag_options="tag_options">
          </rule-click>
        </div>
        <div id="btn-group">
          <el-button id="save_metadata" type="success" icon="el-icon-check" @click="metadataSend">保存全部修改</el-button>
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
        rule_click_show: true,
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
        // console.log("in index response.data =  ");
        // console.log(response.data);
        this.meta_data = response.data;
        for(var tag of this.meta_data.metadata.tags){
          // var newtag = {
          //   value:index,
          //   label:this.meta_data.metadata.tags[index]
          // }
          // this.tag_options.push(newtag);
          this.tag_options.push(tag);
        }


        }).catch(function (err) {
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
          this.meta_data.metadata.tags.push(inputValue);
          this.tag_options.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },

      metadataSend() {
        console.log("---------------------------------");
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
          alert("保存成功");
        }).catch(function (err) {
          console.log(err);
        });
      },
      downloadLink() {
        return HOST + '/data/download_spl_file/' + this.$route.query.id
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

    findTargetRule(arr, index_i){
      for(var child of arr){
        if(child.is_rule){
          if(this.find_rule_order == index_i){
              return child;
          }
          else{
            this.find_rule_order++;
          }
        }
        else{
          this.findTargetRule(child.children);
        }
      }
    },
    snlSaveFromContent(new_data){
      console.log("进入layout的的snlSaveFromContent函数");
      console.log(new_data);
      var target_rule = this.findTargetRule(this.current_node.children,new_data.parent_index)
      console.log("要改动的规则就是：！！！！！！！！！！！！！！！！！！");
      console.log(target_rule);
      target_rule.snl_spl_pairs[new_data.index].snl = new_data.snl;
      console.log("修改成功，请看测试");
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
    padding: 0 !important;
  }

  #main-content{
      flex: 0 1 70%;
      padding-right: 2%;
      border-right: 2px solid #DCDFE6;;
  }

  .el-container {
    height: 90%;
    box-sizing: border-box;
  }

  .el-aside {
    min-width: 25%;
    height: 100%;
    background-color: #DCDFE6;
  }

  .el-main {
    /* height: 100%; */
    display: flex;
    box-sizing: border-box;

  }

  .el-textarea__inner {
    width: 100%;
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
