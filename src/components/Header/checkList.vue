<template>
  <comm-dialog title="报验预约" :styleData="{width: '9rem', 'z-index': 99}" @closeDialog="$emit('closeDialog')">
    <div slot="container" class="notifyManage_table">
      <Table :columns="columnList" :data="checkList" :max-height="400"></Table>

      
    
    <check-detail v-if="isShowDetail" :checkInfo="checkInfo"
      @closeDialog="isShowDetail = false" @successUpdate="$emit('successBack')"></check-detail>

    <check-reject v-if="isShowReject" :checkInfo="checkInfo" :isLook="isLook"
      @closeDialog="isShowReject = false" @successUpdate="$emit('successBack')"></check-reject>
    
    <add-check v-if="isShowAdd" :editData="editData" @closeDialog="isShowAdd = false" @successUpdate="$emit('successBack')"></add-check>
    </div>
  </comm-dialog>
</template>

<script>
import CheckDetail from './../../views/Check/checkDetail/index';
import CheckReject from './../../views/Check/checkReject';
import AddCheck from './../../views/Check/addCheck';
export default {
  props: {
    checkList: {
      default: () => []
    }
  },

  components: {CheckDetail, CheckReject, AddCheck},

  data () {
    return {
      isShowDetail: false,
      isShowReject: false,
      isShowAdd: false,
      isLook: false,
      checkInfo: {},
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
        // {key: 'projectName', title: '项目区', minWidth: 90, align: 'center'},
        {key: 'tenderName', title: '标段', minWidth: 90, align: 'center'},
        {key: 'proTypeName', title: '工程种类', minWidth: 90, align: 'center'},
        {key: 'content', title: '报验内容', minWidth: 100, align: 'center'},
        {
          key: 'remark',
          title: '到场时间',
          minWidth: 100,
          align: 'center',
          render: (h, params) => {
            const arr = [];
            if (params.row.result === 'pass') {
              arr.push(h('span'), '已通过');
            } else if (params.row.result === 'reject') {
              arr.push(h('span'), '已驳回');
            } else if (params.row.result === 'new') {
              arr.push(h('span'), '处理中');
            } else {
              arr.push(h('span'), params.row.resultTime);
            }
            return h('div', {
              class: params.row.result === 'pass' ? 'checkManage_green' : (params.row.result === 'reject' ? 'checkManage_red' : '')
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
            if (params.row.result === 'new' && this.$store.state.userInfo.roleName === '监理') {
              arr.push(h('Button', {
                props: {
                  type: 'success'
                },
                style: {margin: '0 .1rem'},
                on: {
                  click: () => {
                    this.isShowDetail = true;
                    this.checkInfo = params.row;
                  }
                }
              }, '到场时间'));
              arr.push(h('Button', {
                props: {
                  type: 'error'
                },
                on: {
                  click: () => {
                    this.isShowReject = true;
                    this.isLook = false;
                    this.checkInfo = params.row;
                  }
                }
              }, '驳回'));
            } else if ((params.row.result === 'new' || params.row.result === 'confirm') && this.$store.state.userInfo.roleName === '监理') {
              arr.push(h('Button', {
                props: {
                  type: 'success'
                },
                style: {margin: '0 .1rem'},
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '温馨提醒',
                      content: '确定通过该预约？',
                      onOk: () => {
                        this.updateSataus(params.row, 'pass');
                      }
                    });
                    // this.updateSataus(params.row, 'pass');
                  }
                }
              }, '通过'));
              if (params.row.result === 'new' || params.row.result === 'confirm') {
                arr.push(h('Button', {
                  props: {
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.isShowReject = true;
                      this.isLook = false;
                      this.checkInfo = params.row;
                    }
                  }
                }, '驳回'));
              }
              
            } else if (params.row.result === 'pass' && this.$store.state.userInfo.roleName !== '施工单位') {
              arr.push(h('Button', {
                props: {
                  type: 'success',
                  disabled: true
                },
              }, '已通过'));
            } else if (params.row.result === 'reject' && this.$store.state.userInfo.roleName !== '施工单位') {
              arr.push(h('Button', {
                props: {
                  type: 'primary'
                },
                style: {margin: '0 .1rem'},
                on: {
                  click: () => {
                    this.isShowReject = true;
                    this.isLook = true;
                    this.checkInfo = params.row;
                    this.updateStatus(params.row.id);
                  }
                }
              }, '查看'));
              arr.push(h('Button', {
                props: {
                  type: 'success',
                  disabled: true
                },
              }, '已驳回'));
            }
            if (this.$store.state.userInfo.roleName === '施工单位') {
              arr.push(h('Button', {
                props: {
                  type: 'primary',
                  disabled: params.row.result === 'pass'
                },
                on: {
                  click: () => {
                    this.isShowAdd = true;
                    this.editData = params.row;
                  }
                }
              }, '重新预约'));
            }
              
            return h('div', arr);
          }
        }
      ]
    };
  },

  created () {},

  methods: {
    updateStatus (id) {
      const params = {
        id: id,
        roleId: this.$store.state.userInfo.roleId
      };
      window.$axios.post('appointment/updateConfirm', params).then(res => {
        console.log(res);
      });
    }
  }
};
</script>

<style lang=''>
  /* @import url(''); */
</style>