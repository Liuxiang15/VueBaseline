<template>
  <!-- 屏蔽页面右键默认显示的工具菜单
  为元素绑定一个 oncontextmenu 事件 -->
  <!-- <div oncontextmenu="self.event.returnValue=false"> -->
  <div id="aside_container" >
    <!--<el-input id="filter-input"-->
      <!--placeholder="输入关键词在编号、目录(规则)名、规则描述中进行过滤"-->
      <!--v-model="filterText">-->
    <!--</el-input>-->

    <!--<div class="snl-query-div">-->
      <!--<el-input class="snl-query"-->
                <!--placeholder="SNL语句查询"-->
                <!--v-model="filter_snl_key">-->
      <!--</el-input>-->
      <!--<el-button type="primary" size="mini"icon="el-icon-search" @click.native="snlQuery">搜索</el-button>-->
    <!--</div>-->

    <div class="filter-input">
      <el-input placeholder="请输入搜索内容" class="input-with-select"
                v-model="filter_text"
      >
        <el-select v-model="select_method" slot="prepend" placeholder="请选择搜索方式" style="width: 140px;">
          <el-option label="目录/规则信息搜索" value="tree"></el-option>
          <el-option label="SNL搜索" value="snl"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click.native="handleFilter">
          搜索
        </el-button>
      </el-input>
    </div>

    <el-tree

      :filter-node-method="filterNode"
      class="filter-tree"
      oncontextmenu="return false"
      draggable
      :data="data"
      default-expand-all
      node-key="id"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      ref="tree"
      :props="defaultProps"
      @node-click="handleNodeClick"
      @node-contextmenu="handleRightClick"
    >
        <span class="custom-tree-node"  slot-scope="{ node, data }">
          {{ node.label }} {{ node.data.text }}
        </span>
    </el-tree>

    <el-dialog title="新建目录" :visible.sync="new_content_show" @close="close">
      <el-form>
        <el-form-item label="编号">
          <el-input v-model="new_order" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="名称">
          <el-input v-model="new_text" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" icon="el-icon-close" @click="close">关闭</el-button>
        <el-button type="success" icon="el-icon-check" @click="save">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新建规则" :visible.sync="new_rule_show" @close="close">
      <el-form>
        <el-form-item label="编号">
          <el-input v-model="new_order" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="名称">
          <el-input v-model="new_text" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="规则详细描述">
          <el-input v-model="new_description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" icon="el-icon-close" @click="close">关闭</el-button>
        <el-button type="success" icon="el-icon-check" @click="save">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="重命名" :visible.sync="rename_show" @close="close">
      <el-form>
        <el-form-item label="编号">
          <el-input v-model="new_order" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="新名称">
          <el-input v-model="new_text" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" icon="el-icon-close" @click="close">关闭</el-button>
        <el-button type="success" icon="el-icon-check" @click="save">确定</el-button>
      </div>
    </el-dialog>

    <el-menu  id="action_menu"v-show="menu_show"
      class="el-menu-vertical-demo">
      <el-menu-item index="1-1" @click.native="newContent">新建目录</el-menu-item>
      <el-menu-item index="1-2" @click.native="newRule">新建规则</el-menu-item>
      <el-menu-item index="1-3" @click.native="deleleNode">删除节点</el-menu-item>
      <el-menu-item index="1-4" @click.native="rename">重命名</el-menu-item>
    </el-menu>

    <el-dialog
      title="删除提示"
      :visible.sync="node_delete_show"
      center>
      <span>您确定删除选中的节点吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="nodeCancelDelete">取 消</el-button>
        <el-button type="primary" @click="nodeSureDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>



