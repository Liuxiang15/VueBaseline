<template>
  <div id="app">
    <demo-header></demo-header>
    <router-view/>
  </div>
</template>

<script>
import DemoHeader from './components/demoHeader'
export default {
  name: 'App',
  components:{
    DemoHeader
  }
}
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
} */
</style>
