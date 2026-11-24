<template>
    <div class="tender">
        
        <div class="tender_header">
            <h4>
                <span></span>
                标段资料
            </h4>
        </div>
        

        <div class="tender_table">
            <Table :columns="columnList" :data="tableData"></Table>
            <div class="tender_page">
                <Page :total="total" :current="form.pageNum" :page-size="form.pageSize" @on-change="pageEvent" />
            </div>
        </div>
        
      <tender-detail v-if="isShowDetal" :tenderInfo="tenderInfo" @closeDialog="isShowDetal = false"></tender-detail>
    </div>
</template>

<script>
import TenderDetail from './tendeerDetail';
export default {
  props: {
    proData: {
      default: () => {}
    }
  },
  components: {TenderDetail},

  data () {
    return {
      isShowDetal: false,
      tenderInfo: {},
      form: {
        pageNum: 1,
        pageSize: 20
      },
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
    this.getList();
  },

  methods: {
    getList () {
      let params = {
        proId: this.proData.proId || '',
        tendersId: this.proData.tendersId || '',
        pageNum: this.form.pageNum,
        pageSize: this.form.pageSize
      };
      this.isLoading = true;
      window.$axios.get({url:'/tendersData/listTendersData', params}).then(res => {
        this.isLoading = false;
        console.log(res.data);
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

    }
  }
};
</script>

<style lang="scss">
@import './index';
</style>
