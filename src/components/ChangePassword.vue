<template>
  <div class="container">
    <div class="row d-flex justify-content-center py-5">
      <div class="col-12 col-sm-6 bg-white p-4">
        <h3 class="h3 pb-3">修改密码</h3>
        <form>
          <div class="form-group">
            <label for="oldPassword">旧密码</label>
            <input
              class="form-control"
              type="password"
              name="oldPassword"
              id="oldPassword"
              v-model="oldPassword"
              required
              v-validate="'required'"
            />
            <div class="invalid-feedback">{{ errors.first('oldPassword') }}</div>
          </div>
          <div class="form-group">
            <label for="newPassword">新密码</label>
            <input
              type="password"
              class="form-control"
              id="newPassword"
              name="newPassword"
              v-model="newPassword"
              required
              minlength="6"
              maxlength="32"
              ref="newPassword"
              v-validate="'required|min:6|max:32'"
            />
            <div class="invalid-feedback">{{ errors.first('newPassword') }}</div>
          </div>
          <div class="form-group">
            <label for="newPasswordConfirmation">确认新密码</label>
            <input
              type="password"
              class="form-control"
              id="newPasswordConfirmation"
              name="newPasswordConfirmation"
              v-model="newPasswordConfirmation"
              required
              v-validate="'required|confirmed:newPassword'"
            />
            <div class="invalid-feedback">{{ errors.first('newPasswordConfirmation') }}</div>
          </div>
          <div class="d-flex flex-row justify-content-end">
            <input
              type="submit"
              class="btn btn-success px-4"
              value="确定"
              v-bind:disabled="!(newPasswordConfirmation && errors.all().length == 0)"
              v-on:click.stop.prevent="submit()"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from "../service/index";

export default {
  name: "ChangePassword",
  data() {
    return {
      oldPassword: null,
      newPassword: null,
      newPasswordConfirmation: null,
      isSubmmiting: false
    };
  },
  methods: {
    submit() {
      const self = this;

      self.isSubmmiting = true;

      const url = `/account/password`;
      self.$http
        .put(url, {
          oldPassword: self.oldPassword,
          newPassword: self.newPassword
        })
        .then(response => {
          if (response.status === 200) {
            authService.logout();

            self.$notify({
              group: "main",
              type: "success",
              text: "Changed password successfully!"
            });
          } else {
            self.$notify({
              group: "main",
              type: "error",
              text: response.body
            });
          }
        })
        .catch(function(error) {
          if (error.response) {
            self.$notify({
              group: "main",
              type: "error",
              text: error.response.data.message
            });
          } else {
            self.$notify({ group: "main", type: "error", text: error });
          }
        })
        .finally(() => {
          self.isSubmmiting = false;
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
