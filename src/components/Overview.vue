<template>
  <div>
    <WorklogList />
  </div>
</template>

<script>
import WorklogList from "./WorklogList.vue";

export default {
  name: "Overview",
  components: {
    WorklogList
  },
  data() {
    return {
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
