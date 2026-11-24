<template>
  <div class="menu_box">
    <!-- <div class="menu_box_title">智慧高标</div> -->
    <!-- <div v-for="(item, index) in menuList" :key="index" class="menu_one_item btn" :class="{acitveMenu: currentIndexOne === index + 1}" @click="skipEvent(item, index + 1)"> -->
    <div v-for="(item, index) in menuList" :key="index" class="menu_one_item btn" :class="{acitveMenu: $store.state.currentRouterName === item.name}" @click="skipEvent(item, index + 1)">
      <p class="menu_box_p" :class="{menu_box_active: $store.state.currentRouterName === item.link}">
        <Icon v-if="item.icon" :class="$store.state.currentRouterName === item.link ? 'menu_box_acitve' : 'menu_box_icon'" :type="item.icon" size="20" />
        <img :src="$store.state.currentRouterName === item.link ? item.image2 : item.image1" alt="">
        <span class="menu_box_label">{{item.name}}</span>
      </p>
      
      
    </div>
  </div>
</template>

<script>
export default {
  props: {},

  components: {},

  data () {
    return {
      currentIndexOne: 1,
      menuList: [
        {name: '标段管理', link: '/TenderManage', icon: 'md-home'},
        {name: '进度统计', link: '/RateStatic', icon: 'md-refresh-circle'},
        {name: '定位总览', link: '/Location', icon: 'md-images'},
        {name: '通知单管理', link: '/NotifyManage', icon: 'md-volume-up'},
        {name: '报验预约', link: '/Check', icon: 'ios-videocam'},
        {name: '日进度', link: '/RateData', icon: 'md-list-box'},
        {name: '标段资料', link: '/TenderData', icon: 'md-list-box'},
        {name: '现场影音', link: '/SceneVideo', icon: 'ios-videocam'},
      ]
    };
  },

  created () {
    if (this.$store.state.userInfo.roleName === '监理') {
      this.menuList = [
        {name: '标段管理', link: '/TenderManage', image1: require('./../../../static/image/tender.png'), image2: require('./../../../static/image/tendera.png')},
        {name: '工程进度统计', link: '/RateStatic', image1: require('./../../../static/image/rateStatic.png'), image2: require('./../../../static/image/rateStatica.png')},
        {name: '监理通知单管理', link: '/NotifyManage', image1: require('./../../../static/image/notify.png'), image2: require('./../../../static/image/notifya.png')},
        {name: '定位总览', link: '/Location', image1: require('./../../../static/image/local.png'), image2: require('./../../../static/image/locala.png')},
        {name: '标段资料管理', link: '/TenderDataManage', image1: require('./../../../static/image/tenderData.png'), image2: require('./../../../static/image/tenderData1.png')},
        {name: '报验预约', link: '/Check', image1: require('./../../../static/image/check.png'), image2: require('./../../../static/image/checka.png')},
        {name: '日进度', link: '/RateData', image1: require('./../../../static/image/dayRate.png'), image2: require('./../../../static/image/dayRatea.png')},
        // {name: '标段资料', link: '/TenderData', icon: 'md-list-box'},
        {name: '现场影音', link: '/SceneVideo', image1: require('./../../../static/image/scance.png'), image2: require('./../../../static/image/scancea.png')},
      ];
    } else if (this.$store.state.userInfo.roleName === '施工单位') {
      this.menuList = [
        {name: '清单及统计', link: '/TenderManage', image1: require('./../../../static/image/tender.png'), image2: require('./../../../static/image/tendera.png')},
        {name: '施工工程进度统计', link: '/RateStatic', image1: require('./../../../static/image/rateStatic.png'), image2: require('./../../../static/image/rateStatica.png')},
        {name: '施工日进度', link: '/RateData', image1: require('./../../../static/image/dayRate.png'), image2: require('./../../../static/image/dayRatea.png')},
        {name: '标段资料管理', link: '/TenderDataManage', image1: require('./../../../static/image/tenderData.png'), image2: require('./../../../static/image/tenderData1.png')},
        {name: '监理通知单管理', link: '/NotifyManage', image1: require('./../../../static/image/notify.png'), image2: require('./../../../static/image/notifya.png')},
        {name: '施工报验预约', link: '/Check', image1: require('./../../../static/image/check.png'), image2: require('./../../../static/image/checka.png')},
        {name: '现场影音', link: '/SceneVideo', image1: require('./../../../static/image/scance.png'), image2: require('./../../../static/image/scancea.png')},
      ];
    } else {
      this.menuList = [
        {name: '标段管理', link: '/TenderManage', image1: require('./../../../static/image/tender.png'), image2: require('./../../../static/image/tendera.png')},
        {name: '工程进度统计', link: '/RateStatic', image1: require('./../../../static/image/rateStatic.png'), image2: require('./../../../static/image/rateStatica.png')},
        {name: '日进度', link: '/RateData', image1: require('./../../../static/image/dayRate.png'), image2: require('./../../../static/image/dayRatea.png')},
        {name: '标段资料管理', link: '/TenderDataManage', image1: require('./../../../static/image/tenderData.png'), image2: require('./../../../static/image/tenderData1.png')},
        {name: '通知单管理', link: '/NotifyManage', image1: require('./../../../static/image/notify.png'), image2: require('./../../../static/image/notifya.png')},
        {name: '定位总览', link: '/Location', image1: require('./../../../static/image/local.png'), image2: require('./../../../static/image/locala.png')},
        {name: '现场影音', link: '/SceneVideo', image1: require('./../../../static/image/scance.png'), image2: require('./../../../static/image/scancea.png')},
      ];
    }
  },

  // mounted () {
  //   const _this = this;
  //   var first = null;
  //   this.$mui.plusReady( () =>{
  //     var backcount = 0;
  //     _this.$mui.back = ()=> {
  //       // let path = this.$route.path;
        
  //       // if (path.indexOf('/login')) {
  //       //   if (window.plus) plus.runtime.quit();
  //       //   return;
  //       // } else if (_this.menuList.includes(path)) {
  //       //   // 主导航页
  //       //   if ( _this.$mui.os.ios) return;
  //       //   if (backcount > 0) {
  //       //     if (window.plus) plus.runtime.quit();
  //       //     return;
  //       //   }
  //       //   _this.$Message.info('再点击一次退出应用!');
  //       //   backcount++;
  //       //   setTimeout( () =>{
  //       //     backcount = 0;
  //       //   }, 2000);
  //       // } else {
  //       //   // 子页面
  //       //   alert('子页面后退键');
  //       //   _this.$router.go(-1);
  //       // }

  //       let path = _this.$route.path;
  //       if (path === '/' || path.indexOf('/login')) {
  //         plus.runtime.quit();
  //         return false;
  //       }
  //       if (!first) {
  //         first = new Date().getTime();
  //         // _this.$Message.info('再按一次退出应用');
  //         _this.$router.go(-1);
  //         setTimeout(function() {
  //           //1s中后清除
  //           first = null;
  //         }, 1000);
  //       } else {
  //         if (new Date().getTime() - first < 1500) {
  //           plus.runtime.quit();
  //         }
  //       }
  //     };
  //   });
  // },

  methods: {
    skipEvent (item, index) {
      this.currentIndexOne = index;
      this.$store.commit('setRouterName', item.name);
      this.$router.push({path: item.link});
    }
  }
};
</script>

<style lang='scss'>
  @import './index.less';
</style>