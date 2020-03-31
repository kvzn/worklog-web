<template>
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col-12 col-sm-6">
        <div class="bg-white m-1 m-sm-2 m-md-4 p-1 p-sm-2 p-md-4">
          <h2 class="my-3 font-weight-bold">创建用户</h2>
          <form action method="post" enctype="multipart/form-data">
            <div class="form-group">
              <label for="name">名称</label>
              <input
                name="name"
                type="text"
                class="form-control"
                minlength="1"
                maxlength="32"
                required
                v-model="name"
              />
            </div>
            <div class="form-group">
              <label for="email">邮箱</label>
              <input name="email" type="email" class="form-control" required v-model="email" />
            </div>
            <div class="form-group">
              <label for="password">密码</label>
              <input
                name="password"
                type="password"
                class="form-control"
                required
                v-model="password"
              />
            </div>
            <div class="form-group">
              <label for="repassword">确认密码</label>
              <input
                name="repassword"
                type="password"
                class="form-control"
                required
                v-model="repassword"
              />
            </div>
            <div class="form-group">
              <label for="roles">角色</label>

              <b-form-checkbox v-model="isUser" value="true" unchecked-value="false">用户</b-form-checkbox>

              <b-form-checkbox v-model="isAdmin" value="true" unchecked-value="false">管理员</b-form-checkbox>
            </div>

            <div class="d-flex justify-content-between">
              <button class="btn btn-light px-3" v-on:click.stop.prevent="$router.back()">取消</button>
              <button
                type="submit"
                class="btn btn-success px-3"
                v-on:click.stop.prevent="submit()"
                v-bind:disabled="isSubmitting"
              >
                <span v-if="isSubmitting">
                  <b-spinner small class="mr-2"></b-spinner>提交中...
                </span>
                <span v-else>提交</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserCreate",
  data() {
    return {
      user: null,
      name: null,
      email: null,
      password: null,
      repassword: null,
      isUser: true,
      isAdmin: false,
      isSubmitting: false
    };
  },
  created() {
    if (this.userId) {
      this.getUser(this.userId);
    }
  },
  methods: {
    getUser(id) {
      const self = this;

      self.$store.commit("setShowLoading", true);

      self.$http
        .get(`/admin/users/${id}`)
        .then(function(response) {
          self.user = response.data;
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

      self.isSubmitting = true;

      let process = null;
      if (self.userId) {
        process = self.$http.put(`/admin/users/${self.userId}`, self.script);
      } else {
        const roles = [];
        if (self.isUser) {
          roles.push("USER");
        }
        if (self.isAdmin) {
          roles.push("ADMIN");
        }
        process = self.$http.post(`/admin/users`, {
          name: self.name,
          email: self.email,
          password: self.password,
          roles
        });
      }

      process
        .then(function(response) {
          if (response.status == 200) {
            self.$router.push({ path: "/admin/users/list" });
            self.$notify({
              group: "main",
              type: "success",
              text: "Successful!"
            });
          } else {
            self.$notify({
              group: "main",
              type: "error",
              text: response.data
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
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

