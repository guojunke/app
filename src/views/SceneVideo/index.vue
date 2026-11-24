<template>
  <div class="scenceVideo">

    <div class="scenceVideo_search">
      <div class="scenceVideo_search_item">
        发布时间：
        <DatePicker v-model="form.gmtCreate" type="date" placeholder="请选择"
          @on-change="getList()" style="width: 2rem"></DatePicker>
      </div>
    </div>

    <div ref="scenceVideoTable" class="scenceVideo_table">
      <Table :columns="columnList" :data="tableData" :max-height="tableHeight"></Table>
      <div class="scenceVideo_page">
        <Page :total="total" :current="form.pageNum" :page-size="form.pageSize" @on-change="pageEvent" />
      </div>
    </div>
    
    <video-detail v-if="isShowDetail" :videoInfo="videoInfo" @closeDialog="isShowDetail = false"></video-detail>

    <comm-loading v-if="isLoading"></comm-loading>
  </div>
</template>

<script>
import VideoDetail from './videoDetail/index';
export default {
  props: {},

  components: {VideoDetail},

  data () {
    return {
      isLoading: false,
      form:{
        gmtCreate: '',
        pageNum: 1,
        pageSize: 20
      },
      videoInfo: {},
      isShowDetail: false,
      tableHeight: 0,
      total: 0,
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
        {key: 'gmtCreate', title: '发布时间', minWidth: 100, align: 'center'},
        {key: 'tiltle', title: '标题', minWidth: 100, align: 'center'},
        {key: 'type', title: '类型', minWidth: 100, align: 'center'},
        {key: 'remark', title: '描述', minWidth: 100, align: 'center'},
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
                  this.isShowDetail = true;
                  this.videoInfo = params.row;
                }
              }
            }, '查看');
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
    this.tableHeight = this.$refs.scenceVideoTable.clientHeight - 80;
  },

  methods: {
    getList () {
      let params = {
        pageNum: this.form.pageNum,
        pageSize: this.form.pageSize,
        date: this.$formatDate(this.form.gmtCreate) || ''
      };
      this.isLoading = true;
      window.$axios.get({url: '/video/listVideoData', params}).then(res => {
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
    }
  }
};
</script>

<style lang='scss'>
  @import './index.scss';
</style>