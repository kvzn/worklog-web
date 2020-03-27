<template>
  <div class="container bg-white p-2 p-sm-5">
    <div class="row justify-content-md-center">
      <div class="col-12">
        <h2 class="my-3 font-weight-bold">今日日志</h2>
        <form action method="post" enctype="multipart/form-data">
          <div class="row">
            <div class="form-group col-12 col-sm-6">
              <label>① 工作内容:</label>
              <textarea
                name="field"
                class="form-control"
                rows="8"
                minlength="10"
                maxlength="500"
                required
                v-model="field"
              ></textarea>
            </div>
            <div class="form-group col-12 col-sm-6">
              <label>② 工作进展:</label>
              <textarea
                name="field"
                class="form-control"
                rows="8"
                minlength="10"
                maxlength="500"
                required
                v-model="field"
              ></textarea>
            </div>
            <div class="form-group col-12 col-sm-6">
              <label>③ 遇到的问题:</label>
              <textarea
                name="field"
                class="form-control"
                rows="8"
                minlength="10"
                maxlength="500"
                required
              ></textarea>
            </div>
            <div class="form-group col-12 col-sm-6">
              <label>④ 后续计划:</label>
              <textarea
                name="field"
                class="form-control"
                rows="8"
                minlength="10"
                maxlength="500"
                required
              ></textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-12 d-flex flex-row justify-content-end">
              <button
                type="submit"
                class="btn btn-primary px-5"
                v-on:click.stop.prevent="submit()"
              >提交</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WorkLogForm",
  data() {
    return {
      scriptId: this.$route.params.id,
      script: {
        field: null
      }
    };
  },
  created() {
    if (this.scriptId) {
      this.getScript(this.scriptId);
    }
  },
  methods: {
    getScript(id) {
      const self = this;

      self.$store.commit("setShowLoading", true);

      self.$http
        .get(`/scripts/${id}`)
        .then(function(response) {
          self.script = response.data;
          self.script.fitScreenSizes = self.script.fitScreenSizes.split(",");
        })
        .catch(function(error) {
          self.$notify({ group: "main", type: "error", text: error });
        })
        .finally(() => {
          self.$store.commit("setShowLoading", false);
        });
    },
    submit() {
      const self = this;

      self.$store.commit("setShowLoading", true);

      let process = null;
      if (self.scriptId) {
        process = self.$http.put(`/scripts/${self.scriptId}`, self.script);
      } else {
        process = self.$http.post(`/scripts`, self.script);
      }

      process
        .then(function(response) {
          var respObj = response.data;
          if (respObj.status == "success") {
            self.$router.push({ path: "/scripts" });
            self.$notify({
              group: "main",
              type: "success",
              text: "Successful!"
            });
          } else {
            self.$notify({
              group: "main",
              type: "error",
              text: respObj.payload
            });
          }
        })
        .catch(function(error) {
          self.$notify({ group: "main", type: "error", text: error });
        })
        .finally(() => {
          self.$store.commit("setShowLoading", false);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>

