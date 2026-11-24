<template>
    <div class="totalRate">

        <h4 class="totalRate_header">
            <span></span>
            {{proData.company}}
        </h4>
        <div class="totalRate_table">
            <ul class="totalRate_row" :style="{width: totalWidth + 'rem', 'min-width': totalWidth + 'rem'}">
                <li class="totalRate_line" v-for="(item, index) in columnList" :key='index'
                    :style="{width: item.width, 'border-bottom': '1px solid #ddd', height: '.36rem', display: 'flex', 'align-items': 'center', 'justify-content': 'center'}">{{item.title}}</li>
            </ul>

            <ul :style="{width: totalWidth + 'rem', 'min-width': totalWidth + 'rem'}" class="totalRate_row" v-if="proTypeList.length < 1" style="border: 1px solid #ddd;line-height: 1rem;justify-content: center;">
              暂无数据
            </ul>

            <ul class="totalRate_row" v-for="(dataItem, dataIndex) in proTypeList" :key="dataIndex" :style="{width: totalWidth + 'rem', 'min-width': totalWidth + 'rem'}">
                <li v-for="(item, index) in columnList" :key='index'
                    :style="{width: item.width, display: 'flex', 'flex-direction': 'column'}">
                    <div class="totalRate_line" v-if="index === 0" style="flex: 1">
                      <p style="height: 100%;display: flex;align-items: center;justify-content: center;">
                        {{dataItem[item.key]}}
                      </p>
                    </div>

                    <div :style="{ flex: listItem.projectTypes.length || 1, display: 'flex'}" class="totalRate_line" v-else-if="index === 1" v-for="(listItem, listIndex) in dataItem.list" :key="listIndex">
                        <p :style="{'min-height': '.36rem'}">
                          {{listItem[item.key]}}
                        </p>
                    </div>

                    <div :style="{ flex: listItem.projectTypes.length || 1, display: 'flex'}" class="totalRate_line" v-else-if="index === 2" v-for="(listItem, listIndex) in dataItem.list" :key="listIndex">
                        <p :style="{'min-height': '.36rem'}">
                          {{listItem[item.key]}}
                        </p>
                    </div>

                    <div :style="{ flex: listItem.projectTypes.length || 1, display: 'flex'}" v-else-if="index === 3" class="totalRate_line" v-for="(listItem, listIndex) in dataItem.list" :key="listIndex">
                        <p :style="{'min-height': '.36rem'}">
                          {{parseInt(listItem[item.key] || 0)}}
                        </p>
                    </div>

                    <div v-else-if="index > 3 && index < 6" class="totalRate_line" v-for="(listItem, listIndex) in dataItem.list" :key="listIndex"
                      :style="{flex: (listItem.projectTypes && listItem.projectTypes.length) || 1}">
                        <p v-for="(typeItem, typeIndex) in listItem.projectTypes || []" :key='typeIndex'
                          style="min-height: .54rem; line-height: .36rem;">
                          {{typeItem[item.key]}}
                        </p>
                    </div>

                    <div v-else-if="index === 6" class="totalRate_line" v-for="(listItem, listIndex) in dataItem.list" :key="listIndex"
                      :style="{flex: (listItem.projectTypes && listItem.projectTypes.length) || 1}">
                        <p v-for="(typeItem, typeIndex) in listItem.projectTypes || []" :key='typeIndex'
                          style="min-height: .54rem; line-height: .36rem;">
                          {{parseInt(typeItem[item.key] || 0)}} %
                        </p>
                    </div>
              

                    <!-- <div v-else-if="index === 7" class="totalRate_line" v-for="(listItem, listIndex) in dataItem.list" :key="listIndex"
                      :style="{flex: (listItem.projectTypes && listItem.projectTypes.length) || 1}">
                        <p v-for="(typeItem, typeIndex) in listItem.projectTypes || []" :key='typeIndex'
                          style="min-height: .54rem; line-height: .36rem;">
                          {{typeItem[item.key]}}%
                        </p>
                    </div> -->

                    <div v-else-if="index === 7" class="totalRate_line" v-for="(listItem, listIndex) in dataItem.list" :key="listIndex"
                      :style="{flex: (listItem.projectTypes && listItem.projectTypes.length) || 1}">
                        <p v-for="(typeItem, typeIndex) in listItem.projectTypes || []" :key='typeIndex'
                          style="min-height: .54rem; line-height: .36rem;">
                          {{parseInt(typeItem[item.key] || 0)}} %
                        </p>
                    </div>

                    <div v-else-if="index === 8" class="totalRate_line" v-for="(listItem, listIndex) in dataItem.list" :key="listIndex"
                      :style="{flex: (listItem.projectTypes && listItem.projectTypes.length) || 1}">
                        <p v-for="(typeItem, typeIndex) in listItem.projectTypes || []" :key='typeIndex'
                          style="min-height: .54rem; line-height: .36rem;">
                          <Button size="small" type="primary" @click="checkEvent(typeItem)">查看</Button>
                        </p>
                    </div>

                    <div v-else-if="index === 9" class="totalRate_line" v-for="(listItem, listIndex) in dataItem.list" :key="listIndex"
                      :style="{flex: (listItem.projectTypes && listItem.projectTypes.length) || 1}">
                      <p  v-for="(typeItem, typeIndex) in listItem.projectTypes || []" :key='typeIndex'
                        style="min-height: .54rem; line-height: .36rem;">
                        <Button v-if="$store.state.userInfo.roleName !== '监理'" :disabled="!typeItem.dimension" size="small" type="primary" @click="localEvent(typeItem, false)">
                          {{ typeItem.dimension ? '查看定位' : '未定位' }}
                        </Button>
                        <Button v-if="$store.state.userInfo.roleName === '监理' && typeItem.dimension" size="small" type="primary" @click="localEvent(typeItem, false)">
                          {{ '查看定位'}}
                        </Button>
                        <Button v-if="$store.state.userInfo.roleName === '监理' && typeItem.dimension" size="small" style="margin-left: 6px;" type="primary" @click="localEvent(typeItem, true)">
                          {{ '重新定位'}}
                        </Button>
                        <Button v-if="$store.state.userInfo.roleName === '监理' && !typeItem.dimension" size="small" style="margin-left: 6px;" type="primary" @click="localEvent(typeItem, true)">
                          {{ '未定位'}}
                        </Button>
                      </p>
                        
                    </div>

                    <div v-else-if="index === 10" class="totalRate_line" v-for="(listItem, listIndex) in dataItem.list" :key="listIndex">
                      <p  v-for="(typeItem, typeIndex) in listItem.projectTypes || []" :key='typeIndex'
                        style="min-height: .54rem; line-height: .36rem;">
                        <Button v-if="typeItem.status === 'new' && $store.state.userInfo.roleName === '监理'" size="small" type="primary" disabled style="margin-right: .1rem" @click="updateSataus(typeItem, 'pass')">未发起</Button>
                        <Button v-if="typeItem.status === 'running' && $store.state.userInfo.roleName === '监理'" size="small" type="primary" style="margin-right: .1rem" @click="updateSataus(typeItem, 'finish')">通过</Button>
                        <Button v-if="typeItem.status === 'running' && $store.state.userInfo.roleName === '监理'" size="small" type="primary" style="margin-right: .1rem" @click="checkRejectEvent(typeItem)">驳回</Button>
                        <Button v-if="typeItem.status === 'new' && $store.state.userInfo.roleName === '施工单位'" size="small" type="primary" style="margin-right: .1rem" @click="updateSataus(typeItem, 'running')">报验</Button>
                        <Button v-if="typeItem.status === 'running' && $store.state.userInfo.roleName === '施工单位'" size="small" type="primary" style="margin-right: .1rem" disabled>报验中</Button>
                        <Button v-if="typeItem.status === 'finish'" size="small" type="primary" disabled style="margin-right: .1rem">已通过</Button>
                        <Button v-if="typeItem.status === 'refuse'" size="small" type="primary" disabled style="margin-right: .1rem">已驳回</Button>
                      </p>
                        
                    </div>

                    <div v-else-if="index === 11" class="totalRate_line" v-for="(listItem, listIndex) in dataItem.list" :key="listIndex">
                      <p  v-for="(typeItem, typeIndex) in listItem.projectTypes || []" :key='typeIndex'
                        style="min-height: .54rem; line-height: .36rem;">
                        <span>{{typeItem.reason}}</span>
                        <!-- <Button size="small" type="primary" @click="localEvent(typeItem)">定位</Button> -->
                      </p>
                        
                    </div>
                </li>
            </ul>
        </div>

        <local-a v-if="isShowLocal" :isCanLocaltion="isCanLocaltion" :localObj="localObj" @closeDialog="isShowLocal = false"
            @uploadLocal="getRateList()"></local-a>

        <check-list v-if="isShowCheck" :checkData="checkData"  @closeDialog="isShowCheck = false"></check-list>

        <check-reject v-if="isShowCheckreject" :checkInfo="checkData"
          @closeDialog="isShowCheckreject = false" @successUpdate="getRateList()"></check-reject>
    </div>
