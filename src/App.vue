<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import DemoHeader from './components/demoHeader'
export default {
  name: 'App',
  components: {
    DemoHeader
  },
  created() {
    localStorage.name = ''
    localStorage.statue = 'logout'
    localStorage.id = ''
    localStorage.token = ''
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
