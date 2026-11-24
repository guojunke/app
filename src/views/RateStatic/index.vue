<template>
  <div class="rateStatic">

    <div class="rateStatic_serach">

      <div class="rateStatic_serach_item">
        项目区：
        <Select v-model="form.proId" :clearable="false" :disabled="isRoleOnly || isRoleJinLi" style="width: 1.5rem" @on-change="proChangeEvent">
          <Option v-for="(item, index) in projectList" :value="parseInt(item.id)" :key="index">{{ item.projectName }}</Option>
        </Select>
      </div>

      <div class="rateStatic_serach_item">
        标段：
        <Select v-model="form.tendersId" :clearable="false" :disabled="isRoleOnly" style="width:1.5rem" @on-change="tenderEvent">
          <Option v-for="(item, index) in tenderList" :value="item.id" :key="index">{{ item.tenderName || '--'}}</Option>
        </Select>
      </div>


    </div>

    <div class="rateStatic_table">
      <!-- <div class="rateStatic_table_left"  v-if="!(form.proTypeId === 'ROAD' || form.proTypeId === 'BRIDGE') && proTypeList.length">
        <div id="rateStatic_box" class="rateStatic_box"></div>
      </div>

      <div class="rateStatic_table_left" v-else>
        <p v-for="(item, index) in proTypeList" :key="index">
          <img @click="skipEvent(imgItem)" class="image" :src="`${$imgUrl}${imgItem}`" alt="" v-for="(imgItem, imgIndex) in item.roadIcon" :key="imgIndex">
        </p>
      </div> -->

      <div class="rateStatic_table_left">
        <div id="rateStatic_box" class="rateStatic_box" v-if="!(form.proTypeId === 'ROAD' || form.proTypeId === 'GREEN')"></div>
        <!-- <p class="rateStatic_image_box" v-for="(item, index) in proTypeList" :key="index">
          <img @click="skipEvent(imgItem)" class="image" :src="`${$imgUrl}${imgItem}`" alt="" v-for="(imgItem, imgIndex) in item.roadIcon" :key="imgIndex">
        </p> -->
        <p :class="iconList.length <= 1 ? 'rateStatic_single_image' : 'rateStatic_image_box'" v-for="(imgItem, imgIndex) in iconList" :key="imgIndex">
          <img @click="skipEvent(imgItem)" class="image" :src="`${$imgUrl}${imgItem}&tendersId=${form.tendersId || ''}`" alt="">
        </p>
      </div>

      <div class="rateStatic_table_right">
        <div class="rateStatic_tag" v-if="$store.state.userInfo.roleName !== '所有'">
          <span v-show="hasType.includes(item.type)" v-for="(item, index) in typeList" :key="index" :class="{'rateStatic_tag_active': item.type === form.proTypeId}"
            @click="getRateList(item.type)">
            {{item.typeName}}
          </span>
        </div>
        <div class="rateStatic_tag" v-else>
          <span v-for="(item, index) in typeList" :key="index" :class="{'rateStatic_tag_active': item.type === form.proTypeId}"
            @click="getRateList(item.type)">
            {{item.typeName}}
          </span>
        </div>
        <Table v-if="form.proTypeId === 'ROAD'" border :columns="columnList" :data="proTypeList" :span-method="handleSpan"></Table>
        <Table v-else border :columns="columnList" :data="proTypeList"></Table>
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
      coulmnObj: [],
      iconList: [],
      hasType: [],
      imgUrl: '',
      form: {
        proId: '',
        tendersId: '',
        proTypeId: ''
      },
      columnList: [
        {
          key: 'name',
          title: '工程',
          align: 'center',
          width: 80,
          render: (h, params) => {
            if (this.form.proTypeId === 'ROAD') {
              let arr = [];
              // arr.push(h('p', params.row.standards + ' 水泥路'));
              arr.push(h('p', params.row.standards));
              arr.push(h('p', {style: {'font-size': '.12rem'}}, `共${params.row.totalNum}条, `));
              arr.push(h('p', {style: {'font-size': '.12rem'}}, `总长${params.row.totalLength}米`));
              return h('div', arr);
            } else {
              return h('p', params.row.name);
            }
          }
        },
        {
          key: '',
          title: '描述',
          align: 'center',
          width: 100,
          render: (h, params) => {
            let arr = [];
            if (params.row.type === 'ROAD') {
              // arr.push(h('p', params.row.standards + ' 水泥路'));
              // arr.push(h('p', {style: {'font-size': '.12rem'}}, `(共${params.row.totalNum}条, `));
              // arr.push(h('p', {style: {'font-size': '.12rem'}}, `总长${params.row.totalLength}米)`));
              arr.push(h('p', params.row.name));
            } else if (params.row.type === 'WELL') {
              // arr.push(h('p', `共${params.row.totalNum}个`));
              arr.push(h('p', params.row.desc));
            } else if (params.row.type === 'BRIDGE') {
              // arr.push(h('p', `共${params.row.totalNum}座，`));
              // arr.push(h('p', `总长${params.row.totalLength}米`));
              arr.push(h('p', params.row.desc));
            } else if (params.row.type === 'DAM') {
              // arr.push(h('p', params.row.standards + ' 坝'));
              // arr.push(h('p', {style: {'font-size': '.12rem'}}, `(共${params.row.totalNum}条)`));
              arr.push(h('p', params.row.desc));
            } else if (params.row.type === 'POOL') {
              // arr.push(h('p', `共${params.row.totalNum}个`));
              arr.push(h('p', params.row.desc));
            } else if (params.row.type === 'SMART') {
              // arr.push(h('p', `共${params.row.totalNum}个`));
              arr.push(h('p', params.row.desc));
            } else if (params.row.type === 'GREEN') {
              // arr.push(h('p', `共${params.row.totalNum}个`));
              arr.push(h('p', params.row.desc));
            } else if (params.row.type === 'ELEC') {
              // arr.push(h('p', `共${params.row.totalNum}个`));
              arr.push(h('p', params.row.desc));
            } else if (params.row.type === 'OTHER') {
              // arr.push(h('p', `共${params.row.totalNum}个`));
              arr.push(h('p', params.row.desc));
            }
            
            return h('div', arr);
          }
        },
        {
          key: '',
          title: '完成进度',
          align: 'center',
          minWidth: 180,
          render: (h, params) => {
            const arr = [];
            this.typeObj[params.row.type] && this.typeObj[params.row.type].forEach(item => {
              arr.push(h('div', {style: {display: 'flex', 'align-items': 'center'}}, [
                h('span', {style: {'padding-top': '.12rem', display: 'inline-block'}}, item.name + '：'),
                // h('p', {class: 'rateStatic_rateContainer'}, [
                //   h('span', {
                //     class: 'rateStatic_rateContainer_span',
                //     style: {width: `${params.row.stepProcess[item.oldKey]}%`}
                //   }, parseInt(params.row.stepProcess[item.oldKey]))
                // ]),
                h('div', {class: 'rateStatic_rateContainer_box'}, [
                  // h('span', {class: 'rateStatic_rateContainer_span rateStatic_rateContainer_1'}, parseInt(params.row.stepProcess[item.oldKey]) + '%'),
                  h('span', {class: 'rateStatic_rateContainer_span rateStatic_rateContainer_1'}, parseInt(params.row.stepProcess[item.oldKey] || 0) + '%'),

                  h('span', {class: 'rateStatic_rateContainer_span rateStatic_rateContainer_2'}, parseInt(params.row.stepProcess[item.newKey] || 0) + '%'),
                  h('p', {class: 'rateStatic_rateContainer'}, [
                    h('span', {
                      class: 'rateStatic_rateContainer_span',
                      style: {width: `${params.row.stepProcess[item.oldKey] || 0}%`}
                    }),
                    h('span', {
                      class: 'rateStatic_rateContainer_red',
                      style: {width: `${params.row.stepProcess[item.newKey] || 0}%`}
                    })
                  ]),
                ]),
                h('span', {style: {'padding-top': '.12rem'}}, ' 总：'),
                // h('span', {style: {color: '#76E18D', 'padding-top': '.12rem'}}, '100%')
                h('span', {style: {color: '#76E18D', 'padding-top': '.12rem'}}, `${params.row.stepProcess[item.oldKey]}%`)
              ]));
            });
            return h('div', {style: {'margin': '.1rem 0', display: 'flex', 'flex-direction': 'column', 'justify-content': 'center'}}, arr);
          }
        }
      ],
      projectList: [],
      tenderList: [],
      typeList: [],
      proTypeList: [],
      typeObj: {
        WELL: [
          {newKey: 'boreholeNew', oldKey: 'boreholeOld', name: '钻井', processName: 'wellProcess'},
          {newKey: 'tubingNew', oldKey: 'tubingOld', name: '井管'},
          // {newKey: 'filterNew', oldKey: 'filterOld', name: '滤料'},
          {newKey: 'wellbayNew', oldKey: 'wellbayOld', name: '井台'},
          // {newKey: 'flushingNew', oldKey: 'flushingOld', name: '洗井'},
          {newKey: 'pumpNew', oldKey: 'pumpOld', name: '水泵'},
          {newKey: 'ditchNew', oldKey: 'ditchOld', name: '挖沟'},
          {newKey: 'dischargingTubeNew', oldKey: 'dischargingTubeOld', name: '管道敷设'},
          {newKey: 'watergapNew', oldKey: 'watergapOld', name: '隐形出水口'}
          // {newKey: 'endNew', oldKey: 'endOld', name: '收尾'}
        ],
        ROAD: [
          {newKey: 'braceNew', oldKey: 'braceOld', name: '清基', processName: 'roadProcess'},
          {newKey: 'packingNew', oldKey: 'packingOld', name: '垫层'},
          {newKey: 'roadbedNew', oldKey: 'roadbedOld', name: '路面'},
          {newKey: 'endNew', oldKey: 'endOld', name: '收尾'}
        ],
        BRIDGE: [
          {newKey: 'excavationNew', oldKey: 'excavationOld', name: '基坑', processName: 'bridgeProcess'},
          {newKey: 'packingNew', oldKey: 'packingOld', name: '垫层'},
          {newKey: 'pierNew', oldKey: 'pierOld', name: '桥墩'},
          {newKey: 'abutmentNew', oldKey: 'abutmentOld', name: '台帽'},
          {newKey: 'deckNew', oldKey: 'deckOld', name: '桥面'},
          {newKey: 'endNew', oldKey: 'endOld', name: '收尾'}
        ],
        DAM: [
          {newKey: 'excavationNew', oldKey: 'excavationOld', name: '开挖', processName: 'damProcess'},
          {newKey: 'baseNew', oldKey: 'baseOld', name: '浇筑'},
          {newKey: 'dambodyNew', oldKey: 'dambodyOld', name: '坝体'},
          {newKey: 'revetmentNew', oldKey: 'revetmentOld', name: '护坡'},
          {newKey: 'stepLadderNew', oldKey: 'stepLadderOld', name: '步梯'},
          {newKey: 'desiltNew', oldKey: 'desiltOld', name: '清淤'}
          // {newKey: 'endNew', oldKey: 'endOld', name: '收尾'}
        ],
        POOL: [
          {newKey: 'startNew', oldKey: 'startOld', name: '开挖', processName: 'poolProcess'},
          {newKey: 'watergapNew', oldKey: 'watergapOld', name: '进出水口'},
          {newKey: 'stepLadderNew', oldKey: 'stepLadderOld', name: '步梯'},
          {newKey: 'fenceNew', oldKey: 'fenceOld', name: '围栏'},
          {newKey: 'endNew', oldKey: 'endOld', name: '收尾'}
        ],
        GREEN: [
          {newKey: 'ligustrumLucidumNew', oldKey: 'ligustrumLucidumOld', name: '大叶女贞', processName: 'greenProcess'},
          {newKey: 'willowNew', oldKey: 'willowOld', name: '柳树'},
          {newKey: 'endNew', oldKey: 'endOld', name: '收尾'}
        ],
        ELEC: [
          {newKey: 'poleNew', oldKey: 'poleOld', name: '线杆', processName: 'elecProcess'},
          {newKey: 'ditchNew', oldKey: 'ditchOld', name: '挖沟'},
          {newKey: 'layCableNew', oldKey: 'layCableOld', name: '铺设电缆'},
          {newKey: 'transformerNew', oldKey: 'transformerOld', name: '变压器'},
          {newKey: 'endNew', oldKey: 'endOld', name: '收尾'}
        ],
        SMART: [
          {newKey: 'jbNew', oldKey: 'jbOld', name: '井堡', processName: 'smartProcess'},
          {newKey: 'deviceNew', oldKey: 'deviceOld', name: '设备'},
          {newKey: 'endNew', oldKey: 'endOld', name: '收尾'}
        ],
        OTHER: [
          {newKey: 'curr', oldKey: 'old', name: '进度', processName: 'poolProcess'}
        ]
      }
    };
  },

  created () {
    if (this.$store.state.userInfo.roleName === '施工单位') {
      this.form.proId = this.$store.state.userInfo.projectId;
      this.form.tendersId = this.$store.state.userInfo.tenderId;
      this.getProTypeList();
      this.isRoleOnly = true;
    } else if (this.$store.state.userInfo.roleName === '监理') {
      this.form.proId = this.$store.state.userInfo.projectId;
      this.getProTypeList();
      this.isRoleJinLi = true;
    }
    this.getProjectList();
    this.getTenderList();
    this.getTypeList();
  },

  mounted () {
    var map = new AMap.Map('rateStatic_box', {
      resizeEnable: true,
      zoom:11
    });
  },

  methods: {
    // arraySpanMethod({ row, column, rowIndex, columnIndex }) {
    //   let arr = [];
    //   this.proTypeList.forEach((item, index) => {
    //     if (!arr.includes(item.standards)) {
    //       arr.push([index, item.totalNum]);
    //     }
    //   });
    //   let result = [];
    //   arr.forEach(item => {
    //     item
    //   })
    // },
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
      this.form.type = '';
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
      this.getProTypeList();
      this.getTypeList();
      this.proTypeList = [];
      this.iconList = [];
    },

    // 获取类型列表
    getTypeList () {
      let params = {};
      this.typeList = [];
      this.isLoading = true;
      window.$axios.get({url: '/projectType/getAllProjectType', params}).then(res => {
        this.isLoading = false;
        if (res.success) {
          res.data && Object.keys(res.data).forEach(key => {
            this.typeList.push({type: key, typeName: res.data[key]});
          });
        } else {
          this.$Message.error(res.message);
        }
      }).catch(error => {
        this.isLoading = false;
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
      this.hasType = [];
      window.$axios.get({url: '/projectType/getProTypeDataByTendersId', params}).then(res => {
        if (res.data) {
          // this.typeList = res.data || [];
          res.data && res.data.forEach(item => {
            this.hasType.push(item.type);
          });
          this.hasType = Array.from(new Set(this.hasType));
        }
      }).catch(error => {
        this.$Message.error(error.message);
      });
    },

    handleSpan (obj) {
      if (obj.columnIndex === 0 && this.form.proTypeId === 'ROAD') {
        if (this.coulmnObj[obj.rowIndex]) {
          console.log(obj.columnIndex, [this.coulmnObj[obj.rowIndex], 1]);
          return [this.coulmnObj[obj.rowIndex], 1];
        } else {
          console.log(obj.rowIndex, [0, 0]);
          return [0, 0];
        }
        // if (obj.rowIndex === 0 ) {
        //   return [3, 1];
        // } if (obj.rowIndex < 3) {
        //   return [0, 0];
        // }
      }
      
    },

    getRateList (id) {
      this.form.proTypeId = id;
      if (!this.form.proId) {
        this.$Message.error('请先选择项目区！');
        return false;
      }
      // if (!this.form.tendersId) {
      //   this.$Message.error('请先选择标段！');
      //   return false;
      // }
      let params = {
        proId: this.form.proId,
        tendersId: this.form.tendersId,
        type: this.form.proTypeId
      };
      this.isLoading = true;
      window.$axios.get({url: '/progress/progressStatistics', params}).then(res => {
        this.isLoading = false;
        if (this.form.proTypeId === 'ROAD') {
          let arr = [];
          let num = 0;
          res.data && res.data.forEach(item => {
            arr.push(item);
            this.coulmnObj[num] = item.totalNum + 1;
            num++;
            item.projectTypes && item.projectTypes.forEach(detailItem => {
              this.coulmnObj[num] = 0;
              num++;
              arr.push(Object.assign({}, item, {name: detailItem.name,stepProcess: detailItem.detailProcess}));
            });
          });
          this.proTypeList = arr;
        } else {
          // this.coulmnObj = [];
          this.proTypeList = res.data;
        }
        
        this.getIcon(params);
        
      }).catch(() => {
        this.isLoading = false;
      });
    },

    getIcon (params) {
      this.iconList = [];
      let projectTypeList = [];
      this.isLoading = true;
      window.$axios.get({url: '/progress/getIcon', params}).then(res => {
        this.isLoading = false;
        res.data.forEach(item => {
          this.iconList = [...this.iconList, ...(item.iconList || [])];
          projectTypeList = [...projectTypeList, ...item.projectTypeList];
        });
        // this.proTypeList.forEach(item => {
        //   this.iconList = [...this.iconList, ...(item.roadIconList || [])];
        // });
        if (!(this.form.proTypeId === 'ROAD' || this.form.proTypeId === 'GREEN')) {
          projectTypeList.forEach(item => {
            this.iconList = [...this.iconList, ...(item.roadIconList || [])];
          });
        }
        
        // if (projectTypeList && projectTypeList[0].dimension) {
        //   this.createMap(projectTypeList[0].dimension, projectTypeList[0].longitude);
        // } else {
        //   this.createEmptyMap();
        // }
        this.createMap();
        
      }).catch(() => {
        this.isLoading = false;
      });
    },

    createMap () {
      
      let markerArr = [];
      let i = -1;
      let centerQ = '';
      let centerR = '';
      this.proTypeList && this.proTypeList.forEach((item, index) => {
        if (item.dimension) {
          i++;
          if (i === 0) {
            centerR = item.dimension;
            centerQ = item.longitude;
          }
          markerArr[i] = new AMap.Marker({
            position: new AMap.LngLat(item.dimension, item.longitude), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          // title: '北京'
          });
          markerArr[i].setLabel({
            offset: new AMap.Pixel(10, 10), //设置文本标注偏移量
            content: item.name, //设置文本标注内容
            direction: 'right' //设置文本标注方位
          });
        }
        
      });
      console.log(markerArr.length > 0);
      if (markerArr.length > 0) {

        this.mapObj = new AMap.Map('rateStatic_box', {
          center: [centerR, centerQ],
          resizeEnable: true,
          zoomToAccuracy:true,
          zoom:11
        });
        this.mapObj.add(markerArr);
      } else {
        this.mapObj = new AMap.Map('rateStatic_box', {
          resizeEnable: true,
          zoomToAccuracy:true,
          zoom:11
        });
      }
      
    },

    createEmptyMap () {
      this.mapObj = new AMap.Map('rateStatic_box', {
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
    }
  }
};
</script>

<style lang='scss'>
  @import './index.scss';
</style>