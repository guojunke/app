<template>
  <comm-dialog title="新增日进度" :styleData="{width: '480px'}" @closeDialog="$emit('closeDialog')">
    <div slot="container" class="addRate">

      <div class="addRate_item">
        <div class="addRate_label">项目区：</div>
        <Select class="addRate_value" v-model="form.proId" :disabled="isRoleOnly">
          <Option v-for="(item, index) in projectList" :value="parseInt(item.id)" :key="index">{{ item.projectName }}</Option>
        </Select>
      </div>

      <div class="addRate_item">
        <div class="addRate_label">标段：</div>
        <Select class="addRate_value" v-model="form.tendersId" :disabled="isRoleOnly">
          <Option v-for="(item, index) in tenderList" :value="item.id" :key="index">{{ item.tenderName || '--' }}</Option>
        </Select>
      </div>

      <div class="addRate_item">
        <div class="addRate_label">报告内容：</div>
        <div class="addRate_value">
          <Input v-model="reason" type="textarea"/>
        </div>
      </div>

      <div class="addRate_item">
        <Button style="margin: 0 .3rem;" @click="$emit('closeDialog')">取消</Button>
        <Button type="primary" @click="updateSataus()" style="margin: 0 .3rem;">确定</Button>
      </div>
    </div>
  </comm-dialog>
</template>

<script>
export default {

  data () {
    return {
      reason: '',
      isRoleOnly: false,
      form: {
        proId: '',
        tendersId: '',
        content: ''
      },
      projectList: [],
      tenderList: []
    };
  },

  created () {
    if (this.$store.state.userInfo.roleName === '施工单位') {
      this.form.proId = this.$store.state.userInfo.projectId;
      this.form.tendersId = this.$store.state.userInfo.tenderId;
      this.isRoleOnly = true;
    }
    this.getTenderList();
    this.getProjectList();
  },

  methods: {// 获取所有的标段
    getTenderList () {
      let params = {
        proId: this.form.proId
      };
      window.$axios.get({url:'/tender/getTendersList', params}).then(res => {
        if (res.data) {
          this.tenderList = res.data || [];
        }
      }).catch(error => {
        this.$Message.error(error.message);
      });
    },

    // 获取所有项目区
    getProjectList () {
      window.$axios.get({url: '/project/getProjectList'}).then(res => {
        if (res.data) {
          this.projectList = res.data || [];
        } else {
          this.projectList = [];
        }
      }).catch(error => {
        this.$Message.error(error.message);
      });
    },
    updateSataus () {
      if (!this.reason) {
        this.$Message.error('报告内容不能为空！');
        return false;
      }
      const params = {
        // id: this.addRate.id,
        proId: this.form.proId,
        tendersId: this.form.tendersId,
        // status: 'refuse',
        content: this.reason
      };
      this.isLoading = true;
      window.$axios.post('/dailypaper/add', params).then(res => {
        this.isLoading = false;
        if (res.success) {
          this.$Message.info('更新成功！');
          this.$emit('successUpdate');
          this.$emit('closeDialog');
        }
      }).catch(() => {
        this.isLoading = false;
      });
    }
  }
};
</script>

<style lang='scss'>
  @import './index.scss';
</style>