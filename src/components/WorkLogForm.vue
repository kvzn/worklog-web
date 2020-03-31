<template>
  <div class="bg-white m-1 m-sm-2 m-md-4 p-1 p-sm-2 p-md-4">
    <div class="container-fluid">
      <div class="row justify-content-md-center">
        <div class="col-12">
          <h2 class="my-3 font-weight-bold">今日日志</h2>
          <b-overlay :show="showOverlay" rounded="lg">
            <form action method="post" enctype="multipart/form-data">
              <table class="table">
                <thead>
                  <th>#</th>
                  <th>工作内容</th>
                  <th>进展</th>
                  <th>遇到的问题</th>
                  <th>后续计划</th>
                  <th></th>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in items" :key="index">
                    <td>
                      <span>{{index+1}}</span>
                    </td>
                    <td>
                      <textarea
                        class="form-control"
                        rows="3"
                        minlength="10"
                        maxlength="500"
                        required
                        v-model="item[0]"
                      ></textarea>
                    </td>
                    <td>
                      <textarea
                        class="form-control"
                        rows="3"
                        minlength="10"
                        maxlength="500"
                        required
                        v-model="item[1]"
                      ></textarea>
                    </td>
                    <td>
                      <textarea
                        class="form-control"
                        rows="3"
                        minlength="10"
                        maxlength="500"
                        required
                        v-model="item[2]"
                      ></textarea>
                    </td>
                    <td>
                      <textarea
                        class="form-control"
                        rows="3"
                        minlength="10"
                        maxlength="500"
                        required
                        v-model="item[3]"
                      ></textarea>
                    </td>
                    <td>
                      <button
                        class="btn btn-default btn-sm"
                        v-on:click.stop.prevent="removeItem(index)"
                      >
                        <octicon name="x"></octicon>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
            <div class="row">
              <div class="col-12 d-flex flex-row justify-content-between">
                <button
                  type="submit"
                  class="btn btn-secondary mr-4"
                  v-on:click.stop.prevent="addItem"
                >增加</button>
                <button
                  type="submit"
                  class="btn btn-success px-5"
                  v-on:click.stop.prevent="submit()"
                  v-bind:disabled="isSubmitting"
                >
                  <span v-if="isSubmitting">
                    <b-spinner small class="mr-2"></b-spinner>提交中...
                  </span>
                  <span v-else>提交</span>
                </button>
              </div>
            </div>
          </b-overlay>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WorklogForm",
  data() {
    return {
      worklogId: this.$route.params.id,
      items: [],
      isSubmitting: false,
      showOverlay: false
    };
  },
  created() {
    this.addItem();
    this.addItem();
    if (this.worklogId) {
      this.load(this.worklogId);
    }
  },
  methods: {
    load(id) {
      const self = this;

      self.showOverlay = true;

      self.$http
        .get(`/worklogs/${id}`)
        .then(function(response) {
          self.items = response.data.items;
        })
        .catch(function(error) {
          self.$notify({ group: "main", type: "error", text: error });
        })
        .finally(() => {
          self.showOverlay = false;
        });
    },
    submit() {
      const self = this;

      const items_ = self.items
        .filter(item => {
          return item.length != 0 && item.some(it => !!it && it != "");
        })
        .map(item => item.map(it => (it != null ? it : "")));

      const allBlanks = items_.every(item => item.every(it => !it));
      if (allBlanks) {
        self.$notify({ group: "main", type: "error", text: "无效输入" });
        return;
      }

      self.isSubmitting = true;

      let process = null;
      if (self.worklogId) {
        process = self.$http.put(`/worklogs/${self.worklogId}`, {
          items: items_
        });
      } else {
        process = self.$http.post(`/worklogs`, {
          items: items_
        });
      }

      process
        .then(function(response) {
          if (response.status == 200) {
            self.$router.push({ path: "/worklogs/list" });
            self.$notify({
              group: "main",
              type: "success",
              text: "Successful!"
            });
          } else {
            self.$notify({
              group: "main",
              type: "error",
              text: response.payload
            });
          }
        })
        .catch(function(error) {
          self.$notify({ group: "main", type: "error", text: error });
        })
        .finally(() => {
          self.isSubmitting = false;
        });
    },
    removeItem(index) {
      this.items.splice(index, 1);
      if (this.items.length === 0) {
        this.items.push([]);
      }
    },
    addItem() {
      this.items.push(["", "", "", ""]);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

