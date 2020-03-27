<template>
  <div class="pt-sm-3">
    <div class="row justify-content-md-center py-3">
      <div class="col-md-6">
        <h3 class="h3">Change Password</h3>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-6">
        <form>
          <div class="form-group">
            <label for="oldPassword">Old Password</label>
            <input
              class="form-control"
              type="password"
              name="oldPassword"
              id="oldPassword"
              v-model="oldPassword"
              required
              v-validate="'required'"
            >
            <div class="invalid-feedback">{{ errors.first('oldPassword') }}</div>
          </div>
          <div class="form-group">
            <label for="newPassword">New Password</label>
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
            >
            <div class="invalid-feedback">{{ errors.first('newPassword') }}</div>
          </div>
          <div class="form-group">
            <label for="newPasswordConfirmation">New Password Confirmation</label>
            <input
              type="password"
              class="form-control"
              id="newPasswordConfirmation"
              name="newPasswordConfirmation"
              v-model="newPasswordConfirmation"
              required
              v-validate="'required|confirmed:newPassword'"
            >
            <div class="invalid-feedback">{{ errors.first('newPasswordConfirmation') }}</div>
          </div>
          <div>
            <input
              type="submit"
              class="btn btn-primary mx-auto"
              value="Submit"
              v-bind:disabled="!(newPasswordConfirmation && errors.all().length == 0)"
              v-on:click.stop.prevent="submit()"
            >
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
      newPasswordConfirmation: null
    };
  },
  methods: {
    submit() {
      const self = this;

      self.$store.commit("setShowLoading", true);

      const url = `/auth/changePassword`;
      self.$http
        .post(url, {
          oldPassword: self.oldPassword,
          newPassword: self.newPassword
        })
        .then(function(response) {
          var respObj = response.data;
          if (respObj.status == "success") {
            authService.logout();
            self.$router.push("/login");

            self.$notify({
              group: "main",
              type: "success",
              text: "Changed password successfully!"
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
          if (error.response) {
            self.$notify({ group: "main", type: "error", text: error.response.data.message });
          } else {
            self.$notify({ group: "main", type: "error", text: error });
          }
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
