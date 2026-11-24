<template>
  <comm-dialog title="定位" :styleData="{width: '7.2rem'}" @closeDialog="$emit('closeDialog')">
    <div class="locala" slot="container">

      <div v-if="localData.type === 'ROAD' || localData.type === 'GREEN'" class="locala_left" style="border: 1px solid #ddd;">
        <img @click="skipEvent(item)" class="locala_left_img" :src="$imgUrl + item + '&tendersId=' + (localData.tendersId || '')" alt="加载异常" v-for="(item, index) in showImageList" :key="index">
      </div>
      <div v-else id="locala_left" class="locala_left"></div>

      <div class="locala_right">
        <div class="locala_row">
          <p>定位对象：</p>
          <p>{{localData.projectName}}-{{localData.tenderName}}-{{localData.name}}</p>
        </div>

        <div class="locala_row"  v-if="!(localData.type === 'ROAD' || localData.type === 'GREEN')">
          <p style="line-height: .36rem;">位置信息：</p>
          <p>
            经度：
            <Input v-model="localData.dimension" :disabled="!isCanLocaltion" style="width: 1.5rem;margin-bottom: .06rem;" @on-change="mapEvent"/>
            <br/>
            纬度：
            <Input v-model="localData.longitude" :disabled="!isCanLocaltion" style="width: 1.5rem;" @on-change="mapEvent"/>
          </p>
        </div>

        <div class="locala_row">
          <p style="line-height: .36rem;">{{ isCanLocaltion ? '选择' : ''}}附件：</p>
          <p v-if="isCanLocaltion">
            <Upload v-if="$store.state.userInfo.roleName === '监理'" action="#" :before-upload="uploadBefore" style="marignRight: 2rem;">
              <Button style="marignRight: 2rem;">上传附件</Button>
            </Upload>
            <br/>
            <span v-for="(item, index) in imageList" :key="index" class="locala_row_span">{{item.name}}</span>
          </p>
          <p style="padding-top: .06rem;" v-else-if="!(localData.type === 'ROAD' || localData.type === 'GREEN')">
            <a :href="$imgUrl + item + '&tendersId=' + (localData.tendersId || '')"  target="_blank" v-for="(item, index) in showImageList" :key="index" class="locala_row_span">{{item}}</a>
          </p>
        </div>

        <div class="locala_row">
          <p>定位描述：</p>
          <Input type="textarea" v-model="localData.desc" style="width: 2.4rem;"/>
        </div>

        <div v-if="$store.state.userInfo.roleName === '监理'" class="locala_row" style="justify-content: center;margin: .2rem 0">
          <Button type="primary" style="margin: 0 .3rem" @click="uploadLocal">确定</Button>
          <Button @click="$emit('closeDialog')">取消</Button>
        </div>
      </div>
      <image-look v-if="imgUrl" :imgUrl="imgUrl" @closeDialog="closeDialogEvent"></image-look>

      <comm-loading v-if="isLoading"></comm-loading>

    </div>
  </comm-dialog>
</template>

