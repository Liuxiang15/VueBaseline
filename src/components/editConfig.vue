<template>
  <el-table
    :data="table_data"
    style="width: 100%">
    <el-table-column
      label="key"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.key }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="value"
      width="180">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>value: {{ scope.row.value }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.value }}</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>

    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    data() {
      return {
        table_data: []
      }
    },
    created(){
      console.log("in editConfig ");
      console.log(this.$route.params.config_list);
      var temp_table_data = [];

      var config_list = this.$route.params.config_list;
      for(var item of config_list){
        var dict = {}
        var str_value = "";
        dict.key = item.key;
        for(var val of item.value){
          str_value += val;
          str_value += "#";
          //#号区分多个value值
        }
        dict.value = str_value;
        temp_table_data.push(dict);
      }
      this.table_data = temp_table_data;

    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      }
    }
  }
</script>
