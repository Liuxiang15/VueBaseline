<template lang="html">
  <div class="container">
    <div class="content">
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">
      </el-tree>
    </div>
  </div>
</template>


<script>
export default {
  data () {
      return {
          tree: {},
          name: "",

          data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],

        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
  },
  created () {   /* 这个是vue的钩子函数，当new Vue()实例创建完毕后执行的函数 */
      this.$http.get('/api/mytree').then((data) => {   /* 调用vue的ajax来请求数据，promise语法，并用es6的箭头函数 */
      this.tree = data.body.datatree;
      this.name = data.body.name
      })
  },
  methods: {
      handleNodeClick(data) {
        //console.log('data');
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      }
  }
}
</script>


<style lang="css" scoped>
  .container {
    width: 100%;
    margin: 0 auto;
  }
  .content {
    margin-bottom: 1.8rem;
  }
  .cont-ul {
    padding-top: 0.5rem;
    background-color: #ccc;
  }
  .cont-ul::after {
    content: '';
    display: block;
    clear: both;
    width: 0;
    height: 0;
  }
</style>
