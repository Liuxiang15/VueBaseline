<template>
<el-cascader
  :options="options2"
>
</el-cascader>
</template>

<script>
  export default {
    name: 'cascader',
    data() {
      return {
        options2: [{
          label: '新建目录',
          value: "new_content"
        }, {
          label: '新建叶子节点',
          value: "new_leaf"
        },
        {
          label: '重命名',
          value: "rename"
        },
        {
        	label: "删除",
          value: "delete"
        }
        ],
      };
    },
    created(){
      console.log("enter cascader create");
    },

    methods: {
//       事件名称	说明	回调参数
// change	当绑定值变化时触发的事件	当前值
// active-item-change	当父级选项变化时触发的事件，仅在 change-on-select 为 false 时可用	各父级选项组成的数组
      // handleItemChange(val) {
      //   console.log('active item:', val);
      // },
      //
      // onChange(val){
      //   console.log("in onchange");
      //   console.log(val);
      // }
    }
  };
</script>

<style>
.el-cascader {

    width: 100%;
    /* border: 1px solid; */
    box-sizing: border-box;
}

</style>
