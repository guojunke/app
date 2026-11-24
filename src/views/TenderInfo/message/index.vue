<template>
    <div class="message">
        
        <div class="message_header">
            <h4>
                <span></span>
                通知单列表
            </h4>
            <div class="message_header_right">
                通知单共计：
                <span>{{total}}</span>
                质量通知单：
                <span>{{messageCount[0] || 0}}</span>
                安全通知单：
                <span>{{messageCount[1] || 0}}</span>
                其他通知单：
                <span>{{messageCount[2] || 0}}</span>
            </div>
        </div>
        

        <div class="message_table">
            <Table :columns="columnList" :data="tableData"></Table>
            <div class="message_page">
                <Page :total="total" :current="form.pageNum" :page-size="form.pageSize" @on-change="pageEvent" />
            </div>
        </div>

        <notify-detail v-if="isShowDetail" title="通知单信息" :notifyInfo="notifyInfo" @closeDialog="isShowDetail = false"></notify-detail>

    </div>
</template>

<script>
import NotifyDetail from './notifyDetail';
export default {
  props: {
    proData: {
      default: () => {}
    }
  },
  components: {NotifyDetail},
  data () {
    return {
      isShowDetail: false,
      messageCount: [0, 0, 0],
      form: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
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
              class: params.row.type === '安全通知单' ? 'message_color_2' : (params.row.type === '质量通知单' ? 'message_color_3' : (params.row.type === '其他通知单' ? 'message_color_4' : ''))
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
              class: params.row.result === 'new' ? '' : (params.row.result === 'pass' ? 'message_color_green' : (params.row.result === 'reject' ? 'message_color_red' : ''))
            }, params.row.result === 'new' ? '未结束' : (params.row.result === 'running' ? '进行中' : (params.row.result === 'pass' ? '通过' : '已驳回')));
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
              class: 'marginRight',
              on: {
                click: () => {
                  this.notifyInfo = params.row;
                  this.isShowDetail = true;
                }
              }
            }, '查看'));
            if ((params.row.result === 'new' || params.row.result === 'running') && this.$store.state.userInfo.roleName === '施工单位') {
              arr.push(h('Upload', {
                props: {
                  action: '#',
                  'before-upload': (file) => {
                    // console.log(file);
                    this.updateSataus(params.row, 'running', file);
                    return false;
                  }
                },
                style: {
                  display: 'inline-block'
                }
              }, [
                h('Button', {
                  props: {
                    type: 'success'
                  },
                  class: 'marginRight',
                  on: {
                    click: () => {
                      // this.updateSataus(params.row, 'finish');
                    }
                  }
                }, params.row.result === 'new' ? '上传回执' : '重新上传')
              ]));
            }
            if ((params.row.result === 'new' || params.row.result === 'running') && this.$store.state.userInfo.roleName === '监理') {
              arr.push(h('Button', {
                props: {
                  type: 'success'
                },
                class: 'marginRight',
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
                class: 'marginRight',
                on: {
                  click: () => {
                    this.updateSataus(params.row, 'reject');
                  }
                }
              }, '驳回'));
            }
            if (params.row.result === 'reject' && this.$store.state.userInfo.roleName === '施工单位') {
              arr.push(h('Upload', {
                props: {
                  action: '#',
                  'before-upload': (file) => {
                    // console.log(file);
                    this.updateSataus(params.row, 'running', file);
                    return false;
                  }
                },
                style: {
                  display: 'inline-block'
                }
              }, [
                h('Button', {
                  props: {
                    type: 'success'
                  },
                  class: 'marginRight',
                  on: {
                    click: () => {
                      // this.updateSataus(params.row, 'finish');
                    }
                  }
                }, '上传回执')
              ]));
            }
            return h('div', arr);
          }
        }
      ]
    };
  },

  created () {
    this.getList();
    this.getCount();
  },

  methods: {
    getList () {
      let params = {
        proId: this.proData.proId,
        tendersId: this.proData.tendersId,
        type: '',
        pageNum: this.form.pageNum,
        pageSize: this.form.pageSize
      };
      this.isLoading = true;
      window.$axios.get({url: '/notice/listNotice', params}).then(res => {
        this.isLoading = false;
        if (res.data) {
          this.tableData = res.data.dataList || [];
          this.total = res.data.total;
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

    getCount () {
      // notice/getNoticeCount
      let params = {
        proId: this.proData.proId,
        tendersId: this.proData.tendersId,
      };
      this.isLoading = true;
      window.$axios.get({url: '/notice/getNoticeCount', params}).then(res => {
        this.isLoading = false;
        // this.messageCount = res.data.noticeCountVoList || [];
        res.data.noticeCountVoList && res.data.noticeCountVoList.forEach(item => {
          if (item.noticeType === '质量通知单') this.messageCount.splice(0, 1, item.count);
          if (item.noticeType === '安全通知单') this.messageCount.splice(1, 1, item.count);
          if (item.noticeType === '其他通知单') this.messageCount.splice(2, 1, item.count);
        });
        console.log(this.messageCount);
      }).catch(error => {
        this.isLoading = false;
        this.$Message.error(error.message);
      });
    },

    updateSataus (obj, type, file) {
      const params = Object.assign({}, obj);
      params.result = type;
      let formData = new FormData();
      // Object.keys(params).forEach(key => {
      //   formData.append(key, params[key]);
      // });
      formData.append('id', params.id);
      formData.append('proId', params.proId);
      formData.append('tendersId', params.tendersId);
      if (params.proTypeId) formData.append('proTypeId', params.proTypeId);
      formData.append('roleId', this.$store.state.userInfo.roleId);
      formData.append('result', params.result);
      if (file) {
        formData.append('file', file);
      }
      this.isLoading = true;
      window.$axios.post('/notice/update', formData).then(res => {
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

<style lang="scss">
@import './index';
</style>
