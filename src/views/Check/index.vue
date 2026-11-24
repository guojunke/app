<template>
  <div class="checkManage">

    <div class="checkManage_search">
      <div class="checkManage_search_item">
        发布时间：
        <DatePicker v-model="form.gmtCreate" type="date" placeholder="请选择" :editable="false"
          style="width: 1.3rem"></DatePicker>
      </div>
      <div class="checkManage_search_item">
        项目区：
        <Select v-model="form.proId" :clearable="true" :disabled="isRoleOnly || isRoleJinLi" style="width: 1.3rem" @on-change="proChangeEvent">
          <Option v-for="(item, index) in projectList" :value="parseInt(item.id)" :key="index">{{ item.projectName }}</Option>
        </Select>
      </div>

      <div class="checkManage_search_item">
        标段：
        <Select v-model="form.tendersId" :clearable="true" :disabled="isRoleOnly" style="width:1.3rem" @on-change="getTypeList">
          <Option v-for="(item, index) in tenderList" :value="item.id" :key="index">{{ item.tenderName || '--'}}</Option>
        </Select>
      </div>

      <div class="location_serach_item">
        类型：
        <Select v-model="form.proTypeId" style="width: 1.3rem;margin-right: .2rem;">
          <Option v-for="(item, index) in typeList" :value="item.id" :key="index">{{ item.name }}</Option>
        </Select>
      </div>

      <Button type="primary" @click="getList()">搜索</Button>
      <Button v-if="$store.state.userInfo.roleName === '施工单位'" type="primary" style="margin-left: .12rem;"
        @click="addEvent()">新增</Button>
    </div>

    <div ref="checkManageTable" class="checkManage_table">
      <Table :columns="columnList" :data="tableData" :max-height="tableHeight"></Table>
      <div class="checkManage_page">
        <Page :total="total" :current="form.pageNum" :page-size="form.pageSize" @on-change="pageEvent" />
      </div>
    </div>
    
    <check-detail v-if="isShowDetail" :checkInfo="checkInfo"
      @closeDialog="isShowDetail = false" @successUpdate="getList()"></check-detail>

    <check-reject v-if="isShowReject" :checkInfo="checkInfo" :isLook="isLook"
      @closeDialog="isShowReject = false" @successUpdate="getList()"></check-reject>
    
    <add-check v-if="isShowAdd" :editData="editData" @closeDialog="isShowAdd = false" @successUpdate="getList()"></add-check>

    <comm-loading v-if="isLoading"></comm-loading>
  </div>
</template>

<script>
import CheckDetail from './checkDetail/index';
import CheckReject from './checkReject';
import AddCheck from './addCheck';

export default {
  props: {},

  components: {CheckDetail, CheckReject, AddCheck},

  data () {
    return {
      isLoading: false,
      isRoleOnly: false,
      isRoleJinLi: false,
      isShowAdd: false,
      editData: null,
      form:{
        proId: '',
        proTypeId: '',
        tendersId: '',
        gmtCreate: '',
        pageNum: 1,
        pageSize: 20
      },
      isLook: false,
      checkInfo: {},
      isShowDetail: false,
      isShowReject: false,
      projectList: [],
      tenderList: [],
      typeList: [],
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

  created () {
    if (this.$store.state.userInfo.roleName === '施工单位') {
      this.form.proId = this.$store.state.userInfo.projectId;
      this.form.tendersId = this.$store.state.userInfo.tenderId;
      this.isRoleOnly = true;
      this.getTypeList();
    } else if (this.$store.state.userInfo.roleName === '监理') {
      this.form.proId = this.$store.state.userInfo.projectId;
      this.isRoleJinLi = true;
    }
    this.getProjectList();
    this.getTenderList();
    this.getList();
    // this.getTypeList();
  },

  mounted () {
    // console.log(this.$refs.userManageTable.clientHeight);
    this.tableHeight = this.$refs.checkManageTable.clientHeight - 80;
  },

  methods: {
    // 获取类型列表
    getTypeList () {
      let params = {
        proId: this.form.proId,
        tendersId: this.form.tendersId
      };
      window.$axios.get({url: '/projectType/getProTypeDataByTendersId', params}).then(res => {
        if (res.data) {
          this.typeList = res.data || [];
        }
      }).catch(error => {
        this.$Message.error(error.message);
      });
    },
    // 获取所有项目区
    getProjectList () {
      window.$axios.get({url: '/project/getProjectList'}).then(res => {
        if (res.data) {
          this.projectList = [{id: 0, projectName: '全部'}, ...(res.data || [])];
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
      this.form.type = '';
    },

    // 获取所有的标段
    getTenderList () {
      let params = {
        proId: this.form.proId
      };
      window.$axios.get({url:'/tender/getTendersList', params}).then(res => {
        if (res.data) {
          this.tenderList = [{id: 0, tenderName: '全部'}, ...(res.data || [])];
        }
      }).catch(error => {
        this.$Message.error(error.message);
      });
    },
    
    getList () {
      let params = {
        proId: this.form.proId,
        tendersId: this.form.tendersId,
        proTypeId: this.form.proTypeId,
        pageNum: this.form.pageNum,
        pageSize: this.form.pageSize,
        date: this.$formatDate(this.form.gmtCreate) || ''
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

    addEvent () {
      this.isShowAdd = true;
      this.editData = null;
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