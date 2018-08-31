<template>
  <el-card>
    <chart style="width: 100%" auto-resize :options="graphOptions"></chart>
  </el-card>
</template>

<script>
import {getVisDataById} from '../api/rulelib'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/chart/graph'

export default {
  name: 'RelationGraph',
  components: {
    chart: ECharts
  },
  data() {
    return {
      graph : {},
      graphOptions: {
        title:{
          text: 'Abstract',
          subtext: 'Circular layout',
          top: 'bottom',
          left: 'right',
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            name: 'Abstract',
            type: 'graph',
            layout: 'circular',
            circular: {
              rotateLabel: true
            },
            // data: [],
            // links: [],
            // data: []
            data: [
              {id: "asd", name: "asdasd", category: 0, symbolSize:10, x:0,y:0},
              {id: "你啊", name: "asddddd", category: 0, symbolSize:10,x:1, y:1}],
            links: [{id:"0", name:"test", source:"asd", target:"你啊", lineStyle:{normal:{}}}],
            categories: [{name: 'Obj'}, {name: 'Prop'}],
            roam: true,
            label: {
              normal: {
                position: 'right',
                formatter: '{b}'
              }
            },
            lineStyle: {
              normal: {
                color: 'source',
                curveness: 0.3
              }
            }
          }
        ]
      }
    }
  },
  created() {
    getVisDataById({"asd":"asd"}).then(
      response => {
        // console.log(response)
        this.graph = response.data.res
        console.log('in vis graph')
        console.log(this.graph)
        console.log("trying~~~~~~~~~~~~~~~~~~~")

        // this.graphOptions.data = this.graph.nodes
        // this.graphOptions.links = this.graph.links
        this.graphOptions.series[0].data = [
          {id: "asd", name: "asd", category: 0, symbolSize:10, x:0,y:0},
          {id: "你好", name: "asd", category: 0, symbolSize:10,x:1, y:1},
          {id: "xixi", name: "asasdasd", category: 0, symbolSize:10,x:2, y:2}]
        this.graphOptions.series[0].links = [{id:"0", name:"test", source:"asd", target:"你好", lineStyle:{normal:{}}}]
        // console.log(this.graphOptions.data)
      }
    )
  },
  methods: {

  }



}
</script>

<style scoped>

</style>
