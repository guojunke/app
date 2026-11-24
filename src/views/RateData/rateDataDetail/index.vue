<template>
  <comm-dialog :title="rateInfo.projectName + ' -- ' + rateInfo.tenderName" :styleData="{width: '480px'}" @closeDialog="$emit('closeDialog')">
    <div slot="container" class="rateDataDetail">

      <div class="rateDataDetail_item">
        <div class="rateDataDetail_label">驳回理由：</div>
        <div class="tenderDatail_value">
          <Input v-model="reason" type="textarea" />
        </div>
      </div>

      <div class="rateDataDetail_item">
        <Button style="margin: 0 50px;" @click="$emit('closeDialog')">取消</Button>
        <Button type="primary" @click="updateSataus()" style="margin: 0 50px;">确定</Button>
      </div>
    </div>
  </comm-dialog>
</template>

<script>
export default {
  props: {
    rateInfo: {
      default: () => {}
    }
  },

  data () {
    return {
      reason: ''
    };
  },

  created () {},

  methods: {
    updateSataus () {
      if (!this.reason) {
        this.$Message.error('驳回理由不能为空！');
        return false;
      }
      const params = {
        id: this.rateInfo.id,
        proId: this.rateInfo.proId,
        tendersId: this.rateInfo.tendersId,
        status: 'refuse',
        reason: this.reason
      };
      this.isLoading = true;
      window.$axios.post('/dailypaper/updateStatus', params).then(res => {
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