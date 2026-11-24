<template>
  <div class="proInfo">

    <div class="proInfo_header">
      <Button @click="$router.go(-1)">返回</Button>
      <h3 class="">
        {{proData.projectName}}
        工程量统计
      </h3>
    </div>

    <pie-list :proData="proData"></pie-list>
    <pro-static :proData="proData"></pro-static>
  </div>
</template>

<script>
import PieList from './pieList';
import ProStatic from './proStatic';

export default {
  data () {
    return {
      proData: JSON.parse(sessionStorage.getItem('homeProData'))
    };
  },

  components: {
    PieList, ProStatic
  },

  created () {
    
  },

  methods: {
    
  }
};
</script>

<style lang="scss">
@import './index';
</style>
