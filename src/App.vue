<template>
  <div id="app">
    <Navbar class="top mb-3" />
    <div class="my-2 my-sm-4">
      <router-view></router-view>
    </div>
    <Footer />
    <div v-if="showLoading" class="loading">
      <bounce-loader />
    </div>
    <notifications group="main" position="bottom right" />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import BounceLoader from "vue-spinner/src/BounceLoader.vue";
import { mapGetters } from "vuex";

import { router } from "./router";

export default {
  name: "app",
  router,
  components: {
    Navbar,
    Footer,
    BounceLoader
  },
  computed: {
    ...mapGetters({
      showLoading: "getShowLoading"
    })
  }
};
</script>

<style lang="scss" scoped>
.loading {
  z-index: 1000;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 0;
  min-width: 500px;
}
</style>
