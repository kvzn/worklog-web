<template>
  <div class="container">
    <div class="row justify-content-md-center py-5">
      <div class="col-12 col-sm-6">
        <div class="bg-white p-4">
          <h3 class="h3 pb-3">登录</h3>
          <b-overlay :show="showOverlay" rounded="lg">
            <form>
              <div class="form-group">
                <label for="email">邮箱</label>
                <input
                  class="form-control"
                  type="email"
                  name="email"
                  id="email"
                  v-model="email"
                  required
                  v-validate="'required|email'"
                />
                <div class="invalid-feedback">{{ errors.first('email') }}</div>
              </div>
              <div class="form-group">
                <label for="password">密码</label>
                <input
                  class="form-control"
                  type="password"
                  name="password"
                  id="password"
                  v-model="password"
                  required
                  v-validate="'required'"
                />
                <div class="invalid-feedback">{{ errors.first('email') }}</div>
              </div>
              <div class="form-group d-flex flex-row justify-content-end align-items-center pt-3">
                <router-link to="/findPassword" class="text-secondary mr-3">忘记密码?</router-link>
                <button
                  type="submit"
                  class="btn btn-success px-4"
                  v-on:click.stop.prevent="login()"
                  v-bind:disabled="!email || !password || errors.all().length != 0"
                >确定</button>
              </div>
            </form>
          </b-overlay>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from "../service/index";
import * as config from "../../config";
import axios from "axios";

export default {
  name: "Register",
  data() {
    return {
      email: this.$route.query.registeredEmail,
      password: null,
      showOverlay: false
    };
  },
  methods: {
    login() {
      const self = this;

      self.showOverlay = true;

      const url = `${config.server}/auth/login`;

      axios
        .post(url, {
          email: self.email,
          password: self.password
        })
        .then(function(response) {
          const { token, user } = response.data;
          authService.login(token, user);

          const redirect = self.$route.query.redirect;
          self.$router.push({ path: redirect || "/" });

          self.$notify({
            group: "main",
            type: "success",
            text: "Logged in!"
          });
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
          self.showOverlay = false;
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