<script>
export default {
  props: {
    localObj: {
      default: () => {}
    },
    isCanLocaltion: {
      default: false
    }
  },

  components: {},

  data () {
    return {
      isLoading: false,
      localData: {},
      imgUrl: '',
      showImageList: [],
      imageList: [],
      markArr: [],
      mapObj: null
    };
  },

  created () {
    this.localData = Object.assign({}, this.localObj);
    if (this.localData.roadIcon) {
      this.showImageList = this.localData.roadIcon.slice(2, this.localData.roadIcon.length - 2).split(',');
    }
    if (!this.localData.dimension) this.localData.dimension = window.$positionDimen;
    if (!this.localData.longitude) this.localData.longitude = window.$positionLong;

    // if (this.localData.roadIcon) {
    //   this.roadIconList = this.localData.roadIcon.slice(2, this.localData.roadIcon.length - 2).split(',');
    // }
  },

  mounted () {
    if (!(this.localData.type === 'ROAD' || this.localData.type === 'GREEN')) {
      this.mapEvent();
      let _this = this;
      if (this.$store.state.userInfo.roleName === '监理' && this.isCanLocaltion) {
        this.mapObj.on('click', function(ev) {
        // 触发事件的地理坐标，AMap.LngLat 类型
          var lnglat = ev.lnglat;
          _this.localData.dimension = lnglat.R;
          _this.localData.longitude = lnglat.Q;

          var marker2 = new AMap.Marker({
            position: new AMap.LngLat(lnglat.R, lnglat.Q), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          });
          _this.markArr.map(item => {
            _this.mapObj.remove(item);
          });
          _this.markArr.splice(0, _this.markArr.length, marker2);
          _this.mapObj.add(_this.markArr);
        });
      }
    }
    
  },

  methods: {
    mapEvent () {
      this.mapObj = new AMap.Map('locala_left', {
        center: [this.localData.dimension || window.$positionDimen || '112.397428', this.localData.longitude || window.$positionLong || '31.90923'],
        resizeEnable: true,
        zoom:11
      });
      const _this = this;
      if (!this.localData.dimension || !this.localData.longitude) {
        this.mapObj.plugin('AMap.Geolocation', function() {
          let geolocation = new AMap.Geolocation({
            // 是否使用高精度定位，默认：true
            enableHighAccuracy: true,
            // 设置定位超时时间，默认：无穷大
            timeout: 10000,
            showMarker: true,
            // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
            buttonOffset: new AMap.Pixel(0, 0),
            //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            zoomToAccuracy: true,     
            //  定位按钮的排放位置,  RB表示右下
            buttonPosition: 'RB'
          });
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete', onComplete);
          AMap.event.addListener(geolocation, 'error', onError);

          function onComplete (data) {
            console.log(data);
          }
          function onError (data) {
            console.log(data);
          }
        });
      }
      if (this.localData.dimension && this.localData.longitude) {
        let marker = new AMap.Marker({
          position: new AMap.LngLat(this.localData.dimension || window.$positionDimen || '112.397428', this.localData.longitude || window.$positionLong || '31.90923'), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        // title: '北京'
        });
        this.markArr.forEach(item => {
          this.mapObj.remove(item);
        });
        // if (this.markArr.length) this.markArr.splice(0, this.markArr.length, marker);
        this.markArr.splice(0, this.markArr.length || 1, marker);
        this.mapObj.add(this.markArr);
      }
      
    },

    uploadLocal () {
      let params = null;
      let formData = null;
      if (this.localData.type === 'ROAD' || this.localData.type === 'BRIDGE' || this.localData.type !== 'BRIDGE') {
        params = new FormData();
        Object.keys(this.localData).forEach(key => {
          params.append(key, this.localData[key]);
        });
        this.imageList.forEach((item) => {
          params.append('file', item);
        });
        // params.append('desc', desc)
      } else {
        params = {
          dimension: this.localData.dimension,
          longitude: this.localData.longitude
        };
        params = Object.assign({}, this.localData, params);
        
        formData = new FormData();
        Object.keys(params).forEach(key => {
          formData.append(key, params[key]);
        });
        this.imageList.forEach((item) => {
          formData.append('file', item);
        });
      }
      
      // Object.assign(this.localData, params)
      this.isLoading = true;
      window.$axios.post('/projectType/update', formData || params).then(() => {
        this.isLoading = false;
        this.$Message.info('定位成功！');
        this.$emit('uploadLocal');
        this.$emit('closeDialog');
      }).catch(_ => {
        this.isLoading = false;
      });
    },

    uploadBefore (file) {
      this.imageList && this.imageList.push(file);
      return false;
    },
    skipEvent (item) {
      this.imgUrl = this.$imgUrl + item + '&tendersId=' + (this.localData.tendersId || '');
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