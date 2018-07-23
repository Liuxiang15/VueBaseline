<!-- <template>
    <el-dialog title="newContent" :visible.sync="true">
      <el-form >
        <el-form-item label="text" >
          <el-input  v-model="text" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form >
        <el-form-item label="description" >
          <el-input  v-model="description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="close">关闭</el-button>
        <el-button  @click="save"> 确定</el-button>
      </div>
    </el-dialog>
</template>

<script>
  export default {
    // 1 dialogFormVisible决定了对话框是否显现，初始值在本组件里定义
    // 在layout.vue里实现了对该属性修改的函数
    name:"newContent",
    // props:[
    //   "default_data",
    // ],

    data() {
      return {

      };
    },
    created(){

    },
    watch:{

    },
    methods:{

    }
  };
</script>
<style scoped>
.el-dialog__wrapper{
  /* z-index: 1; */
  display: inline !important;
}
</style> -->

<template>
<el-dialog title="新建目录" >

  <el-form :model="form">
    <el-form-item label="key" >
      <el-input id="key"
      auto-complete="off">
      </el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" icon="el-icon-edit" >新建</el-button>
    <el-button type="danger" icon="el-icon-close" >关闭</el-button>
    <el-button type="success" icon="el-icon-check">确定</el-button>
  </div>
</el-dialog>
</template>

<script>
  export default {
    // 1 dialogFormVisible决定了对话框是否显现，初始值在本组件里定义
    // 在layout.vue里实现了对该属性修改的函数
    name:"newContent",
    // props:{
    //   show: Boolean,
    //   default: false,
    //   default_data: {}
    // },

    data() {
      return {
        dialogTableVisible: this.show,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px',
      };
    },
    created(){
      console.log("in configDialogue.vue");

        // document.getElement
    },

    methods:{
      //2 调用父组件的close函数使的对话框消失



    }
  };
</script>

<style>
.el-textarea__inner {
  display: inline;
  width: 60%;
}
</style>
