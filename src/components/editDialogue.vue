<template>
    <el-dialog title="弹出对话框" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="SNL" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="default_data.snl" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>


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
    name:"editDialogue",
    props:[
      "show", "default_data",
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
          desc: '',
          key_words:[
            {
              structure:[
                "如果","if",
                "那么","then",
                "不存在","存在一个","所有",
                "不","只"
              ]
            },
            {
              operation:[
                "contains","notcontains",
                "equals","notequals"
              ]
            },
            {
              num_compare:[
                "=",">=",">","<=","<"
              ]
            },
            {
              regex:["regex"]
            },
            {
              property_name:["~", ",", "@", "-"]
            },
            {
              logic_connect:["且","并且","或","或者"]
            },
            {
              relation_compare:["多于","少于","至多","至少"]
            },
            {
              four_operations:["+","-","*","/"]
            },
            {
              quote:["'", "，", '"', '“','”']
            },
            {
              other:["的", ".", "。"]
            }
          ]
        },
        formLabelWidth: '120px'
      };
    },
    created(){

    },
    watch:{
      show(val){
        this.dialogFormVisible = val;
      },
      default_data(){
        console.log(this.default_data);
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
        this.$emit('save', this.default_data);
      }
    }
  };
</script>
