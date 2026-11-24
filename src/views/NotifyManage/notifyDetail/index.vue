<template>
  <comm-dialog :title="title" :styleData="{width: '480px'}" @closeDialog="$emit('closeDialog')">
    <div slot="container" class="notifyDetai">
      <!-- <div class="notifyDetai_item notifyDetai_item_center">
        <div class="notifyDetai_label">项目区：</div>
        <div class="tenderDatail_value">
          <Input v-model="notifyInfo.projectName" readonly />
        </div>
      </div>

      <div class="notifyDetai_item notifyDetai_item_center">
        <div class="notifyDetai_label">标段：</div>
        <div class="tenderDatail_value">
          <Input v-model="notifyInfo.tenderName" readonly />
        </div>
      </div>

      <div class="notifyDetai_item notifyDetai_item_center">
        <div class="notifyDetai_label">类型：</div>
        <div class="tenderDatail_value">
          <Input v-model="notifyInfo.type" readonly />
        </div>
      </div>

      <div class="notifyDetai_item notifyDetai_item_center">
        <div class="notifyDetai_label">工程：</div>
        <div class="tenderDatail_value">
          <Input v-model="notifyInfo.proTypeName" readonly />
        </div>
      </div>

      <div class="notifyDetai_item">
        <div class="notifyDetai_label">描述：</div>
        <div class="tenderDatail_value">
          <Input v-model="notifyInfo.content" type="textarea" readonly />
        </div>
      </div>

      <div class="notifyDetai_item">
        <div class="notifyDetai_label">附件：</div>
        <div class="tenderDatail_value">
          <p class="notifyDetai_txt"
           v-for="(item, index) in (notifyInfo.sourceIconNameList || [])" :key="index">{{item.slice(1, item.length - 1)}}</p>
        </div>
      </div> -->

      <div class="notifyDetai_item">
        
        <div class="notifyDetai_label">通知单内容：</div>
        <div class="tenderDatail_value">
          <Input v-model="notifyInfo.content" type="textarea" readonly />
        </div>
      </div>

      <div class="notifyDetai_item" v-if="notifyInfo.sourceIconNameList && notifyInfo.sourceIconNameList.length > 0">
        <div class="notifyDetai_label">通知单附件：</div>
        <div class="tenderDatail_value">
          <img @click="skipEvent(item)" v-show="testImg(item)" class="notifyDetai_item_image" :src="$imgUrl + item + '&tendersId=' + (notifyInfo.tendersId || '')" alt="加载失败" v-for="(item, index) in (notifyInfo.sourceIconNameList || [])" :key="index">
          <a v-show="!testImg(item)" :href="$imgUrl + item + '&tendersId=' + (notifyInfo.tendersId || '')"  target="_blank" v-for="(item, index) in (notifyInfo.sourceIconNameList || [])" :key="index + 100">{{item}}</a>
        </div>
      </div>

      <div class="notifyDetai_item" v-if="notifyInfo.returnIconNameList && notifyInfo.returnIconNameList.length > 0">
        <div class="notifyDetai_label">回执附件：</div>
        <div class="tenderDatail_value">
          <img @click="skipEvent(item)" v-show="testImg(item)" class="notifyDetai_item_image" :src="$imgUrl + item + '&tendersId=' + (notifyInfo.tendersId || '')" alt="加载失败" v-for="(item, index) in (notifyInfo.returnIconNameList || [])" :key="index">
        <a v-show="!testImg(item)" :href="$imgUrl + item + '&tendersId=' + (notifyInfo.tendersId || '')"  target="_blank" v-for="(item, index) in (notifyInfo.returnIconNameList || [])" :key="index + 100">{{item}}</a>
        </div>
        
      </div>

      <div v-else class="notifyDetai_item" style="line-height: 1rem;">暂无回执数据</div>

      <div class="notifyDetai_item" v-if="notifyInfo.reason">
        
        <div class="notifyDetai_label">驳回原因：</div>
        <div class="tenderDatail_value">
          <Input v-model="notifyInfo.reason" type="textarea" readonly />
        </div>
      </div>

      <div class="notifyDetai_item" v-if="notifyInfo.rejectIconNameList && notifyInfo.rejectIconNameList.length > 0">
        <div class="notifyDetai_label">驳回附件：</div>
        <div class="tenderDatail_value">
          <img @click="skipEvent(item)" v-show="testImg(item)" class="notifyDetai_item_image" :src="$imgUrl + item + '&tendersId=' + (notifyInfo.tendersId || '')" alt="加载失败" v-for="(item, index) in (notifyInfo.rejectIconNameList || [])" :key="index">
          <a v-show="!testImg(item)" :href="$imgUrl + item + '&tendersId=' + (notifyInfo.tendersId || '')"  target="_blank" v-for="(item, index) in (notifyInfo.rejectIconNameList || [])" :key="index + 100">{{item}}</a>
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
    skipEvent (item) {
      this.imgUrl = this.$imgUrl + item + '&tendersId=' + (this.notifyInfo.tendersId || '');
    },
    sureEvent () {
      this.$emit('closeDialog');
      if (this.isLookBack) {
        const params = {
          id: this.notifyInfo.id,
          roleId: this.$store.state.userInfo.roleId
        };
        window.$axios.post('notice/updateConfirm', params).then(res => {
          console.log(res);
        });
      }
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