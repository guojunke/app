<template>
  <div class="location">

    <div class="location_serach">

      <div class="location_serach_item">
        项目区：
        <Select v-model="form.proId" :clearable="true" :disabled="isRoleOnly || isRoleJinLi" style="width: 1.5rem" @on-change="proChangeEvent">
          <Option v-for="(item, index) in projectList" :value="parseInt(item.id)" :key="index">{{ item.projectName }}</Option>
        </Select>
      </div>

      <div class="location_serach_item">
        标段：
        <Select v-model="form.tendersId" :clearable="true" :disabled="isRoleOnly" style="width:1.5rem" @on-change="tenderEvent">
          <Option v-for="(item, index) in tenderList" :value="item.id" :key="index">{{ item.tenderName || '--'}}</Option>
        </Select>
      </div>

      <div class="location_serach_item">
        类型：
        <Select v-model="form.proTypeId" style="width: 100px;margin-right: .2rem;" @on-change="getRateList">
          <Option v-for="(item, index) in typeList" :value="index" :key="index">{{ item }}</Option>
        </Select>
      </div>

    </div>

    <div class="location_table">
      <!-- <div class="location_table_left" v-if="!(form.proTypeId === 'ROAD' || form.proTypeId === 'GREEN')">
        <div id="location_box" class="location_box"></div>
      </div>

      <div class="location_table_left" v-else>
        <p>
          <img class="image" :src="`${$imgUrl}${imgItem}`" alt="" v-for="(imgItem, imgIndex) in iconList" :key="imgIndex">
        </p>
      </div> -->

      <div class="location_table_left">
        <div id="location_box" class="location_box" v-if="!(form.proTypeId === 'ROAD' || form.proTypeId === 'GREEN')"></div>
        <p class="location_image_box">
          <img @click="skipEvent(imgItem)" :class="iconList.length <= 1 ? 'location_image_single' : 'image'" :src="`${$imgUrl}${imgItem}&tendersId=${form.tendersId || ''}`" alt="" v-for="(imgItem, imgIndex) in iconList" :key="imgIndex">
        </p>
      </div>

      <div class="location_table_right">
        <Table :columns="columnList" :data="proTypeList"></Table>
      </div>
    </div>
    

    <image-look v-if="imgUrl" :imgUrl="imgUrl" @closeDialog="closeDialogEvent"></image-look>

    <comm-loading v-if="isLoading"></comm-loading>
  </div>
</template>

