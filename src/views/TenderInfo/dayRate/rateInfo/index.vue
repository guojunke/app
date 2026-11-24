<template>
  <comm-dialog :title="title" :styleData="{width: '480px'}" @closeDialog="$emit('closeDialog')">
    <div slot="container" class="rateInfo">
      <div class="rateInfo_item rateInfo_item_center">
        <div class="rateInfo_label">项目区：</div>
        <div class="tenderDatail_value">
          <Input v-model="rateInfo.projectName" readonly />
        </div>
      </div>

      <div class="rateInfo_item rateInfo_item_center">
        <div class="rateInfo_label">标段：</div>
        <div class="tenderDatail_value">
          <Input v-model="rateInfo.tenderName" readonly />
        </div>
      </div>

      <div class="rateInfo_item">
        <div class="rateInfo_label">描述：</div>
        <div class="tenderDatail_value">
          <Input v-model="rateInfo.content" type="textarea" readonly />
        </div>
      </div>

      <div class="rateInfo_item">
        <Button style="margin: 0 50px;" @click="$emit('closeDialog')">取消</Button>
        <Button type="primary" @click="$emit('closeDialog')" style="margin: 0 50px;">确定</Button>
      </div>
    </div>
  </comm-dialog>
</template>

<script>
import CommDialog from '@/components/commDialog/index';
export default {
  props: {
    rateInfo: {
      default: () => {}
    },
    title: String
  },

  components: {CommDialog},

  data () {
    return {

    };
  },

  created () {
    console.log(this.rateInfo);
  },

  methods: {}
};
</script>

<style lang='scss'>
  @import './index.scss';
</style>