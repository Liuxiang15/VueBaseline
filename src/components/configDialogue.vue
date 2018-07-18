<template>
<el-dialog title="弹出对话框" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="key" :label-width="formLabelWidth">
      <el-input id="key" v-model="form.name"
      v-bind:placeholder = "get_key()"
      auto-complete="off">

      </el-input>
    </el-form-item>
  </el-form>

    <div v-for = "val in this.default_data.value">
      <!-- <el-tag size="medium">{{ scope.row.value }}</el-tag> -->
      <!-- <el-tag size="medium" v-for = "val in scope.row.value ">
          {{val}}
      </el-tag> -->
    <el-form>
      <el-form-item label="value" :label-width="formLabelWidth">
        <el-input type="textarea" id="value"
        :placeholder = "val"
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
    name:"editDialogue",
    // props:{
    //   show: Boolean,
    //   default: false,
    //   default_data: {}
    // },
    props:[
      "show", "default_data"
    ],

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
        place:"请输入key值"
      };
    },
    created(){
      console.log("in configDialogue.vue");
      //document.getElementById("key").placeholder = this.default_data.key;
       //$("#key").attr('placeholder',this.default_data.key);

      console.log(this.default_data);
      this.place = this.default_data.key;
        // document.getElement
    },
    watch:{
      show(val){
        // console.log(this.default_data);
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
      },

      get_key(){
        return this.default_data.key;
      },

      get_value(){
        var str_value = "";
        for(var val of this.default_data.value){
          str_value += val;
          str_value += "<br/>";
        }
        return str_value;
      }
    }
  };
</script>
