<template>
  <div id="app">
    <header-wrap v-if="$store.state.userInfo && $route.path !== '/login'"></header-wrap>
    <div class="app_box">
      <div class="app_menu" v-if="$store.state.userInfo && $route.path !== '/login'">
        
        <div class="app_menu_box" :class="isShowNav ? '' : 'app_menu_hide'">
          <menu-wrap></menu-wrap>
          <p style="width: .24rem;"></p>
        </div>

        <!-- <div>
          <Icon class="app_menu_icon" custom="i-icon" :type="isShowNav ? 'md-arrow-dropleft' : 'md-arrow-dropright'" size="24"
            @click="isShowNav = !isShowNav"/>
        </div> -->

      </div>

      <div class="app_view">
        <router-view></router-view>
      </div>
    </div>

    <!-- <div class="app_left" v-if="$store.state.userInfo && show">
      <menu-wrap></menu-wrap>
    </div>

    <div class="app_right">
      <header-wrap v-if="$store.state.userInfo && show"></header-wrap>
      <div class="app_view">
        <router-view></router-view>
      </div>
    </div> -->
  </div>
</template>

<script>
import HeaderWrap from '@/components/Header/index';
import MenuWrap from '@/components/Menu/index';

export default {
  components: { HeaderWrap, MenuWrap },

  data () {
    return {
      show: true,
      routeIndex: 1,
      isShowNav: true
    };
  },

  created() {
    // window.$axios.get({url: '/api/user/login'});
    // window.$axios.post('/api/user/login', {mobile: 15617755653, password: '123456'});
    // window.$axios.post('/api/user/getPages ', {});
    // console.log(sessionStorage.getItem('userInfo'));
    // if (sessionStorage.getItem('userInfo')) {
    //   console.log(JSON.parse(sessionStorage.getItem('userInfo')));
    //   this.$store.commit('setUserInfo', JSON.parse(sessionStorage.getItem('userInfo')));
    // }
    if (localStorage.getItem('wisdom_userName') && localStorage.getItem('wisdom_password')) {
      let params = {
        mobile: localStorage.getItem('wisdom_userName'),
        password: localStorage.getItem('wisdom_password')
      };
      window.$axios.post('/api/user/login', params).then(res => {
        if (res.success) {
          let obj = res.data;
          sessionStorage.setItem('userInfo', JSON.stringify(obj));
          localStorage.setItem('wisdom_userName', localStorage.getItem('wisdom_userName'));
          localStorage.setItem('wisdom_password', localStorage.getItem('wisdom_password'));
          this.$store.commit('setUserInfo', obj);
          // this.$router.push({path: '/TenderManage'});
          this.$router.push({path: localStorage.getItem('linkName') || '/TenderManage'});
        } else {
          this.$router.push({path: '/login'});
        }
      }).catch(() => {
        this.$router.push({path: '/login'});
        // this.$Message.error(error.message);
      });
    } else {
      this.$router.push({path: '/login'});
    }
  },

  methods: {
    skip (url, index) {
      this.routeIndex = index;
      this.$router.push(url);
    }
  }
};
</script>
<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #F0F0F0;
  overflow: auto;
  .app_box{
    display: flex;
    min-height: 1rem;
    flex: 1;
    .app_menu{
      position: relative;
      display: flex;
      align-items: center;
      // border-right: 1px solid #f1f1f1;
      box-shadow: 3px 3px 10px #eee;
      .app_menu_icon{
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto 0;
        height: .32rem;
      }
      .app_menu_box{
        display: flex;
        width: 1.4rem;
        flex: 1;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
      }
      .app_menu_hide{
        width: .2rem;
        overflow: hidden;
      }
    }
    .app_view{
      flex: 1;
      min-width: 5rem;
      padding: .06rem;
    }
  }
}
</style>
