<template>
  <comm-dialog :title="checkInfo.projectName + '--' + checkInfo.tenderName" :styleData="{width: '480px'}" @closeDialog="$emit('closeDialog')">
    <div slot="container" class="checkReject">

      <div class="checkReject_item" style="padding: .3rem 0 .3rem;">
        <div class="checkReject_label">驳回理由：</div>
        <div class="checkReject_value">
          <Input v-model="reason" type="textarea" />
        </div>
      </div>

      <div class="checkReject_item">
        <Button style="margin: 0 50px;" @click="$emit('closeDialog')">取消</Button>
        <Button type="primary" @click="updateSataus" style="margin: 0 50px;">确定</Button>
      </div>
    </div>
  </comm-dialog>
</template>

<script>
export default {
  props: {
    checkInfo: {
      default: () => {}
    }
  },

  data () {
    return {
      resultDate: ''
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
        ...this.checkInfo,
        status: 'refuse',
        reason: this.reason
      };
      let formData = new FormData();
      Object.keys(params).forEach(key => {
        formData.append(key, params[key]);
      });
      this.isLoading = true;
      window.$axios.post('/projectType/update', formData).then(res => {
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