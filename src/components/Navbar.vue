<template>
  <b-navbar toggleable="lg" type="dark" class="navbar navbar-expand-sm navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">工作日志</router-link>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <li
            class="nav-item"
            v-bind:class="{active: $route.path==='/' || $route.path==='/worklogs/view'}"
          >
            <router-link class="nav-link" to="/">查看</router-link>
          </li>
          <li class="nav-item" v-bind:class="{active: $route.path==='/worklogs/create'}">
            <router-link class="nav-link" to="/worklogs/create">撰写</router-link>
          </li>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <template v-if="!isLoggedIn">
            <li class="nav-item" v-bind:class="{active: $route.path==='/register'}">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
            <li class="nav-item" v-bind:class="{active: $route.path==='/login'}">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
          </template>
          <b-nav-item-dropdown v-bind:text="user.name" right v-else>
            <b-dropdown-item to="/user/changePassword">Change Password</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item v-on:click="logout()">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </div>

    <b-modal id="modal-create-licenses" title="Createa licenses" hide-footer>
      <form action method="post" enctype="multipart/form-data">
        <div class="form-group">
          <label>Validity:</label>
          <select class="form-control" name="validity" v-model="validity">
            <option value="1">1 Monthes</option>
            <option value="3">3 Monthes</option>
            <option value="6">6 Monthes</option>
            <option value="12">12 Monthes</option>
            <option value="24">24 Monthes</option>
            <option value="36">36 Monthes</option>
          </select>
        </div>
        <div class="form-group">
          <label>Count:</label>
          <input
            type="number"
            class="form-control"
            name="count"
            step="1"
            min="0"
            max="10000"
            required
            v-model="count"
          />
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          v-on:click.stop.prevent="createLicenses()"
        >Submit</button>
      </form>
    </b-modal>
  </b-navbar>
</template>

<script>
import { mapGetters } from "vuex";
import { authService } from "../service";
import * as config from "../../config";
import axios from "axios";
import { EventBus } from "../event-bus.js";

export default {
  name: "Navbar",
  data() {
    return {
      count: 1,
      validity: 12
    };
  },
  computed: {
    ...mapGetters({
      user: "getUser",
      isAdmin: "isAdmin",
      isSuperAdmin: "isSuperAdmin",
      isLoggedIn: "isLoggedIn"
    })
  },
  methods: {
    logout() {
      authService.logout();
    },
    resetCreateLicensesData() {
      this.validity = 12;
      this.count = 1;
    },
    createLicenses() {
      let self = this;

      self.$store.commit("setShowLoading", true);

      const url = `${config.server}/licenses`;

      axios
        .post(url, {
          validity: +this.validity,
          count: +this.count
        })
        .then(() => {
          self.resetCreateLicensesData();
          self.$bvModal.hide("modal-create-licenses");
          self.$notify({ group: "main", type: "success", text: "Successful!" });
          EventBus.$emit("licenses-created", this.clickCount);
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
.navbar {
  background: #0a0b0d;
}
</style>

