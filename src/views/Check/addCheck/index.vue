<template>
  <comm-dialog title="新报验记录" :styleData="{width: '480px'}" @closeDialog="$emit('closeDialog')">
    <div slot="container" class="addCheck">

      <div class="addCheck_item">
        <div class="addCheck_label">项目区：</div>
        <Select v-model="form.proId" class="addCheck_value" :disabled="isRoleOnly">
          <Option v-for="(item, index) in projectList" :value="parseInt(item.id)" :key="index">{{ item.projectName }}</Option>
        </Select>
      </div>

      <div class="addCheck_item">
        <div class="addCheck_label">标段：</div>
        <Select v-model="form.tendersId" class="addCheck_value" :disabled="isRoleOnly" @on-change="tenderChange">
          <Option v-for="(item, index) in tenderList" :value="item.id" :key="index">{{ item.tenderName || '--' }}</Option>
        </Select>
      </div>

      <div class="addCheck_item">
        <div class="addCheck_label">工程种类：</div>
        <Select v-model="form.proTypeId" class="addCheck_value" :disabled="editData && editData.id">
          <Option v-for="(item, index) in proTypeList" :value="item.id" :key="index">{{ item.name || '--' }}</Option>
        </Select>
      </div>

      <!-- <div class="addCheck_item">
        <div class="addCheck_label">工程种类：</div>
        <Select v-model="form.proTypeId" class="addCheck_value">
          <Option v-for="(item, index) in typeList" :value="item.id" :key="index">{{ item.name || '--' }}</Option>
        </Select>
      </div> -->

      <div class="addCheck_item">
        <div class="addCheck_label">报验内容：</div>
        <div class="addCheck_value">
          <Input v-model="reason" type="textarea" :disabled="editData && editData.id"/>
        </div>
      </div>

      <div class="addCheck_item">
        <Button style="margin: 0 .3rem;" @click="$emit('closeDialog')">取消</Button>
        <Button type="primary" @click="updateSataus()" style="margin: 0 .3rem;">确定</Button>
      </div>

      <image-look v-if="isShowFile" :imgUrl="base64Img.join()" @closeDialog="isShowFile = false"></image-look>
    </div>
  </comm-dialog>
</template>

<script>
export default {
  props: {
    editData: {
      default: () => {}
    }
  },

  data () {
    return {
      reason: '',
      isRoleOnly: false,
      isShowFile: false,
      base64Img: [],
      form: {
        proId: '',
        tendersId: '',
        proTypeId: '',
        content: ''
      },
      projectList: [],
      tenderList: [],
      typeList: [],
      proTypeList: []
    };
  },

  created () {
    if (this.$store.state.userInfo.roleName === '施工单位') {
      this.form.proId = this.$store.state.userInfo.projectId;
      this.form.tendersId = this.$store.state.userInfo.tenderId;
      this.tenderChange();
      this.isRoleOnly = true;
    }
    if (this.editData && this.editData.id) {
      this.form.proTypeId = this.editData.proTypeId;
      this.form.content = this.editData.content;
      this.reason = this.editData.content;
    }
    this.getTenderList();
    this.getProjectList();
    this.getTypeList();
  },

  methods: {
    tenderChange () {
      this.form.proTypeId = '';
      this.getProTypeList();
    },
    // 获取类型列表
    getProTypeList () {
      if (!this.form.tendersId) {
        return false;
      }
      let params = {
        tendersId: this.form.tendersId
      };
      this.form.type = '';
      window.$axios.get({url: '/projectType/getProTypeDataByTendersId', params}).then(res => {
        if (res.data) {
          this.proTypeList = res.data || [];
        }
      }).catch(error => {
        this.$Message.error(error.message);
      });
    },
    // 获取所有的标段
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
    
    // 获取类型列表
    getTypeList () {
      let params = {
        tendersId: this.form.tendersId
      };
      window.$axios.get({url: '/projectType/getProTypeDataByTendersId', params}).then(res => {
        if (res.data) {
          this.typeList = res.data || [];
        }
      }).catch(error => {
        this.$Message.error(error.message);
      });
    },

    updateSataus () {
      if (!this.form.proTypeId) {
        this.$Message.error('工程种类不能为空！');
        return false;
      }
      if (!this.reason) {
        this.$Message.error('报验内容不能为空！');
        return false;
      }
      const params = {
        // id: this.addCheck.id,
        proId: this.form.proId,
        tendersId: this.form.tendersId,
        proTypeId: this.form.proTypeId,
        // type: this.form.proTypeId,
        content: this.reason
      };
      this.isLoading = true;
      let url = '/appointment/add';
      if (this.editData && this.editData.id) {
        url = 'appointment/update';
        params.id = this.editData.id;
        params.result = 'new';
      }
      window.$axios.post(url, params).then(res => {
        this.isLoading = false;
        if (res.success) {
          this.$Message.info('更新成功！');
          this.$emit('successUpdate');
          this.$emit('closeDialog');
        }
      }).catch(() => {
        this.isLoading = false;
      });
    },

    lookEvent (index) {
      let reader = new FileReader();
      reader.onload = (value) => {
        this.base64Img.push(value.target.result);
      };
      reader.readAsDataURL(this.fileList[index]);
      this.isShowFile = true;
    }
  }
};
</script>

<style lang='scss'>
  @import './index.scss';
</style>