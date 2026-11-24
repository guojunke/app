<template>
  <div class="allInfo">
    <div class="allInfo_header">
      <h4>
        <span></span>
        <!-- {{proData.projectName}} 工程量统计 -->
        项目总工程量统计
      </h4>
    </div>

    <div class="allInfo_table">
      <ul>
        <li class="allInfo_table_th allInfo_table_cell" v-for="(item, index) in columnList" :key="index"
          :style="{width: item.width}">
          {{item.title}}
        </li>
      </ul>

      <ul v-if="dataList.length < 1"
        style="line-height: 1rem; heihgt: 1px;justify-content: center;border-right: 1px solid #ddd;border-bottom: 1px solid #ddd;">
        暂无数据
      </ul>

      <ul v-for="(dataItem, dataIndex) in dataList" :key="dataIndex">

        <li :style="{width: columnList[0].width}">
          <p class="allInfo_table_cell" style="height: 100%;align-items: center;">
            {{dataItem[columnList[0].key]}}
          </p>
        </li>

        <li :style="{width: columnList[1].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;flex: 1;">
            <p class="allInfo_table_cell" style="align-items: center">
              {{listItem[columnList[1].key]}}
            </p>
          </div>
        </li>

        <li :style="{width: columnList[2].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;flex: 1;">
            <p class="allInfo_table_cell" style="align-items: center">
              {{listItem[columnList[2].key]}}
            </p>
          </div>
        </li>

        <li :style="{width: columnList[3].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;flex: 1;">
            <p class="allInfo_table_cell" style="align-items: center">
              {{parseInt(listItem[columnList[3].key] || 0)}}
            </p>
          </div>
        </li>

        <li :style="{width: columnList[4].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;flex: 1;">
            <p class="allInfo_table_cell" style="align-items: center">
              {{parseInt(listItem[columnList[4].key] || 0)}}%
            </p>
          </div>
        </li>

        <li :style="{width: columnList[5].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;flex: 1;">
            <p class="allInfo_table_cell" style="align-items: center">
              {{parseInt(listItem[columnList[5].key] || 0)}}%
            </p>
          </div>
        </li>

        <li :style="{width: columnList[6].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;flex: 1;">
            <p class="allInfo_table_cell"
              :class="{'allInfo_color_blue': listItem[columnList[6].key]}" @click="lookNotifyEvent(listItem)">
              {{listItem[columnList[6].key]}}
            </p>
          </div>
        </li>

      </ul>
    </div>

    <notify-list v-if="isShowNOtify" :notifyData="notifyData" @closeDialog="isShowNOtify = false"></notify-list>

    <comm-loading v-if="isLoading"></comm-loading>
  </div>
</template>

<script>
import NotifyList from './../ProInfo/notifyList';

export default {
  props: {
    proData: {
      default: () => {}
    }
  },

  components: { NotifyList },

  data () {
    return {
      isLoading: false,
      isShowNOtify: false,
      notifyData: {},
      dataList: [],
      columnList: [
        {key: 'typeName', title: '工程种类', width: '1.2rem'},
        {key: 'standards', title: '规格', width: '1rem'},
        {key: 'totalNum', title: '数量', width: '1rem'},
        {key: 'totalLength', title: '总工程量(各标段之和)', width: '1.8rem'},
        {key: 'totalProcess', title: '总进度', width: '1.2rem'},
        {key: 'yesterdayProcess', title: '昨日进度', width: '1.2rem'},
        {key: 'noticeNum', title: '通知单', width: '1.2rem'}
      ]
    };
  },

  created () {
    this.getList();
  },

  methods: {
    getList () {
      let params = {
        // proId: this.proData.proId
      };
      this.isLoading = true;
      window.$axios.get({url: '/progress/getTotalProgress', params}).then(res => {
        this.isLoading = false;
        let typeList = [];
        res.data.forEach(item => {
          typeList.push(item.type);
        });
        typeList = Array.from(new Set(typeList));

        typeList.map(item => {
          let obj = {list: []};
          res.data.forEach(resItem => {
            if (item === resItem.type) {
              obj.typeName = resItem.typeName;
              obj.list.push(resItem);
            }
          });
          this.dataList.push(obj);
        });
        console.log(this.dataList);
      }).catch(() => {
        this.isLoading = false;
      });
    },

    lookNotifyEvent (item) {
      console.log(item);
      this.notifyData = item;
      this.isShowNOtify = true;
    }
  }
};
</script>

<style lang='scss'>
  @import './index';
</style>