<script>
import {HOST} from '../utils/config'
import newContent from './newContent.vue'
export default {
  props: {
    meta_data: {}
  },
  components: {
    newContent
  },
  data () {
      return {
        data: [],
        config: "",
        // group: "",
        defaultProps: {
          "children": "children",
          "label": "order"
        },
        menu_show: false,
        new_content_show:false,
        new_rule_show:false,
        rename_show:false,
        operation:0,
        hello:"hello",
        new_text:"text",
        new_description:"None",
        new_order:"0",
        new_snl:"",
        current_data:{},
        current_node:{},
        node_delete_show:false,
        filter_text:"",
        filter_snl_key:"",
        rule_index:0,//存储当下规则节点在metadata中的规则序号
        snl_query_result:[],
        select_method:"",//保存选择的搜索方式
        // expanded_keys:"[1]",
        //opera `1234分别为新建目录， 新建叶子节点， 删除该节点， 重命名

      }
  },
  created () {
  //之所以没有任何操作，是因为要传入的meta_data也是在layout里函数获取后才赋值的，所以此时不能赋值
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    handleNodeClick(node_data, node) {
      // 参数:传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node
      console.log("被点击的node的data是");
      console.log(node.data);
      this.$emit("listenToNodeClick", node.data);
      this.menu_show = false;
    },

    handleRightClick(event, nodedata, node, self){
        if(!this.menu_show){
          //将弹出的菜单定位在鼠标点击附近
          let menu = $("#action_menu");
          menu.css("left", event.clientX);
          menu.css("top", event.clientY);
          this.menu_show = true;
        }
      this.current_data = nodedata;
      this.current_node = node;
    },

    hideMenu(){
      this.menu_show = false;
    },
    close(){
      //所有对话框和菜单栏不可见
      this.new_content_show = false;
      this.new_rule_show = false;
      this.menu_show = false;
      this.rename_show = false;
      //输入框的值保持为原始
      this.new_text = "";
      this.new_description = "";
      this.new_order = "";
      this.new_snl = "";
    },
    save(){
      if(this.operation == 1){
        this.new_content_show = false;
        //还要保存输入结果
        const new_item = {};
        new_item.children = [];
        new_item.description = "None";
        new_item.is_rule = false;
        new_item.order = this.new_order;
        new_item.snl_spl_pairs = [];
        new_item.tags = [];
        new_item.text = this.new_text;
        // console.log("this.current_data是：");
        // console.log(this.current_data);
        this.current_data.children.push(new_item);
      }
      else if(this.operation == 2){
        //假设用户只输入一条SNL语句
        this.new_rule_show = false;
        const new_item = {};
        new_item.children = [];
        new_item.description = this.new_description;
        new_item.is_rule = true;
        new_item.order = this.new_order;
        new_item.snl_spl_pairs = [];
        new_item.tags = [];
        new_item.text = this.new_text;
        // console.log("this.current_data是：");
        // console.log(this.current_data);
        this.current_data.children.push(new_item);
      }
      else if(this.operation == 4){
        this.rename_show = false;
        this.current_data.text = this.new_text;
        this.current_data.order = this.new_order;
        this.new_order = "";
      }
      this.$emit("metadataSend");
      this.menu_show = false;
      //输入框的值保持为原始
      this.new_text = "";
      this.new_description = "";
      this.new_order = "";
      this.new_snl = "";
    },
    getData(){
      // console.log("in getData ");
      // console.log(this.meta_data);
      this.data = this.meta_data.metadata.data;
    },
    handleDragStart(node, ev) {
      console.log('drag start', node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label);
    },

    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType);
    },

    newContent(node_data){
      //先传参进入newContent函数,之后可能通过data里的值传进来
      if(this.current_data.is_rule){
        this.menu_show = false;
        alert("当前操作规则不能新建目录");
      }
      else{
        this.operation = 1;
        this.new_content_show = true;
      }
    },

    newRule(node_data, des, text){
      if(this.current_data.is_rule){
        this.menu_show = false;
        alert("当前操作规则不能新建规则");
      }
      else{
        this.operation = 2;
        this.new_rule_show = true;
      }
    },

    deleleNode(){
      //删除该节点，修改双亲节点,注意参数是node
      this.operation = 3;
      this.node_delete_show = true;
      this.menu_show = false;
    },

    nodeCancelDelete(){
      this.node_delete_show = false;
    },

    nodeSureDelete(){
      this.node_delete_show = false;
      const parent = this.current_node.parent;
      // console.log("删除节点的父亲是：");
      // console.log(parent);
      // const children = parent.data.children || parent.data;
      const children = parent.childNodes;
      // console.log("删除节点的兄弟有：");
      // console.log(children);
      // console.log("删除节点是：");
      // console.log(this.current_node);
      const index = children.findIndex(d => d.id === this.current_node.id);
      // console.log("删除节点的index是：");
      // console.log(index);
      // children.splice(index, 1);

      const children_data = parent.data.children || parent.data;
      children_data.splice(index, 1);
      this.$emit("metadataSend");
    },

    rename(){
      this.operation = 4;
      this.new_text = this.current_data.text;
      this.new_order = this.current_data.order;
      this.rename_show = true;
    },

    filterNode(value, data) {
      //根据description order text筛选
      if (!value) return true;
      return (data.description.toLowerCase().search(value.toLowerCase()) !== -1)
        || (data.order.toLowerCase().search(value.toLowerCase()) !== -1)
        || (data.text.toLowerCase().search(value.toLowerCase()) !== -1);
    },

    snlQuery(){

      // let snl_query_words = this.filter_snl_key.split(" ");
      if(!this.filter_text){
        return;
      }
      let snl_query_words = this.filter_text.split(" ");
      //对用户输入切割而成的数组预处理（消除' '元素）
      let index =  snl_query_words.length;
      while(index--){
        if(snl_query_words[index] === ""){
          snl_query_words.splice(index, 1);
        }
      }
      console.log("对用户输入切割而成的数组预处理结果");
      console.log(snl_query_words);

      console.log("in snlQuery ")
      console.log(this.meta_data);
      //函数递归复杂度太高，还是用while循环迭代吧
      let node_array = this.meta_data.metadata.data;
      this.snl_query_result = [];//每次查询清空
      this.singleNodeQuery(snl_query_words, node_array);
      console.log("snl查询的结果是：");
      console.log(this.snl_query_result);
      this.$emit('showSNLQueryResult', this.snl_query_result, snl_query_words);
      // this.
    },

    singleNodeQuery(words, node_array){
      if(node_array.length === 0)
        return false;
      for(let node of node_array){
        if(node.is_rule){
          let hasSNL = false;
          let single_result = {
            rule_index:this.rule_index,
            order:node.order,
            text: node.text,
            snls: [],
          };
          this.rule_index += 1;
          for(let snl_spl of node.snl_spl_pairs){
            //必须遍历完所有的SNL语句
            for(let word of words){
              if(snl_spl.snl.indexOf(word) !== -1){
                //就说明输入词语在该条snl语句中存在
                hasSNL = true;
                single_result.snls.push(snl_spl.snl);
              }
            }
          }
          if(hasSNL){
            //只有存在满足的SNL之后才把他所在的规则信息push进去
            this.snl_query_result.push(single_result);
          }
          console.log(node);
        }
        else{
          this.singleNodeQuery(words, node.children);
        }
      }
      return false;
    },
    handleFilter(){
      if(this.select_method == "tree"){
        this.$refs.tree.filter(this.filter_text);
      }
      else if(this.select_method == "snl"){
        this.snlQuery();
      }
    }

  },
  watch:{
    meta_data(){
      //2 随时监听meta_data的变化，因为meta_data是在layout文件里给赋值的
      this.getData();
    },

    filter_text(val) {
      if(this.select_method == "tree"){
        this.$refs.tree.filter(val);
      }
      // else if(this.select_method == "snl"){
      //
      // }
    },

    select_method(val){
      if(val=="snl"){
        this.filter_text = "";
        this.$refs.tree.filter(this.filter_text);
      }
    },

  }
}
</script>

<style scoped>

  /*#filter-key{*/
    /*box-sizing: border-box;*/
    /*margin: 5% !important;*/
  /*}*/

  .el-input-group__append, .el-input-group__prepend {
    width: 60px !important;
  }

  .el-select .el-input__inner {
    cursor: pointer;
    width: 100px !important;
    padding-right: 35px;
  }
  .filer-input{
    width: 100%;
  }
  .snl-query-div{
    width: 100%;
    display: inline-flex;
    justify-content:space-around;
    margin-left: auto;
    margin-right: auto;
  }

span{
  padding-top: 10px;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}

#aside_container{
  height:100%;
}
.el-tree{
  /* background-color: #DCDFE6; */
  height: 100%;
  width: 100%;
}
.el-tree-node {
    height: 100%;
    white-space: nowrap;
    /* outline: 0; */
    /* background-color: #C0C4CC; */
}

#action_menu{
  position: absolute;
  left: 200px;
  width: 97px;
}

.el-tree-node__expand-icon {

  font-size: 28px !important;

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

.el-tree-node {
  white-space: nowrap;
  padding: 1% !important;
  outline: 0;
}
</style>
