<template>
  <div class="proStatic">
    <div class="proStatic_header">
      <h4>
        <span></span>
        {{proData.projectName}} 工程量统计
      </h4>
    </div>

    <div class="proStatic_table">
      <ul :style="{width: totalWidth + 'rem', 'min-width': totalWidth + 'rem'}">
        <li class="proStatic_table_th proStatic_table_cell_other" v-for="(item, index) in columnList" :key="index"
          :style="{width: item.width}">
          {{item.title}}
        </li>
      </ul>

      <ul v-if="dataList.length < 1" :style="{width: totalWidth + 'rem', 'min-width': totalWidth + 'rem'}"
        style="line-height: 1rem; heihgt: 1px;justify-content: center;border-right: 1px solid #ddd;border-bottom: 1px solid #ddd;">
        暂无数据
      </ul>

      <ul v-for="(dataItem, dataIndex) in dataList" :key="dataIndex" :style="{width: totalWidth + 'rem', 'min-width': totalWidth + 'rem'}">

        <li :style="{width: columnList[0].width}">
          <p class="proStatic_table_cell" style="height: 100%;align-items: center;">
            {{dataItem[columnList[0].key]}}
          </p>
        </li>

        <li :style="{width: columnList[1].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;"
            :style="{flex: listItem.tenderProcess.length || 1}">
            <p class="proStatic_table_cell proStatic_table_flex" style="align-items: center">
              {{listItem[columnList[1].key]}}
            </p>
          </div>
        </li>

        <li :style="{width: columnList[2].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;"
            :style="{flex: listItem.tenderProcess.length || 1}">
            <p class="proStatic_table_cell proStatic_table_flex" style="align-items: center">
              {{listItem[columnList[2].key]}}
            </p>
          </div>
        </li>

        <li :style="{width: columnList[3].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;"
            :style="{flex: listItem.tenderProcess.length || 1}">
            <p class="proStatic_table_cell proStatic_table_flex" style="align-items: center">
              {{parseInt(listItem[columnList[3].key] || 0)}}
            </p>
          </div>
        </li>

        <li :style="{width: columnList[4].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;"
            :style="{flex: listItem.tenderProcess.length || 1}">
            <p class="proStatic_table_cell proStatic_table_flex" v-for="(tenderItem, tenderIndex) in listItem.tenderProcess" :key="tenderIndex">
              {{tenderItem[columnList[4].key]}}
            </p>
          </div>
        </li>

        <li :style="{width: columnList[5].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;"
            :style="{flex: listItem.tenderProcess.length || 1}">
            <p class="proStatic_table_cell proStatic_table_flex" v-for="(tenderItem, tenderIndex) in listItem.tenderProcess" :key="tenderIndex">
              {{parseInt(tenderItem[columnList[5].key] || 0)}}
            </p>
          </div>
        </li>

        <!-- <li :style="{width: columnList[6].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;"
            :style="{flex: listItem.tenderProcess.length || 1}">
            <p class="proStatic_table_cell proStatic_table_flex" v-for="(tenderItem, tenderIndex) in listItem.tenderProcess" :key="tenderIndex">
              {{parseInt(tenderItem[columnList[6].key] || 0)}}
            </p>
          </div>
        </li> -->

        <li :style="{width: columnList[6].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;"
            :style="{flex: listItem.tenderProcess.length || 1}">
            <p class="proStatic_table_cell proStatic_table_flex" v-for="(tenderItem, tenderIndex) in listItem.tenderProcess" :key="tenderIndex">
              {{parseInt(tenderItem[columnList[6].key] || 0)}}%
            </p>
          </div>
        </li>

        <li :style="{width: columnList[7].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;"
            :style="{flex: listItem.tenderProcess.length || 1}">
            <p class="proStatic_table_cell proStatic_table_flex" v-for="(tenderItem, tenderIndex) in listItem.tenderProcess" :key="tenderIndex">
              {{parseInt(tenderItem[columnList[7].key] || 0)}}%
            </p>
          </div>
        </li>

        <li :style="{width: columnList[8].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;"
            :style="{flex: listItem.tenderProcess.length || 1}">
            <p class="proStatic_table_cell proStatic_table_flex" v-for="(tenderItem, tenderIndex) in listItem.tenderProcess" :key="tenderIndex">
            
              {{tenderItem[columnList[8].key].length > 28 ? tenderItem[columnList[8].key].slice(0, 28) + '...' : tenderItem[columnList[8].key]}}
            </p>
          </div>
        </li>

        <li :style="{width: columnList[9].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;"
            :style="{flex: listItem.tenderProcess.length || 1}">
            <p class="proStatic_table_cell proStatic_table_flex" v-for="(tenderItem, tenderIndex) in listItem.tenderProcess" :key="tenderIndex">
              {{tenderItem[columnList[9].key]}}
            </p>
          </div>
        </li>

        <li :style="{width: columnList[10].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;"
            :style="{flex: listItem.tenderProcess.length || 1}">
            <p class="proStatic_table_cell" v-for="(tenderItem, tenderIndex) in listItem.tenderProcess" :key="tenderIndex">
              {{tenderItem[columnList[10].key]}}
            </p>
          </div>
        </li>

        <li :style="{width: columnList[11].width}">
          <div v-for="(listItem, listIndex) in dataItem.list" :key="listIndex" style="display: flex; flex-direction: column;"
            :style="{flex: listItem.tenderProcess.length || 1}">
            <p class="proStatic_table_cell" v-for="(tenderItem, tenderIndex) in listItem.tenderProcess" :key="tenderIndex"
              :class="{'proStatic_color_blue': tenderItem[columnList[11].key]}" @click="lookNotifyEvent(tenderItem, listItem)">
              {{tenderItem[columnList[11].key]}}
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
import NotifyList from './../notifyList';

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
        {key: 'totalLength', title: '合同总工程量(各标段之和)', width: '1.8rem'},
        {key: 'tenderName', title: '施工点位', width: '2.2rem'},
        {key: 'totalLength', title: '合同工程量', width: '1.8rem'},
        // {key: 'complete', title: '完成工程量', width: '1.8rem'},
        {key: 'totalProcess', title: '总进度', width: '1.2rem'},
        {key: 'yesterdayProcess', title: '昨日进度', width: '1.2rem'},
        {key: 'company', title: '中标单位', width: '1.6rem'},
        {key: 'leader', title: '负责人', width: '1.2rem'},
        {key: 'phone', title: '负责人电话', width: '1.8rem'},
        {key: 'noticeNum', title: '通知单', width: '1.2rem'}
      ]
    };
  },

  computed: {
    totalWidth: function () {
      let num = 0;
      this.columnList.forEach(item => {
        num += (parseFloat(item.width.split('rem')[0]));
      });
      return num;
    }
  },

  created () {
    this.getList();
  },

  methods: {
    getList () {
      let params = {
        proId: this.proData.proId
      };
      this.isLoading = true;
      window.$axios.get({url: '/progress/getProjectProgress', params}).then(res => {
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
      }).catch(() => {
        this.isLoading = false;
      });
    },

    lookNotifyEvent (item, listItem) {
      item.type = listItem.type;
      if (['ROAD', 'BRIDGE'].includes(listItem.type)) item.standards = listItem.standards;
      this.notifyData = item;
      this.isShowNOtify = true;
    }
  }
};
</script>

<style lang='scss'>
  @import './index';
</style>