<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">云端规则库管理系统登陆</h3>
      </div>

      <el-form-item prop="username">
        <!-- <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span> -->
        <el-input
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          auto-complete="on"
        />
      </el-form-item>

      <!-- <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="passwordType"
          v-model="loginForm.password"
          placeholder="password"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye"/>
        </span>
      </el-form-item> -->

      <el-button
      :loading="loading"
      type="primary"
      style="width:100%;margin-bottom:30px;"
      @click.native.prevent="handleLogin">
      login
      </el-button>

    </el-form>

  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        // password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        // password: [{ required: true, trigger: 'blur' }]
      },
      passwordType: 'password',
      loading: false,
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    // showPwd() {
    //   if (this.passwordType === 'password') {
    //     this.passwordType = ''
    //   } else {
    //     this.passwordType = 'password'
    //   }
    // },
    handleLogin() {
      // this.$refs.loginForm.validate(valid => {
      //   if (valid) {
      //     this.loading = true

      this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
        // console.log('333333')
        console.log(this.$store.state.user.name)
        this.loading = false
        this.$router.push({ path: '/index' })
      }).catch(err => {
        this.loading = false
      })
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
      // DO SOMETHING
    }
  }
}
</script>

<style>

</style>
