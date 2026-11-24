<template>
  <comm-dialog :title="checkInfo.projectName + '--' + checkInfo.tenderName" :styleData="{width: '480px'}" @closeDialog="$emit('closeDialog')">
    <div slot="container" class="rateDataDetail">

      <div class="rateDataDetail_item rateDataDetail_item_center" style="padding: .3rem 0 .3rem;">
        <div class="rateDataDetail_label">到场时间：</div>
        <div class="tenderDatail_value">
          <DatePicker v-model="resultDate" type="date" placeholder="请选择" :editable="false"
            style="width: 2rem"></DatePicker>
        </div>
      </div>

      <div class="rateDataDetail_item">
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
      if (!this.resultDate) {
        this.$Message.error('到场时间不能为空！');
        return false;
      }
      const params = {
        id: this.checkInfo.id,
        proId: this.checkInfo.proId,
        tendersId: this.checkInfo.tendersId,
        result: 'confirm',
        resultTime: this.$formatDate(this.resultDate, 'yyyy-MM-dd HH-mm-ss') || ''
      };
      this.isLoading = true;
      window.$axios.post('/appointment/update', params).then(res => {
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