<template>
    <el-dialog title="弹出对话框" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="新的SNL语句" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Label等其他属性" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
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
    name:"editDialogue",
    props:{
      show: Boolean,
      default: false
    },

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
        formLabelWidth: '120px'
      };
    },
    watch:{
      show(val){
        this.dialogFormVisible = val;
      }
    },
    methods:{
      //2 调用父组件的close函数使的对话框消失
      close() {
        //this.dialogFormVisible = false;
        this.$emit('close');
      },

      save() {
        //this.dialogFormVisible = false
        this.$emit('save');
      }
    }
  };
</script>
