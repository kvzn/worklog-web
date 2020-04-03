<template>
  <div toggleable="lg" type="dark" class="navbar navbar-expand-sm navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand d-flex flex-row align-items-center" to="/">
        <img src="../assets/logo.png" alt class="logo mr-2" />
        工作日志
      </router-link>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <template v-if="isLoggedIn">
            <li
              class="nav-item"
              v-bind:class="{active: $route.path==='/' || $route.path==='/worklogs/list'}"
            >
              <router-link class="nav-link" to="/">我的日志</router-link>
            </li>

            <li
              v-if="isAdmin"
              class="nav-item"
              v-bind:class="{active: $route.path==='/' || $route.path==='/admin/worklogs/list'}"
            >
              <router-link class="nav-link" to="/admin/worklogs/list">全部日志</router-link>
            </li>
          </template>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown v-if="isAdmin" text="管理" right>
            <b-dropdown-item href="/#/admin/users/list">用户</b-dropdown-item>
          </b-nav-item-dropdown>
          <template v-if="!isLoggedIn">
            <li class="nav-item" v-bind:class="{active: $route.path==='/login'}">
              <router-link class="nav-link" to="/login">登录</router-link>
            </li>
          </template>
          <b-nav-item-dropdown v-bind:text="user.name" right v-else>
            <template slot="button-content">
              <b-avatar size="30"></b-avatar>
            </template>
            <b-dropdown-item to="/user/changePassword">修改密码</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item v-on:click="logout()">登出</b-dropdown-item>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { authService } from "../service";

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
      isLoggedIn: "isLoggedIn"
    })
  },
  methods: {
    logout() {
      authService.logout();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.navbar {
  background: #0a0b0d;

  .logo {
    width: 30px;
    height: 30px;
  }
}
</style>

