<template>
  <div class="rateData">

    <div class="rateData_search">
      <div class="rateData_search_item">
        发布时间：
        <DatePicker v-model="form.gmtCreate" type="date" placeholder="请选择"
          style="width: 1.5rem"></DatePicker>
      </div>
      <div class="rateData_search_item">
        项目区：
        <Select v-model="form.proId" :clearable="true" :disabled="isRoleOnly || isRoleJinLi" style="width: 1.5rem" @on-change="proChangeEvent">
          <Option v-for="(item, index) in projectList" :value="parseInt(item.id)" :key="index">{{ item.projectName }}</Option>
        </Select>
      </div>

      <div class="rateData_search_item">
        标段：
        <Select v-model="form.tendersId" :clearable="true" :disabled="isRoleOnly" style="width:1.5rem">
          <Option v-for="(item, index) in tenderList" :value="item.id" :key="index">{{ item.tenderName || '--'}}</Option>
        </Select>
      </div>

      <Button type="primary" @click="getList()" >搜索</Button>
      <Button v-if="$store.state.userInfo.roleName === '施工单位'" type="primary" style="margin-left: .2rem;"
        @click="isShowAdd = true">新增</Button>
    </div>

    <div ref="rateDataTable" class="rateData_table">
      <Table :columns="columnList" :data="tableData" :max-height="tableHeight"></Table>
      <div class="rateData_page">
        <Page :total="total" :current="form.pageNum" :page-size="form.pageSize" @on-change="pageEvent" />
      </div>
    </div>
    
    <rate-data-detail v-if="isShowDetail" :rateInfo="rateInfo"
      @closeDialog="isShowDetail = false" @successUpdate="getList()"></rate-data-detail>

    <rate-info v-if="isShowInfo" :rateInfo="rateInfo"
      @closeDialog="isShowInfo = false"></rate-info>

    <add-rate v-if="isShowAdd" @closeDialog="isShowAdd = false" @successUpdate="getList()"></add-rate>

    <comm-loading v-if="isLoading"></comm-loading>
  </div>
</template>

<script>
import RateDataDetail from './rateDataDetail/index';
import RateInfo from './rateInfo';
import AddRate from './addRate';

export default {
  props: {},

  components: {RateDataDetail, RateInfo, AddRate},

  data () {
    return {
      isLoading: false,
      isShowInfo: false,
      isRoleOnly: false,
      isRoleJinLi: false,
      isShowAdd: false,
      form:{
        gmtCreate: '',
        pageNum: 1,
        pageSize: 20
      },
      rateInfo: {},
      isShowDetail: false,
      projectList: [],
      tenderList: [],
      tableHeight: 0,
      total: 0,
      tableData: [],
      columnList: [
        {
          key: '',
          title: '序号',
          width: 66,
          align: 'center',
          render: (h, params) => {
            return h('span', params.index + 1);
          }
        },
        {key: 'gmtCreate', title: '报告时间', minWidth: 100, align: 'center'},
        {key: 'projectName', title: '项目区', minWidth: 90, align: 'center'},
        {key: 'tenderName', title: '标段', minWidth: 90, align: 'center'},
        {key: 'content', title: '报告内容', minWidth: 100, align: 'center'},
        {
          key: 'remark',
          title: '状态',
          minWidth: 80,
          align: 'center',
          render: (h, params) => {
            const arr = [];
            if (params.row.status === 'pass') {
              arr.push(h('span'), '已通过');
            } else if (params.row.status === 'refuse') {
              arr.push(h('span'), '已驳回');
            } else if (params.row.status === 'new') {
              arr.push(h('span'), '处理中');
            }
            return h('div', {
              class: params.row.status === 'pass' ? 'rateData_green' : (params.row.status === 'refuse' ? 'rateData_red' : '')
            }, arr);
          }
        },
        {
          key: '',
          title: '操作',
          width: 240,
          align: 'center',
          render: (h, params) => {
            const arr = [];
            arr.push(h('Button', {
              props: {
                type: 'primary'
              },
              on: {
                click: () => {
                  this.isShowInfo = true;
                  this.rateInfo = params.row;
                }
              }
            }, '查看'));
            if (!(params.row.status === 'pass' || params.row.status === 'refuse') && this.$store.state.userInfo.roleName === '监理') {
              arr.push(h('Button', {
                props: {
                  type: 'success'
                },
                style: {margin: '0 .1rem'},
                on: {
                  click: () => {
                    this.updateSataus(params.row, 'pass');
                  }
                }
              }, '通过'));
              arr.push(h('Button', {
                props: {
                  type: 'error'
                },
                on: {
                  click: () => {
                    this.isShowDetail = true;
                    this.rateInfo = params.row;
                  }
                }
              }, '驳回'));
            }
              
            return h('div', arr);
          }
        }
      ]
    };
  },

  created () {
    if (this.$store.state.userInfo.roleName === '施工单位') {
      let obj = this.columnList[6];
      obj.width = 100;
      this.columnList.splice(6, 1, obj);
      this.form.proId = this.$store.state.userInfo.projectId;
      this.form.tendersId = this.$store.state.userInfo.tenderId;
      this.isRoleOnly = true;
    } else if (this.$store.state.userInfo.roleName === '监理') {
      this.form.proId = this.$store.state.userInfo.projectId;
      this.isRoleJinLi = true;
    } else if (this.$store.state.userInfo.roleName === '业主') {
      let obj = this.columnList[6];
      obj.width = 100;
      this.columnList.splice(6, 1, obj);
      this.columnList.splice(5, 1);
    }
    this.getTenderList();
    this.getList();
    this.getProjectList();
  },

  mounted () {
    // console.log(this.$refs.userManageTable.clientHeight);
    this.tableHeight = this.$refs.rateDataTable.clientHeight - 80;
  },

  methods: {
    // 获取所有项目区
    getProjectList () {
      window.$axios.get({url: '/project/getProjectList'}).then(res => {
        if (res.data) {
          this.projectList = [{id: 0, projectName: '全部'}, ...(res.data || [])];
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
          this.tenderList = [{id: 0, tenderName: '全部'}, ...(res.data || [])];
        }
      }).catch(error => {
        this.$Message.error(error.message);
      });
    },

    getList () {
      let params = {
        proId: this.form.proId || '',
        tendersId: this.form.tendersId || '',
        pageNum: this.form.pageNum,
        pageSize: this.form.pageSize,
        date: this.$formatDate(this.form.gmtCreate) || ''
      };
      this.isLoading = true;
      window.$axios.get({url: '/dailypaper/getDailyPaperList', params}).then(res => {
        this.isLoading = false;
        if (res.data) {
          this.tableData = res.data.dataList || [];
          this.total = res.data.total || 0;
        }
      }).catch(error => {
        this.isLoading = false;
        this.$Message.error(error.message);
      });
    },

    pageEvent (val) {
      this.form.pageNum = val;
      this.getList();
    },

    updateSataus (obj, type, reason = '') {
      const params = {
        id: obj.id,
        proId: obj.proId,
        tendersId: obj.tendersId,
        status: type
      };
      // const params = Object.assign(obj);
      if (type === 'refuse') {
        params.reason = reason;
      }
      this.isLoading = true;
      window.$axios.post('/dailypaper/updateStatus', params).then(res => {
        this.isLoading = false;
        if (res.success) {
          this.$Message.info('更新成功！');
          this.getList();
        }
      }).catch(() => {
        this.isLoading = false;
      });
    }
  }
};
</script>

<style lang='scss'>
  @import './index.scss';
</style>