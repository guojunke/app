<template>
  <div class="tenderDataManage">

    <div class="tenderDataManage_serach">
      <div class="tenderDataManage_serach_item">
        发布时间：
        <DatePicker v-model="form.date" format="yyyy-MM-dd" type="date" placeholder="请选择" style="width: 1.2rem"></DatePicker>
      </div>

      <div class="tenderDataManage_serach_item">
        项目区：
        <Select v-model="form.proId" :clearable="true" style="width: 1.2rem" :disabled="isRoleOnly || isRoleJinLi" @on-change="proChangeEvent">
          <Option v-for="(item, index) in projectList" :value="parseInt(item.id)" :key="index">{{ item.projectName }}</Option>
        </Select>
      </div>

      <div class="tenderDataManage_serach_item">
        标段：
        <Select v-model="form.tendersId" :clearable="true" :disabled="isRoleOnly" style="width:1.2rem">
          <Option v-for="(item, index) in tenderList" :value="item.id" :key="index">{{ item.tenderName || '--'}}</Option>
        </Select>
      </div>

      <div class="tenderDataManage_serach_item">
        类型：
        <Select v-model="form.type" :clearable="true" style="width:1.2rem">
          <Option v-for="(item, index) in typeList" :value="item" :key="index">{{ item }}</Option>
        </Select>
      </div>
      <div class="tenderDataManage_serach_item">
        <Button class="marginRight" type="primary" @click="pageEvent(1)">搜索</Button>
        <!-- <Button type="success" @click="isShowAdd = true">新增</Button> -->
      </div>
      
    </div>

    <div ref="tenderDataManageTable" class="tenderDataManage_table">
      <Table border :columns="columnList" :data="tableData" :max-height="tableHeight"></Table>
      <div class="tenderDataManage_page">
        <Page :total="total" :current="form.pageNum" :page-size="form.pageSize" @on-change="pageEvent" />
      </div>
    </div>

    <comm-loading v-if="isLoading"></comm-loading>
    <tender-detail v-if="isShowDetal" :tenderInfo="tenderInfo" @closeDialog="isShowDetal = false"></tender-detail>
    <add-tender v-if="isShowAdd" @addSuccess="getList()"  @closeDialog="isShowAdd = false"></add-tender>
  </div>
</template>

<script>
import TenderDetail from './tendeerDetail';
import AddTender from './addTender';

export default {
  props: {},

  components: {TenderDetail, AddTender},

  data () {
    return {
      isLoading: false,
      isShowDetal: false,
      isShowAdd: false,
      isRoleOnly: false,
      isRoleJinLi: false,
      tenderInfo: null,
      form: {
        proId: '',
        tendersId: '',
        type: '全部',
        pageNum: 1,
        pageSize: 20
      },
      projectList: [],
      tenderList: [],
      typeList: ['全部', '开工资料', '过程资料', '竣工资料', '付款资料', '验收资料'],
      total: 0,
      tableHeight: 180,
      tableData: [],
      columnList: [
        {
          key: '',
          title: '编号',
          width: 80,
          align: 'center',
          render: (h, params) => {
            return h('span', params.index + 1);
          }
        },
        {key: 'gmtCreate', title: '发布时间', minWidth: 120, align: 'center'},
        {key: 'tiltle', title: '标题', minWidth: 120, align: 'center'},
        {key: 'type', title: '类型', minWidth: 60, align: 'center'},
        {key: 'remark', title: '描述', minWidth: 120, align: 'center'},
        {
          key: '',
          title: '操作',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'primary'
              },
              on: {
                click: () => {
                  this.isShowDetal = true;
                  this.tenderInfo = params.row;
                }
              }
            }, '查看');
          }
        }
      ]
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
    this.getList();
    this.getProjectList();
    this.getTenderList();
    // this.getTypeList();
  },

  mounted () {
    this.tableHeight = this.$refs.tenderDataManageTable.clientHeight - 80;
  },

  methods: {
    // 获取所有的类型
    getTypeList () {
      window.$axios.get({url:'/notice/getAllNoticeType'}).then(res => {
        if (res.data) {
          this.typeList = ['全部', ...res.data] || [];
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

    proChangeEvent () {
      this.getTenderList();
      this.form.tendersId = '';
      this.form.type = '全部';
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

    getList () {
      let params = {
        date: this.$formatDate(this.form.date) || '',
        proId: this.form.proId || '',
        tendersId: this.form.tendersId || '',
        type: this.form.type === '全部' ? '' : this.form.type,
        pageNum: this.form.pageNum,
        pageSize: this.form.pageSize
      };
      this.isLoading = true;
      window.$axios.get({url:'/tendersData/listTendersData', params}).then(res => {
        this.isLoading = false;
        if (res.data) {
          this.tableData = res.data.dataList || [];
          this.total = res.data.total || 0;
        }
      }).catch((error) => {
        this.$Message.error(error.message);
        // this.tableData = [];
        this.isLoading = false;
      });
    },

    pageEvent (val) {
      this.form.pageNum = val;
      this.getList();
    }
  }
};
</script>

<style lang='scss'>
  @import './index.scss';
</style>