<script>
export default {
  props: {},

  components: {},

  data () {
    return {
      isLoading: false,
      isRoleOnly: false,
      isRoleJinLi: false,
      imgUrl: '',
      mapObj: null,
      form: {
        proId: '',
        tendersId: '',
        proTypeId: ''
      },
      iconList: [],
      columnList: [
        {
          key: '',
          title: '项目区',
          minWidth: 100,
          render: (h, params) => {
            // let str = '';
            // this.projectList.forEach(item => {
            //   if (item.id === this.form.proId) str = item.projectName;
            // });
            return h('div',
              {
                on: {
                  click: () => {
                    if (!params.row.dimension) {
                      this.$Message.info('暂未定位！');
                      return false;
                    }
                    this.resetCenter(params.row.dimension, params.row.longitude);
                  }
                }
              }, params.row.projectName);
          }
        },
        {
          key: '',
          title: '标段',
          minWidth: 100,
          render: (h, params) => {
            // let str = '';
            // this.tenderList.forEach(item => {
            //   if (item.id === this.form.tendersId) str = item.tenderName;
            // });
            return h('div', params.row.tenderName);
          }
        },
        {key: 'name', title: '工程', minWidth: 100},
        {
          key: 'content',
          title: '内容',
          minWidth: 100,
          render: (h, params) => {
            const arr = [];
            // arr.push(h('span'), params.row.standards);
            arr.push(h('span', params.row.desc));
            // if (params.row.quantity) {
            //   arr.push(h('span'), ' * ' + params.row.quantity);
            // }
            return h('p', arr);
          }
        },
      ],
      projectList: [],
      tenderList: [],
      typeList: [],
      projectTypeList: [],
      proTypeList: []
    };
  },

  created () {
    if (this.$store.state.userInfo.roleName === '施工单位') {
      this.form.proId = this.$store.state.userInfo.projectId;
      this.form.tendersId = this.$store.state.userInfo.tenderId;
      this.isRoleOnly = true;
    } else if (this.$store.state.userInfo.roleName === '监理') {
      this.form.proId = this.$store.state.userInfo.projectId;
      this.isRoleJinLi = true;
    }
    this.getProjectList();
    this.getTenderList();
    this.getTypeList();
  },

  mounted () {
    this.mapObj = new AMap.Map('location_box', {
      resizeEnable: true,
      zoom:11
    });
  },

  methods: {
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

    proChangeEvent () {
      this.getTenderList();
      this.form.tendersId = '';
      // this.form.type = '';
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

    tenderEvent () {
      this.form.type = '';
      this.form.proTypeId = '';
      // this.getProTypeList();
    },

    // 获取类型列表
    getTypeList () {
      // let params = {
      //   id: this.form.tendersId
      // };
      window.$axios.get({url: '/projectType/getAllProjectType'}).then(res => {
        if (res.data) {
          this.typeList = res.data || [];
        }
      }).catch(error => {
        this.$Message.error(error.message);
      });
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
          this.typeList = res.data || [];
        }
      }).catch(error => {
        this.$Message.error(error.message);
      });
    },

    getRateList () {
      if (!this.form.proTypeId) return false;
      
      let params = {
        proId: this.form.proId,
        tendersId: this.form.tendersId,
        type: this.form.proTypeId
      };
      // this.getIcon(params);

      this.isLoading = true;
      this.proTypeList = [];
      window.$axios.get({url: '/projectType/getPositionIconList', params}).then(res => {
        this.isLoading = false;
        
        this.getIcon(params);
        // this.proTypeList = res.data[0].tendersVoList[0].projectTypePositionList || [];
        // this.createMap(this.proTypeList[0].dimension, this.proTypeList[0].longitude);
        res.data[0].tendersVoList.forEach(item => {
          this.proTypeList = [...this.proTypeList, ...(item.projectTypePositionList || [])];
        });
        // this.projectTypeList;
        // this.createMap(this.proTypeList[0].dimension, this.proTypeList[0].longitude);
      }).catch(() => {
        this.isLoading = false;
      });
    },

    getIcon (params) {
      this.iconList = [];
      this.projectTypeList = [];
      this.isLoading = true;
      window.$axios.get({url: '/progress/getIcon', params}).then(res => {
        this.isLoading = false;
        res.data.forEach(item => {
          this.iconList = [...this.iconList, ...(item.iconList || [])];
          this.projectTypeList = [...this.projectTypeList, ...(item.projectTypeList || [])];
        });
        // console.log(this.iconList);
        // if (this.projectTypeList[0] && this.projectTypeList[0].dimension) {
        //   this.createMap(this.projectTypeList[0].dimension, this.projectTypeList[0].longitude);
        // } else {
        //   this.emptyMap();
        // }
        this.createMap();
        
        this.proTypeList && this.proTypeList.forEach(item => {
          this.iconList = [...this.iconList, ...(item.roadIconList || [])];
        });
        
        
      }).catch(() => {
        this.isLoading = false;
      });
    },

    createMap () {
      let centerR = '';
      let centerQ = '';
      let markerArr = [];
      let i = -1;
      this.projectTypeList.forEach((item, index) => {
        if (item.dimension) {
          i++;
          if (i === 0) {
            centerR = item.dimension;
            centerQ = item.longitude;
          }
          markerArr[i] = new AMap.Marker({
            position: new AMap.LngLat(item.dimension, item.longitude), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          });
          markerArr[i].setLabel({
            offset: new AMap.Pixel(6, 10), //设置文本标注偏移量
            content: item.name, //设置文本标注内容
            direction: 'right' //设置文本标注方位
          });
        }
        
      });
      if (markerArr.length > 0) {
        this.mapObj = new AMap.Map('location_box', {
          center: [centerR, centerQ],
          resizeEnable: true,
          zoomToAccuracy:true,
          zoom:11
        });
        this.mapObj.add(markerArr);
      } else {
        this.mapObj = new AMap.Map('location_box', {
          resizeEnable: true,
          zoomToAccuracy:true,
          zoom:11
        });
      }
      
    },

    emptyMap () {
      this.mapObj = new AMap.Map('location_box', {
        resizeEnable: true,
        zoomToAccuracy:true,
        zoom:11
      });
    },

    skipEvent (item) {
      this.imgUrl = this.$imgUrl + item + '&tendersId=' + (this.form.tendersId || '');
    },

    closeDialogEvent () {
      this.imgUrl = '';
    },

    resetCenter (lng, lat) {
      // console.log(lng, lat);
      this.mapObj.setZoomAndCenter(15, [lng, lat]);
    }
  }
};
</script>

<style lang='scss'>
  @import './index.scss';
</style>