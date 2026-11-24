<template>
  <comm-dialog title="通知单" :styleData="{width: '7rem'}" @closeDialog="$emit('closeDialog')">
    <div class="notifyList" slot="container">

      <div ref="notifyListTable" class="notifyList_table">
        <Table :columns="columnList" :data="tableData" :max-height="tableHeight"></Table>
        <div class="notifyList_page">
          <Page :total="total" :current="form.pageNum" :page-size="form.pageSize" @on-change="pageEvent" />
        </div>
      </div>

      <comm-loading v-if="isLoading"></comm-loading>
    </div>
  </comm-dialog>
  
</template>

<script>

export default {
  props: {
    notifyData: {
      default: () => {}
    }
  },

  data () {
    return {
      isLoading: false,
      isShowDetail: false,
      notifyInfo: null,
      total: 0,
      form: {
        proId: '',
        tendersId: '',
        type: '',
        pageNum: 1,
        pageSize: 20
      },
      typeList: [],
      projectList: [],
      tenderList: [],
      tableHeight: 180,
      tableData: [],
      columnList: [
        {
          key: '',
          title: '编号',
          minWidth: 86,
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.num);
          }
        },
        {key: 'projectName', title: '项目区', minWidth: 100, align: 'center'},
        {key: 'tenderName', title: '标段', minWidth: 100, align: 'center'},
        {
          key: 'type',
          title: '通知单类型',
          minWidth: 100,
          align: 'center',
          render: (h, params) => {
            return h('span', {
              class: params.row.type === '安全通知单' ? 'notifuManage_color_2' : (params.row.type === '质量通知单' ? 'notifuManage_color_3' : (params.row.type === '其他通知单' ? 'notifuManage_color_4' : ''))
            }, params.row.type);
          }
        },
        {key: 'content', title: '通知单描述', minWidth: 100, align: 'center'},
        {
          key: 'type',
          title: '状态',
          minWidth: 80,
          align: 'center',
          render: (h, params) => {
            return h('span', {
              class: params.row.result === 'new' ? '' : 'notifuManage_color_1'
            }, params.row.result === 'new' ? '未结束' : (params.row.result === 'running' ? '进行中' : (params.row.result === 'pass' ? '通过' : '已结束')));
          }
        }
      ]
    };
  },

  created () {
    this.getList();
  },

  mounted () {
    // console.log(this.$refs.userManageTable.clientHeight);
    this.tableHeight = this.$refs.notifyListTable.clientHeight - 10;
  },

  methods: {
    // 获取所有的类型
    getTypeList () {
      window.$axios.get({url:'/notice/getAllNoticeType'}).then(res => {
        if (res.data) {
          this.typeList = ['全部', ...res.data];
        }
      }).catch(error => {
        this.$Message.error(error.message);
      });
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

    proChangeEvent () {
      this.getTenderList();
      this.form.tendersId = '';
      this.form.type = '';
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

    getList () {
      let params = {
        proId: this.notifyData && this.notifyData.proId,
        tendersId: this.notifyData && this.notifyData.id,
        // proTypeId: this.notifyData && this.notifyData.proTypeId,
        type: this.notifyData && this.notifyData.type,
        standards: this.notifyData && this.notifyData.standards,
        pageNum: this.form.pageNum,
        pageSize: this.form.pageSize
      };
      console.log(this.notifyData);
      this.isLoading = true;
      window.$axios.get({url: '/notice/listNoticeByProType', params}).then(res => {
        this.isLoading = false;
        console.log(res.data);
        if (res.data) {
          // this.tableData = res.data.dataList || [];
          this.tableData = res.data.dataList || [];
          this.total = res.data.total;
        }
      }).catch(error => {
        this.isLoading = false;
        this.$Message.error(error.message);
      });
    },

    deleteEvent (id) {
      this.isLoading = true;
      console.log(id);
      window.$axios.post('/notice/delete', {id: id}).then(res => {
        this.getList();
      }).catch(error => {
        this.isLoading = false;
        this.$Message.error(error.message);
      });
    },

    pageEvent (val) {
      this.form.pageNum = val;
      this.getList();
    },

    updateSataus (obj, type) {
      // const params = {
      //   id: obj.id,
      //   proId: obj.proId,
      //   tendersId: obj.tendersId,
      //   proTypeId: obj.proTypeId,
      //   type: obj.type,
      //   result: type
      // };
      const params = Object.assign({}, obj);
      params.result = type;
      this.isLoading = true;
      window.$axios.post('/notice/update', params).then(res => {
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