<template>
  <div class="login">
    <div class="login_box">

      <div class="login_title">欢迎登录智慧高标系统</div>

      <div class="login_box_item">
        <span class="login_box_span">账号</span>：
        <Input v-model="userName" :maxlength="11" size="large" placeholder="" @on-focus="refreshEvent()" style="width: 3.2rem;" />
      </div>

      <div class="login_box_item">
        <span class="login_box_span">密码</span>：
        <Input v-model="password" size="large" placeholder="" type="password" @on-focus="refreshEvent()" style="width: 3.2rem;" />
      </div>

      <div class="login_box_item">
        <Checkbox v-model="isReadMe"></Checkbox>
        <span style="width: 2.0rem;">记住密码</span>
      </div>

      <p v-if="isLoginFail" class="login_fail">{{loginFail || '用户名密码不匹配'}}</p>

      <div class="login_box_item">
        <!-- <div class="login_select">
          <Select v-model="roleId" size="large" style="">
            <Option :value="1">业主</Option>
            <Option :value="2">监理</Option>
            <Option :value="3">施工方</Option>
          </Select>
        </div> -->
        <Button class="login_box_btn" size="large" @click="loginEvent">登录</Button>
      </div>
    </div>

    <comm-loading v-if="isLoading"></comm-loading>
  </div>
</template>

<script>

export default {
  props: {},

  components: {},

  data () {
    return {
      isLoading: false,
      isLoginFail: false,
      isReadMe: '',
      loginFail: '',
      userName: '',
      password: '',
      roleId: 1
    };
  },

  created () {
    if (localStorage.getItem('wisdom_userName') && localStorage.getItem('wisdom_password')) {
      this.userName = localStorage.getItem('wisdom_userName') || '';
      this.password = localStorage.getItem('wisdom_password') || '';
    }
  },

  methods: {
    refreshEvent () {
      this.isLoginFail = false;
      this.loginFail = '';
    },

    loginEvent () {
      if (!this.userName) {
        this.isLoginFail = true;
        this.loginFail = '用户名不能为空！';
        // this.$Message.error('用户名不能为空！');
        return false;
      }
      if (!this.password) {
        this.isLoginFail = true;
        this.loginFail = '密码不能为空！';
        // this.$Message.error('密码不能为空');
        return false;
      }
      let params = {
        mobile: this.userName,
        password: this.password
      };
      this.isLoading = true;
      
      localStorage.setItem('linkName', '');
      window.$axios.post('/api/user/login', params).then(res => {
        this.isLoading = false;
        if (res.success) {
          let obj = res.data;
          sessionStorage.setItem('userInfo', JSON.stringify(obj));
          if (this.isReadMe) {
            localStorage.setItem('wisdom_userName', this.userName);
            localStorage.setItem('wisdom_password', this.password);

          } else {
            localStorage.setItem('wisdom_userName', '');
            localStorage.setItem('wisdom_password', '');
          }
          this.$store.commit('setUserInfo', obj);
          this.$router.push({path: '/TenderManage'});
        } else {
          this.isLoginFail = true;
          this.loginFail = res.message;
          // this.$Message.error(res.message);
        }
      }).catch(error => {
        this.isLoading = false;
        this.isLoginFail = true;
        this.loginFail = error.message;
        // this.$Message.error(error.message);
      });
      
    }
  }
};
</script>

<style lang='scss'>
  @import './login.scss';
</style>