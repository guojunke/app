<template>
  <div class="pieList">
    <div class="pieList_header">
      <h4>
        <span></span>
        {{proData.projectName}} 各标段工程量占比
      </h4>
    </div>

    <div class="pieList_box">
      <div class="pieList_box_container" v-for="(item, index) in proAllRate" :key="index">
        <div :id="'pieListBoxItem' + index" :ref="'pieListBoxItem' + index" class="pieList_box_item"></div>
        <h4>{{item.typeName}}</h4>
      </div>
      
    </div>

    <comm-loading v-if="isLoading"></comm-loading>
  </div>
</template>

<script>
import $echarts from 'echarts';
export default {
  props: {
    proData: {
      default: () => {}
    }
  },

  components: {},

  data () {
    return {
      isLoading: false,
      proAllRate: []
    };
  },

  mounted () {
    this.getAllTypeRate();
  },

  methods: {
    getAllTypeRate () {
      let params = {
        proId: this.proData.proId
      };
      this.proAllRate = [];
      window.$axios.get({url:'/progress/getProjectRatio', params}).then(res => {
        ['路', '桥', '坝', '塘', '井', '绿化', '机电', '智能化', '其他'].forEach(key => {
          res.data.forEach(item => {
            if (item.typeName === key) this.proAllRate.push(item);
          });
        });

        
        let timers = setTimeout(() => {
          this.proAllRate.forEach((item, index) => {
            let key = 'pieListBoxItem' + index;
            this.pieDo(document.getElementById(key), item);
          });
          clearTimeout(timers);
        }, 600);
      });
    },

    pieDo (dom, data) {
      this.isLoading = true;
      // let myChart = this.$echarts.init(dom);
      let myChart = $echarts.init(dom);
      let dataArr = [];
      data.tenderRatios && data.tenderRatios.forEach(item => {
        // dataArr.push({value: item.ratio.slice(0, item.ratio.length - 1), name: item.tenderName});
        dataArr.push({value: item.ratio, name: item.tenderName + '--' + item.ratio + '%'});
      });
      myChart.setOption({
        legend: {
          orient: 'vertical',
          // top: 'top',
          left: 'left',
          // data: ['直接访问', '邮件营销']
        },
        series : [
          {
            name: '访问来源',
            type: 'pie', // 设置图表类型为饼图
            radius: '50%', // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
            center: ['60%', '60%'],
            labelLine: {
              length: 6,
              length2: 5
            },
            label: {
              normal: {
                formatter: '{c}',
                fontSize: 10,
                position: 'outside'
              }
            },
            data: dataArr
          }
        ]
      });
      
      this.isLoading = false;
    }
  }
};
</script>

<style lang='scss'>
  @import './index';
</style>