</template>

<script>
import LocalA from './locala';
import CheckList from './check';
import CheckReject from './checkReject';

export default {
  props: {
    proData: {
      default: () => {}
    }
  },

  components: {LocalA, CheckList, CheckReject},

  data () {
    return {
      isShowLocal: false,
      isShowCheck: false,
      isShowCheckreject: false,
      isCanLocaltion: false,
      checkData: {},
      localObj: {},
      proTypeList: [],
      columnList: [
        {key: 'typeName', title: '工程种类', width: '1rem'},
        {key: 'standards', key2: '', title: '规格', width: '1rem'},
        {key: 'totalNum', title: '数量', width: '1rem'},
        {key: 'totalLength', title: '合同总工程量', width: '1.1rem'},
        {key: 'name', title: '施工点位', width: '1.3rem'},
        {key: 'quantity',title: '合同工程量', width: '.9rem'},
        // {key: 'complete',title: '完成工程量', width: '.9rem'},
        {key: 'totalProcess', title: '总进度', width: '.8rem'},
        {key: 'yesterdayProcess',title: '昨日进度', width: '.8rem'},
        // {key: 'contractPrice', title: '合同价', width: '1.2rem'},
        // {key: 'processPrice', title: '进度价', width: '1.2rem'},
        {title: '过程报验', width: '1rem'},
        {title: '操作', width: '2.3rem'},
        {title: '竣工验收', width: '1.6rem'}
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
    if (this.$store.state.userInfo.roleName === '施工单位') {
      this.columnList.push({key: 'remark', title: '备注', width: '1.2rem'});
      // this.columnList.splice(13, 3);
    }
    if (this.$store.state.userInfo.roleName === '业主') {
      this.columnList.pop();
    }
    this.getRateList();
  },

  methods: {
    getRateList () {
      let params = {
        proId: this.proData.proId,
        tendersId: this.proData.tendersId
      };
      this.isLoading = true;
      window.$axios.get({url: '/progress/getTenderProgress', params}).then(res => {
        this.isLoading = false;
        this.proTypeList = [];
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
          this.proTypeList.push(obj);
        });
        // this.proTypeList = res.data;
      }).catch(() => {
        this.isLoading = false;
      });
    },

    localEvent (item, type) {
      console.log(type, '--type');
      this.localObj = item;
      this.isCanLocaltion = type;
      this.isShowLocal = true;
    },

    checkEvent (item) {
      this.checkData = item;
      this.isShowCheck = true;
    },

    updateSataus (obj, type) {
      const params = {
        ...obj,
        status: type
      };
      let formData = new FormData();
      Object.keys(params).forEach(key => {
        formData.append(key, params[key]);
      });
      this.isLoading = true;
      window.$axios.post('/projectType/update', formData).then(res => {
        this.isLoading = false;
        if (res.success) {
          this.$Message.info('更新成功！');
          this.getRateList();
        }
      }).catch(() => {
        this.isLoading = false;
      });
    },

    checkRejectEvent (item) {
      this.checkData = item;
      this.isShowCheckreject = true;
    }
  }

};
</script>

<style lang="scss" scoped>
@import './index';
</style>
