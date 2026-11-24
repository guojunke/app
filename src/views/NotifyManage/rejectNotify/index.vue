<template>
  <comm-dialog :title="title" :styleData="{width: '480px'}" @closeDialog="$emit('closeDialog')">
    <div slot="container" class="notifyDetai">

      <div class="notifyDetai_item">
        
        <div class="notifyDetai_label">驳回理由：</div>
        <div class="tenderDatail_value">
          <Input v-model="reason" type="textarea" />
        </div>
      </div>

      <div class="notifyDetai_item" v-if="notifyInfo.sourceIconNameList && notifyInfo.sourceIconNameList.length > 0">
        <div class="notifyDetai_label">驳回附件：</div>
        <Upload action="#" multiple :before-upload="uploadBefore" style="marignRight: 2rem;">
          <Button style="marignRight: 2rem;">上传附件</Button>
        </Upload>
        <span style="display: inline-block; width: 2.16rem;"></span>
        <div v-for="(item, index) in fileList" :key="index"
          class="notifyDetai_span">
          <span @click="lookEvent(index)">{{item.name}}</span>
          
          <Icon type="ios-close" size="22" @click="fileList.splice(index, 1)" />
        </div>
      </div>


      <div class="notifyDetai_item">
        <Button style="margin: 0 50px;" @click="$emit('closeDialog')">取消</Button>
        <Button type="primary" @click="sureEvent" style="margin: 0 50px;">确定</Button>
      </div>

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
    isLookBack: {
      default: false
    },
    title: String
  },

  components: {CommDialog},

  data () {
    return {
      fileList: [],
      reason: this.notifyInfo.reason,
      imgUrl: ''
    };
  },

  methods: {
    testImg (item) {
      if (/.png|.jpg|.jpeg|.jepg/.test(item)) {
        return true;
      } else {
        return false;
      }
    },

    uploadBefore(file) {
      this.fileList.push(file);
      return false;
    },

    skipEvent (item) {
      this.imgUrl = this.$imgUrl + item + '&tendersId=' + (this.notifyInfo.tendersId || '');
    },
    sureEvent () {
      const params = Object.assign({}, this.notifyInfo);
      params.result = 'reject';
      let formData = new FormData();
      // Object.keys(params).forEach(key => {
      //   formData.append(key, params[key]);
      // });
      formData.append('id', params.id);
      formData.append('proId', params.proId);
      formData.append('tendersId', params.tendersId);
      if (params.proTypeId) formData.append('proTypeId', params.proTypeId);
      formData.append('roleId', this.$store.state.userInfo.roleId);
      formData.append('result', params.result);
      formData.append('reason', this.reason);

      this.fileList.forEach((item, index) => {
        formData.append('file' + index, item);
      });
      
      this.isLoading = true;
      window.$axios.post('/notice/update', formData).then(res => {
        this.isLoading = false;
        if (res.success) {
          
          this.$emit('closeDialog');
          this.$emit('closeSuccess');
          this.$Message.info('更新成功！');
        }
      }).catch(() => {
        this.isLoading = false;
      });
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