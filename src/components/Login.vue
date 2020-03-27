<template>
  <div class="pt-sm-3">
    <div class="row justify-content-md-center py-3">
      <div class="col-md-3">
        <h3 class="h3">Login</h3>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-md-3">
        <form>
          <div class="form-group">
            <label for="email">Email</label>
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
            <label for="password">Password</label>
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
          <div class="form-group">
            <button
              type="submit"
              class="btn btn-primary mx-auto"
              v-on:click.stop.prevent="login()"
              v-bind:disabled="!email || !password || errors.all().length != 0"
            >Submit</button>
            <router-link to="/findPassword" class="text-secondary ml-2">Forgot password?</router-link>
          </div>
        </form>
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
      password: null
    };
  },
  methods: {
    login() {
      const self = this;

      self.$store.commit("setShowLoading", true);

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
          self.$store.commit("setShowLoading", false);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
