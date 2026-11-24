<template>
  <comm-dialog :styleData="{width: '8rem'}" title=" " @closeDialog="$emit('closeDialog')">
    <div slot="container" style="display: flex; align-item: center;justify-content: center;overflow: auto;padding-bottom: .1rem;">
      <img :src="imgUrl" alt="" style="width: 7rem">
    </div>
  </comm-dialog>
</template>

<script>
export default {
  props: {
    imgUrl: String
  },

  components: {},

  data () {
    return {

    };
  },

  created () {},

  methods: {}
};
</script>

<style lang=''>
  /* @import url(''); */
</style>