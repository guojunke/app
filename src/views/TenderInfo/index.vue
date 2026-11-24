<template>
    <div class="tendetInfo">

        <div class="tendetInfo_header">
            <Button @click="$router.go(-1)">返回</Button>
            <h3 class="">
                {{proData.projectName}}
                --
                <span>{{proData.tenderName}}</span>
                工程量统计
            </h3>
        </div>

        <total-rate :proData="proData"></total-rate>
        <message-comm :proData="proData"></message-comm>
        <day-rate :proData="proData"></day-rate>
        <tender-list :proData="proData"></tender-list>
    </div>
</template>

<script>
import TotalRate from './totalRate/index';
import MessageComm from './message/index';
import DayRate from './dayRate/index';
import TenderList from './tender/index';

export default {
  data () {
    return {
      proData: JSON.parse(sessionStorage.getItem('homeProData'))
    };
  },

  components: {
    TotalRate, MessageComm, DayRate, TenderList
  },
  created () {
    // alert('进来了');
  }
};
</script>

<style lang="scss">
@import './index';
</style>
