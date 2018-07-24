<template>
  <!-- 屏蔽页面右键默认显示的工具菜单
  为元素绑定一个 oncontextmenu 事件 -->
  <!-- <div oncontextmenu="self.event.returnValue=false"> -->
  <div id="aside_container">
    <el-tree
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
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>{{ node.data.text }} </span>
      </span>
    </el-tree>
    <!-- <new-content :default_data="hello"
    :show="new_content_show"
    @save="save" @close="close" >
    </new-content> -->
    <el-dialog title="新建目录" :visible.sync="new_content_show">
      <el-form>
        <el-form-item label="text">
          <el-input v-model="new_text" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="description">
          <el-input v-model="new_description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="order">
          <el-input v-model="new_order" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" icon="el-icon-close" @click="close">关闭</el-button>
        <el-button type="success" icon="el-icon-check" @click="save">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新建规则" :visible.sync="new_rule_show">
      <el-form>
        <el-form-item label="text">
          <el-input v-model="new_text" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="description">
          <el-input v-model="new_description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="order">
          <el-input v-model="new_order" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="SNL语句">
          <el-input v-model="new_snl" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" icon="el-icon-close" @click="close">关闭</el-button>
        <el-button type="success" icon="el-icon-check" @click="save">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="重命名" :visible.sync="rename_show">
      <el-form>
        <el-form-item label="new name">
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
        group: "",
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
        current_node:{}
        //注释    opera `1234分别为新建目录， 新建叶子节点， 删除该节点， 重命名`

      }
  },
  created () {
    console.log("enter leftTree的create函数");
    console.log("in leftTree this.meta_data = ");
    console.log(this.meta_data);
    if(this.meta_data.data == undefined){
      console.log("传入的meta_data为空");
      //this.menu_show = true;
    }
    this.data = this.meta_data.metadata.data;
    this.group = this.meta_data.metadata.tags;
},
  methods: {
      handleNodeClick(node_data, node) {
        // 参数:传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node
        this.$emit("listenToNodeClick", node.data);
        // console.log("被点击的node是");
        // console.log(node.data);
        // console.log("被点击的nodedata是");
        // console.log(node_data);
        // console.log("被点击的node是");
        // console.log(node);
      },
      handleRightClick(e, nodedata, node, self){
        // console.log("进入handleRightClick函数");
        // alert("弹出新增目录或者节点对话框");og(0)
        // console.log("event是");
        // console.log(e);
        // console.log("nodedata是");
        // console.log(nodedata);
        // console.log("node是");
        // console.log(node);
        // console.log(self);
        this.menu_show = true;
        // this.new_content_show = true;
        /*1捕获鼠标右键*/
        e.preventDefault();
        var x = e.clientX;
        var y = e.clientY;
        this.current_data = nodedata;
        this.current_node = node;
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
          new_item.description = this.new_description;
          new_item.is_rule = false;
          new_item.order = this.new_order;
          new_item.snl_spl_pairs = [];
          new_item.tags = [];
          new_item.text = this.new_text;
          console.log("this.current_data是：");
          console.log(this.current_data);
          this.current_data.children.push(new_item);
        }
        else if(this.operation == 2){
          //这里要注意的是SNL语句可能输入多条，这牵扯到怎么设计对话框的额结构
          //我们先假设用户只输入一条SNL语句
          //或者我们在解析用户的多条SNL语句再操作
          this.new_rule_show = false;
          const new_item = {};
          new_item.children = [];
          new_item.description = this.new_description;
          new_item.is_rule = true;
          new_item.order = this.new_order;
          new_item.snl_spl_pairs = [];
          new_item.snl_spl_pairs.push(
            {
              snl: this.new_snl,
              spl: []
            }
          );
          new_item.tags = [];
          new_item.text = this.new_text;
          console.log("this.current_data是：");
          console.log(this.current_data);
          this.current_data.children.push(new_item);
        }
        else if(this.operation == 4){
          this.rename_show = false;
          this.current_data.text = this.new_text;
        }

        this.menu_show = false;

        //输入框的值保持为原始
        this.new_text = "";
        this.new_description = "";
        this.new_order = "";
        this.new_snl = "";
      },
      getData(){
        this.data = this.meta_data.metadata.data;
        this.group = this.meta_data.metadata.tags;
      },
      handleDragStart(node, ev) {
        console.log('drag start', node);
      },
      handleDragEnter(draggingNode, dropNode, ev) {
        console.log('tree drag enter: ', dropNode.label);
      },
      // handleDragLeave(draggingNode, dropNode, ev) {
      //   console.log('tree drag leave: ', dropNode.label);
      // },
      // handleDragOver(draggingNode, dropNode, ev) {
      //   console.log('tree drag over: ', dropNode.label);
      // },
      handleDragEnd(draggingNode, dropNode, dropType, ev) {
        console.log('tree drag end: ', dropNode && dropNode.label, dropType);
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        console.log('tree drop: ', dropNode.label, dropType);
      },
      allowDrop(draggingNode, dropNode, type) {
        // if (dropNode.data.label === '二级 3-1') {
        //   return type !== 'inner';
        // } else {
        //   return true;
        // }
      },
      allowDrag(draggingNode) {
        // return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
      },
      newContent(node_data){
        //先传参进入newContent函数,之后可能通过data里的值传进来
        //新建元素的order属性需要判断node_data的children的order

        this.operation = 1;
        this.new_content_show = true;
      },
      newRule(node_data, des, text){
        //新建叶子节点不同之处在于要
        this.operation = 2;
        this.new_rule_show = true;
      },
      deleleNode(){
        //删除该节点，修改双亲节点,注意参数是node
        this.operation = 3;
        const parent = this.current_node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === this.current_data.id);
        children.splice(index, 1);
        this.menu_show = false;
      },
      rename(){
        this.operation = 4;
        this.rename_show = true;
      },
  },
  watch:{
    meta_data(){
      //2 随时监听meta_data的变化，因为meta_data是在layout文件里给赋值的
      this.getData();
    }
  }
}
</script>

<style>
#aside_container{
  height:100%;
}
.el-tree{
  background-color: #DCDFE6;
  height: 100%;
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
</style>
