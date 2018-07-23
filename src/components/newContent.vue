<template>
    <el-dialog title="新建目录" >
      <el-form>
        <el-form-item label="text"
        :visible.sync="dialogFormVisible">
          <el-input auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

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
    name:"newContent",
    props:[
      "show", "default_data",
    ],

    data() {
      return {
        // dialogFormVisible: this.show,
        dialogFormVisible: true,
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
      };
    },
    created(){
      console.log('in newContent');
      console.log(this.default_data);
      console.log(this.show);
    },
    methods:{
      //2 调用父组件的close函数使的对话框消失
      close() {
        this.$emit('close');

      },

      save() {
        this.$emit('save', this.default_data);

      }
    },
    watch:{
      show(val){
        this.dialogFormVisible = val;
        console.log("in newContent watch");
        console.log(this.dialogFormVisible);
        console.log(this.show);
      }
    }
  };
</script>

<style scoped>
.el-dialog{
  display: inline !important;
  z-index: 100;
  width: 200px;
  height: 300px;
}

.el-textarea__inner {
  display: inline;
  width: 60%;
}
</style>
