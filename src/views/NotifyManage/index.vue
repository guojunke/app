<template>
  <div class="notifyManage">
    <div class="notifyManage_serach">

      <div class="notifyManage_serach_item">
        项目区：
        <Select v-model="form.proId" :clearable="true" :disabled="isRoleOnly || isRoleJinLi" style="width: 1.5rem" @on-change="proChangeEvent">
          <Option v-for="(item, index) in projectList" :value="parseInt(item.id)" :key="index">{{ item.projectName }}</Option>
        </Select>
      </div>

      <div class="notifyManage_serach_item">
        标段：
        <Select v-model="form.tendersId" :clearable="true" :disabled="isRoleOnly" style="width:1.5rem" @on-change="form.type = ''">
          <Option v-for="(item, index) in tenderList" :value="item.id" :key="index">{{ item.tenderName || '--'}}</Option>
        </Select>
      </div>

      <div class="notifyManage_serach_item">
        类型：
        <Select v-model="form.type" :clearable="true" style="width: 1.5rem">
          <Option v-for="(item, index) in typeList" :value="item" :key="index">{{ item }}</Option>
        </Select>
      </div>
      <div class="notifyManage_serach_item">
        <Button type="primary" @click="pageEvent(1)">搜索</Button>
      </div>
      <div class="notifyManage_serach_item" v-if="$store.state.userInfo.roleName === '监理'">
        <Button type="primary" @click="isShowAdd = true">新增通知单</Button>
      </div>
      
    </div>

    <div ref="notifyManageTable" class="notifyManage_table">
      <Table :columns="columnList" :data="tableData" :max-height="tableHeight"></Table>
      <div class="notifyManage_page">
        <Page :total="total" :current="form.pageNum" :page-size="form.pageSize" @on-change="pageEvent" />
      </div>
    </div>

    <comm-loading v-if="isLoading"></comm-loading>
    <notify-detail v-if="isShowDetail" title="通知单信息" :notifyInfo="notifyInfo" @closeDialog="isShowDetail = false"></notify-detail>
    <add-notify v-if="isShowAdd" @closeDialog="isShowAdd = false" @addSuccess="getList()"></add-notify>
    <reject-notify v-if="isShowReject" title="驳回通知单" :notifyInfo="notifyInfo"
      @closeSuccess="getList()" @closeDialog="isShowReject = false"></reject-notify>
  </div>
</template>

<script>
import NotifyDetail from './notifyDetail';
import AddNotify from './addNotify/index';
import RejectNotify from './rejectNotify';

export default {
  props: {},

  components: {NotifyDetail, AddNotify, RejectNotify},

  data () {
    return {
      isLoading: false,
      isShowDetail: false,
      isShowAdd: false,
      isShowReject: false,
      isRoleOnly: false,
      isRoleJinLi: false,
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
          width: 300,
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
                    this.isShowReject = true;
                    this.notifyInfo = params.row;
                    // this.updateSataus(params.row, 'reject');
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
    this.getTypeList();
  },

  mounted () {
    // console.log(this.$refs.userManageTable.clientHeight);
    this.tableHeight = this.$refs.notifyManageTable.clientHeight - 80;
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
        proId: this.form.proId,
        tendersId: this.form.tendersId,
        type: this.form.type === '全部' ? '' : this.form.type,
        pageNum: this.form.pageNum,
        pageSize: this.form.pageSize
      };
      this.isLoading = true;
      window.$axios.get({url: '/notice/listNotice', params}).then(res => {
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

<style lang='scss'>
  @import './index.scss';
</style>