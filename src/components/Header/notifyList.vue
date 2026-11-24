<template>
  <comm-dialog title="通知单" :styleData="{width: '9rem'}" @closeDialog="$emit('closeDialog')">
    <div slot="container" class="notifyManage_table">
      <Table :columns="columnList" :data="notifyList" :max-height="400"></Table>

      
    <notify-detail v-if="isShowDetail" :isLookBack="true" title="通知单信息" :notifyInfo="notifyInfo" @closeDialog="isShowDetail = false"></notify-detail>
    </div>
  </comm-dialog>
</template>

<script>
import NotifyDetail from './../../views/NotifyManage/notifyDetail';
export default {
  props: {
    notifyList: {
      default: () => []
    }
  },

  components: {NotifyDetail},

  data () {
    return {
      isShowDetail: false,
      notifyInfo: {},
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
        {key: 'gmtCreate', title: '创建时间', width: 92, align: 'center'},
        {key: 'projectName', title: '项目区', minWidth: 100, align: 'center'},
        {key: 'tenderName', title: '标段', minWidth: 100, align: 'center'},
        {
          key: 'type',
          title: '通知单类型',
          minWidth: 100,
          align: 'center',
          render: (h, params) => {
            return h('span', {
              // class: params.row.type === '安全通知单' ? 'notifuManage_color_2' : (params.row.type === '质量通知单' ? 'notifuManage_color_3' : (params.row.type === '一般通知单' ? 'notifuManage_color_4' : ''))
            }, params.row.type);
          }
        },
        {key: 'content', title: '通知单描述', minWidth: 100, align: 'center'},
        {
          key: 'type',
          title: '状态',
          minWidth: 90,
          align: 'center',
          render: (h, params) => {
            return h('span', {
              class: params.row.result === 'new' ? '' : (params.row.result === 'pass' ? 'notifuManage_color_green' : (params.row.result === 'reject' ? 'notifuManage_color_red' : ''))
            }, params.row.result === 'new' ? '待处理' : (params.row.result === 'running' ? '已上传回执' : (params.row.result === 'pass' ? '已通过' : '已驳回')));
          }
        },
        {
          key: '',
          title: '操作',
          width: 280,
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

  created () {},

  methods: {
    updateSataus (obj, type, file) {
      const params = Object.assign({}, obj);
      params.result = type;
      let formData = new FormData();
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
          this.$emit('successBack');
        }
      }).catch(() => {
        this.isLoading = false;
      });
    }
  }
};
</script>

<style lang=''>
  /* @import url(''); */
</style>