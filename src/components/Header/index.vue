<template>
  <div class="header">
    <div class="header_box_title">智慧高标</div>

    <div class="header_box">
      <!-- <a href="http://121.89.213.83:9001/notice/downloadFile?fileName=head1600155063465.jpg&tendersId=26" target="_blank" style="padding-right: .3rem; color: #fff;">跳转测试</a> -->
      <!-- <Icon v-if="$store.state.userInfo.roleName === '监理' || $store.state.userInfo.roleName === '施工单位'" :class="{'header_blue': checkNum}" type="ios-mail-outline" @click="skipCheck" style="font-size: .24rem;"/> -->
      <span v-if="$store.state.userInfo.roleName === '监理' || $store.state.userInfo.roleName === '施工单位'" :class="{'header_blue': checkNum}" type="ios-mail-outline" @click="skipNotify">通知单 (</span>
      <span v-if="$store.state.userInfo.roleName === '监理' || $store.state.userInfo.roleName === '施工单位'" :class="{'header_blue': checkNum}" @click="skipNotify" style="padding: 0 .05rem 0 .05rem;color: #ff0;font-weight: bolder;">{{notifyTotal}}</span>
      <span v-if="$store.state.userInfo.roleName === '监理' || $store.state.userInfo.roleName === '施工单位'" :class="{'header_blue': checkNum}" type="ios-mail-outline" style="padding-left: 0.05rem;" @click="skipCheck">) 报验 ( </span>
      <span v-if="$store.state.userInfo.roleName === '监理' || $store.state.userInfo.roleName === '施工单位'" :class="{'header_blue': checkNum}" @click="skipCheck" style="padding: 0 .05rem 0 .05rem;color: #ff0;font-weight: bolder;">{{checkNum}} )</span>
      <span class="btn" @click="exitEvent">退出</span>
    </div>

    <notify-list v-if="isShowNotify" :notifyList="notifyList" @closeDialog="isShowNotify = false" @successBack="getList"></notify-list>
    <check-list v-if="isShowCheck" :checkList="checkList" @closeDialog="isShowCheck = false" @successBack="getList"></check-list>
  </div>
</template>

<script>
import NotifyList from './notifyList';
import CheckList from './checkList';
export default {
  props: {},

  components: { NotifyList, CheckList },

  data () {
    return {
      checkNum: 0,
      notifyTotal: 0,
      isShowNotify: false,
      notifyList: [],
      isShowCheck: false,
      checkList: []
    };
  },

  created () {
    if (this.$store.state.userInfo.roleName === '监理' || this.$store.state.userInfo.roleName === '施工单位') {
      this.getList();
      // this.getNoticeList();
    }
    
  },

  mounted () {
    if (this.$store.state.userInfo.roleName === '监理' || this.$store.state.userInfo.roleName === '施工单位') {
      setInterval(() => {
        this.getList();
      }, 5 * 60000);
    }
    
  },

  methods: {
    exitEvent () {
      this.$store.commit('clearUserInfo');
      localStorage.setItem('wisdom_userName', '');
      localStorage.setItem('wisdom_password', '');
      this.$router.push({path: '/login'});
    },
    skipCheck () {
      this.isShowCheck = true;
      // this.$router.push({path: '/Check'});
    },
    getList () {
      console.log(this.$store.state.userInfo);
      let params = {
        proId: this.$store.state.userInfo.projectId,
        tendersId: this.$store.state.userInfo.tenderId,
        proTypeId: this.$store.state.userInfo.proTypeId,
        roleId: this.$store.state.userInfo.roleId,
        pageNum: 1,
        pageSize: 10,
        date: ''
      };
      this.isLoading = true;

      window.$axios.get({url: '/appointment/getAppointmentCount', params}).then(res => {
        this.isLoading = false;
        if (res.data) {
          this.checkNum = res.data.appointCount || 0;
          this.checkList = res.data.appointmenVoList || [];
          this.notifyTotal = res.data.noticeCount || 0;
          this.notifyList = res.data.noticeVoList || [];
        }
      }).catch(error => {
        this.isLoading = false;
        this.$Message.error(error.message);
      });
    },

    getNoticeList () {
      let params = {
        proId: this.$store.state.userInfo.projectId,
        tendersId: this.$store.state.userInfo.tenderId,
        type: '',
        pageNum: 1,
        pageSize: 10
      };
      this.isLoading = true;
      window.$axios.get({url: '/notice/listNotice', params}).then(res => {
        this.isLoading = false;
        if (res.data) {
          this.notifyTotal = res.data.total;
        }
      }).catch(error => {
        this.isLoading = false;
        this.$Message.error(error.message);
      });
    },

    skipNotify () {
      this.isShowNotify = true;
      // this.$router.push({path: '/NotifyManage'});
    }
  }
};
</script>

<style lang='scss' scoped>
  // @import url('./index.scss');
  @import './index.scss';
</style>