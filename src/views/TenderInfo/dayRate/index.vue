<template>
    <div class="dayRate">
        
        <div class="dayRate_header">
            <h4>
                <span></span>
                日进度报告
            </h4>
            <!-- <div class="dayRate_header_right">
                通知单共计：
                <span>30</span>
                质量通知单：
                <span>30</span>
                安全通知单：
                <span>30</span>
                一般通知单：
                <span>30</span>
            </div> -->
        </div>
        

        <div class="dayRate_table">
            <Table :columns="columnList" :data="tableData"></Table>
            <div class="dayRate_page">
                <Page :total="total" :current="form.pageNum" :page-size="form.pageSize" @on-change="pageEvent" />
            </div>
        </div>

        <rate-info v-if="isShowInfo" :rateInfo="rateInfo"
            @closeDialog="isShowInfo = false"></rate-info>
    </div>
</template>

<script>
import RateInfo from './rateInfo';
export default {
  props: {
    proData: {
      default: () => {}
    }
  },
  components: {RateInfo},
    
  data () {
    return {
      isShowInfo: false,
      form: {
        pageNum: 1,
        pageSize: 10
      },
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
    this.getList();
  },
  methods: {
    getList () {
      let params = {
        proId: this.proData.proId,
        tendersId: this.proData.tendersId,
        pageNum: this.form.pageNum,
        pageSize: this.form.pageSize
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
    }
  }
};
</script>

<style lang="scss">
@import './index';
</style>
