<template>
  <comm-dialog :title="title" :styleData="{width: '480px'}" @closeDialog="$emit('closeDialog')">
    <div slot="container" class="notifyDetai">
      <div class="notifyDetai_item notifyDetai_item_center">
        <div class="notifyDetai_label">项目区：</div>
        <div class="notifyDetai_value">
          <Input v-model="notifyInfo.projectName" readonly />
        </div>
      </div>

      <div class="notifyDetai_item notifyDetai_item_center">
        <div class="notifyDetai_label">标段：</div>
        <div class="notifyDetai_value">
          <Input v-model="notifyInfo.tenderName" readonly />
        </div>
      </div>

      <div class="notifyDetai_item notifyDetai_item_center">
        <div class="notifyDetai_label">类型：</div>
        <div class="notifyDetai_value">
          <Input v-model="notifyInfo.type" readonly />
        </div>
      </div>

      <div class="notifyDetai_item notifyDetai_item_center">
        <div class="notifyDetai_label">工程：</div>
        <div class="notifyDetai_value">
          <Input v-model="notifyInfo.proTypeName" readonly />
        </div>
      </div>

      <div class="notifyDetai_item">
        <div class="notifyDetai_label">描述：</div>
        <div class="notifyDetai_value">
          <Input v-model="notifyInfo.content" type="textarea" readonly />
        </div>
      </div>

      <div class="notifyDetai_item">
        <div class="notifyDetai_label">附件：</div>
        <div class="notifyDetai_value">
          <!-- <p class="notifyDetai_txt"
           v-for="(item, index) in (notifyInfo.sourceIconNameList || [])" :key="index">{{item}}</p> -->

          <img @click="skipEvent(item)" class="notifyDetai_value_image" :src="$imgUrl + item + '&tendersId=' + (notifyInfo.tendersId || '')" alt="" v-for="(item, index) in (notifyInfo.sourceIconNameList || [])" :key="index">
           
        </div>
      </div>

      <!-- <div class="notifyDetai_item">
        <Button style="margin: 0 50px;" @click="$emit('closeDialog')">取消</Button>
        <Button type="primary" @click="$emit('closeDialog')" style="margin: 0 50px;">确定</Button>
      </div> -->

      <image-look v-if="imgUrl" :imgUrl="imgUrl" @closeDialog="closeDialogEvent"></image-look>
    </div>
  </comm-dialog>
</template>

<script>
import CommDialog from '@/components/commDialog/index';
export default {
  props: {
    notifyInfo: {
      default: () => {}
    },
    title: String
  },

  components: {CommDialog},

  data () {
    return {
      imgUrl: ''
    };
  },

  created () {},

  methods: {
    skipEvent (item) {
      this.imgUrl = this.$imgUrl + item + '&tendersId=' + (this.notifyInfo.tendersId || '');
    },

    closeDialogEvent () {
      this.imgUrl = '';
    }}
};
</script>

<style lang='scss'>
  @import './index.scss';
</style>