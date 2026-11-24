<template>
  <comm-dialog :title="videoInfo.tiltle" :styleData="{width: '480px'}" @closeDialog="$emit('closeDialog')">
    <div slot="container" class="videoDetail">

      <div class="videoDetail_item videoDetail_item_center">
        <div class="videoDetail_label">类型：</div>
        <div class="tenderDatail_value">
          <Input v-model="videoInfo.type" readonly />
        </div>
      </div>

      <div class="videoDetail_item">
        <div class="videoDetail_label">描述：</div>
        <div class="tenderDatail_value">
          <Input v-model="videoInfo.remark" type="textarea" readonly />
        </div>
      </div>

      <div class="videoDetail_item">
        <div class="videoDetail_label">附件：</div>
        <div class="tenderDatail_value">
          <p class="videoDetail_txt" style="display: inline-block;"
           v-for="(item, index) in (videoInfo.fileNameList || [])" :key="index">
            <img @click="skipEvent(item)" v-if="testImg(item)" :src="$imgUrl + item + '&tendersId=' + (videoInfo.tendersId || '')" alt="">
            <video v-if="testVideo(item)" :src="$imgUrl + item + '&tendersId=' + (videoInfo.tendersId || '')" controls style="max-width: 3rem;"></video>
            <a :href="$imgUrl + item + '&tendersId=' + (videoInfo.tendersId || '')"  target="_blank">{{item}}</a>
          </p>
          <!-- <img v-show="testImg(item)" :src="$imgUrl + item" alt="" v-for="(item, index) in (videoInfo.fileNameList || [])" :key="index">
          <video v-show="testVideo(item)" :src="$imgUrl + item" v-for="(item, index) in (videoInfo.fileNameList || [])" :key="index"></video> -->
        </div>
      </div>

      <div class="videoDetail_item">
        <Button style="margin: 0 50px;" @click="$emit('closeDialog')">取消</Button>
        <Button type="primary" @click="$emit('closeDialog')" style="margin: 0 50px;">确定</Button>
      </div>

      <image-look v-if="imgUrl" :imgUrl="imgUrl" @closeDialog="closeDialogEvent"></image-look>
    </div>
  </comm-dialog>
</template>

<script>
export default {
  props: {
    videoInfo: {
      default: () => {}
    }
  },

  data () {
    return {
      imgUrl: ''
    };
  },

  created () {},

  methods: {
    testImg (item) {
      if (/.png|.jpg|.jpeg|.jepg/.test(item)) {
        return true;
      } else {
        return false;
      }
    },

    testVideo (item) {
      if (/.mp4|.mp3|.wmv|.mov/.test(item)) {
        return true;
      } else {
        return false;
      }
    },

    skipEvent (item) {
      this.imgUrl = this.$imgUrl + item + '&tendersId=' + (this.videoInfo.tendersId || '');
    },

    closeDialogEvent () {
      this.imgUrl = '';
    }
  }
};
</script>

<style lang='scss'>
  @import './index.scss';
</style>