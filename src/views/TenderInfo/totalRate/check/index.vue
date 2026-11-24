<template>
  <comm-dialog title="工程报验" :styleData="{width: '7rem'}" @closeDialog="$emit('closeDialog')">
    <div class="checkManage" slot="container">

      <div ref="checkManageTable" class="checkManage_table">
        <Table :columns="columnList" :data="tableData" :max-height="tableHeight"></Table>
        
        <div class="checkManage_page">
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
    checkData: {
      default: () => {}
    }
  },

  data () {
    return {
      isLoading: false,
      form:{
        gmtCreate: '',
        pageNum: 1,
        pageSize: 20
      },
      checkInfo: {},
      isShowDetail: false,
      isShowReject: false,
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
        {key: 'gmtCreate', title: '报验时间', minWidth: 100, align: 'center'},
        {key: 'projectName', title: '项目区', minWidth: 90, align: 'center'},
        {key: 'tenderName', title: '标段', minWidth: 90, align: 'center'},
        {key: 'proTypeName', title: '工程名称', minWidth: 100, align: 'center'},
        {key: 'content', title: '报验内容', minWidth: 100, align: 'center'},
        {
          key: 'remark',
          title: '到场时间',
          minWidth: 100,
          align: 'center',
          render: (h, params) => {
            const arr = [];
            if (params.row.result === 'finished') {
              arr.push(h('span'), '已通过');
            } else if (params.row.result === 'reject') {
              arr.push(h('span'), '已驳回');
            } else if (params.row.result === 'new') {
              arr.push(h('span'), '处理中');
            } else {
              arr.push(h('span'), params.row.resultTime);
            }
            return h('div', {
              class: params.row.result === 'finished' ? 'checkManage_green' : (params.row.result === 'reject' ? 'checkManage_red' : '')
            }, arr);
          }
        }
      ]
    };
  },

  created () {
    this.getList();
    console.log(this.checkData);
  },

  mounted () {
    // console.log(this.$refs.userManageTable.clientHeight);
    this.tableHeight = this.$refs.checkManageTable.clientHeight - 80;
  },

  methods: {
    
    getList () {
      let params = {
        proId: this.checkData.projectId,
        tendersId: this.checkData.tendersId,
        proTypeId: this.checkData.id,
        type: this.checkData.type,
        pageNum: this.form.pageNum,
        pageSize: this.form.pageSize
      };
      this.isLoading = true;
      window.$axios.get({url: '/appointment/listAppointment', params}).then(res => {
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

    updateSataus (obj, type) {
      const params = {
        id: obj.id,
        proId: obj.proId,
        tendersId: obj.tendersId,
        result: type
      };
      this.isLoading = true;
      window.$axios.post('/appointment/update', params).then(res => {
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