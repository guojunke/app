<template>
    <div class="tenderManage">
        <!-- <div class="tenderManage_row_line" :style="{width: (2.3) * (proList.length-1 < 4 ? proList.length-1 : 3) + 'rem'}"></div> -->
        
        <div class="tenderManage_box" :style="{width: proList.length * 2.8 + 'rem'}"
           :class="{'tenderManage_disabled': $store.state.userInfo.roleName !== '业主'}">
          <p class="tenderManage_box_item" @click="proSkip()">项目</p>
          <p class="tenderManage_box_line"></p>
        </div>
        
        <div class="tenderManage_container">
            <div class="tenderManage_item_box" v-for="(item, index) in proList" :key="index">
                <p class="tenderManage_item_top" style="border-top: 1px solid #aaa;height: 1px;width: 100%;"></p>
                <p class="tenderManage_item_line"></p>
                <p class="tenderManage_item_tender" :class="{'tenderManage_disabled': !roleCheck(item.id)}" @click="projectSkip(item)">
                    {{item.projectName}}
                </p>
                <p class="tenderManage_item_line"></p>
                <div class="tenderManage_type_box">
                    <Button class="tenderManage_item_type" @click="tenderSkip(item, typeItem)"
                        :disabled="!roleCheck(item.id, typeItem.id)"
                        v-for="(typeItem, typeIndex) in item.tanderProjectTypeList" :key="typeIndex">
                        {{typeItem.tenderName}}
                    </Button>
                </div>
            </div>

        </div>

        
    </div>
</template>

<script>
export default {
  data () {
    return {
      roleName: '',
      proList: [],
    };
  },

  created () {
    this.roleName = this.$store.state.userInfo.roleName;
    this.getList();
  },
  methods: {
    getList () {
      window.$axios.get({url: 'project/getBackendProjectIndex'}).then(res => {
        this.proList = res.data || [];
      });
    },

    proSkip () {
      if (this.$store.state.userInfo.roleName !== '业主') return false;
      this.$router.push({path: '/AllInfo'});
    },

    projectSkip (proItem) {
      if (!this.roleCheck(proItem.id)) return false;
      let params = {
        proId: proItem.id,
        projectName: proItem.projectName
      };
      sessionStorage.setItem('homeProData', JSON.stringify(params));
      this.$router.push({path: '/ProInfo'});
    },

    tenderSkip (proItem, typeItem) {
      if (!this.roleCheck(proItem.id, typeItem.id)) return false;
      try {
        
        let params = {
          proId: typeItem.proId,
          projectName: proItem.projectName,
          tendersId: typeItem.id,
          tenderName: typeItem.tenderName,
          company: typeItem.company
        };
        sessionStorage.setItem('homeProData', JSON.stringify(params));
        this.$router.push({path: '/TenderInfo'});
      } catch (error) {
        alert(error);
      }
      
    },

    roleCheck (proId, tendersId) {
      let isOk = true;
      if (this.roleName === '施工单位') {
        if (!tendersId) isOk = false;
        if (proId && proId !== this.$store.state.userInfo.projectId) {
          isOk = false;
        } else if (tendersId !== this.$store.state.userInfo.tenderId) {
          isOk = false;
        }
      } else if (this.roleName === '监理') {
        if (proId && proId !== this.$store.state.userInfo.projectId) {
          isOk = false;
        }
      }
      return isOk;
    }
  }
};
</script>

<style lang="scss">
@import './index.scss'; 
</style>

