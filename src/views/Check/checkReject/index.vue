<template>
  <comm-dialog :title="checkInfo.projectName + '--' + checkInfo.tenderName" :styleData="{width: '480px'}" @closeDialog="$emit('closeDialog')">
    <div slot="container" class="checkReject">

      <div class="checkReject_item" style="padding: .3rem 0 .3rem;">
        <div class="checkReject_label">驳回理由：</div>
        <div class="checkReject_value">
          <Input v-model="reason" type="textarea" />
        </div>
      </div>

      <div class="checkReject_item" v-if="checkInfo.id && checkInfo.result !== 'reject'">
        <div class="checkReject_label">附件：</div>
        <Upload action="#" multiple :before-upload="uploadBefore" style="marignRight: 2rem;">
          <Button style="marignRight: 2rem;">上传附件</Button>
        </Upload>
        <span style="display: inline-block; width: 1.9rem;"></span>
        <div v-for="(item, index) in fileList" :key="index"
          class="checkReject_span checkReject_span_look">
          {{item.name}}
          <Icon type="ios-close" size="22" @click="fileList.splice(index, 1)" />
        </div>
      </div>

      <div class="checkReject_item" v-if="checkInfo.id && checkInfo.result === 'reject'">
        <div class="checkReject_label">附件：</div>
        <span style="display: inline-block; width: 0rem;"></span>
        <div class="checkReject_value">
          <div v-for="(item, index) in checkInfo.rejectIcon ? checkInfo.rejectIcon.slice(2, checkInfo.rejectIcon.length - 2).split(',') : []" :key="index"
            class="checkReject_span">
            <img @click="skipEvent(item)" v-show="testImg(item)" class="notifyDetai_item_image" :src="$imgUrl + item + '&tendersId=' + (checkInfo.tendersId || '')" alt="加载失败">
            <a v-show="!testImg(item)" :href="$imgUrl + item + '&tendersId=' + (checkInfo.tendersId || '')" target="_blank">{{item}}</a>
          </div>
        </div>
        
      </div>

      <div class="checkReject_item" v-if="!isLook">
        <Button style="margin: 0 50px;" @click="$emit('closeDialog')">取消</Button>
        <Button type="primary" @click="updateSataus" style="margin: 0 50px;">确定</Button>
      </div>

      <image-look v-if="imgUrl" :imgUrl="imgUrl" @closeDialog="closeDialogEvent"></image-look>
    </div>
  </comm-dialog>
</template>

<script>
export default {
  props: {
    checkInfo: {
      default: () => {}
    },
    isLook: {
      default: false
    }
  },

  data () {
    return {
      resultDate: '',
      imgUrl: '',
      fileList: [],
      reason: ''
    };
  },

  created () {
    if (this.isLook) {
      this.reason = this.checkInfo.reason;
    }
  },

  methods: {
    testImg (item) {
      if (/.png|.jpg|.jpeg|.jepg/.test(item)) {
        return true;
      } else {
        return false;
      }
    },
    skipEvent (item) {
      this.imgUrl = this.$imgUrl + item + '&tendersId=' + (this.checkInfo.tendersId || '');
    },
    closeDialogEvent () {
      this.imgUrl = '';
    },
    uploadBefore(file) {
      this.fileList.push(file);
      return false;
    },
    updateSataus () {
      if (!this.reason) {
        this.$Message.error('驳回理由不能为空！');
        return false;
      }
      const params = {
        id: this.checkInfo.id,
        proId: this.checkInfo.proId,
        tendersId: this.checkInfo.tendersId,
        result: 'reject',
        reason: this.reason
      };
      let formData = new FormData();
      Object.keys(params).forEach(key => {
        formData.append(key, params[key]);
      });
      this.fileList.forEach((item, index) => {
        formData.append('file' + index, item);
      });
      this.isLoading = true;
      // window.$axios.post('/appointment/update', params).then(res => {
      window.$axios.post('/appointment/updateReject', formData).then(res => {
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