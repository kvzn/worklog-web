<template>
  <div class="bg-white m-1 m-sm-2 m-md-4 p-1 p-sm-2 p-md-4">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 py-3 d-flex flex-row justify-content-between">
          <h3>用户</h3>
          <router-link to="/admin/users/create">
            <button class="btn btn-success">新建用户</button>
          </router-link>
        </div>
      </div>
      <b-overlay :show="showOverlay" rounded="lg">
        <div class="row">
          <div class="col-12">
            <table class="table table-bordered">
              <thead>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Enabled</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th></th>
              </thead>
              <tbody>
                <tr v-for="(user, index) in users" :key="user.id">
                  <td>{{index+1}}</td>
                  <td>{{user.name}}</td>
                  <td>{{user.email}}</td>
                  <td>{{user.roles.join(', ')}}</td>
                  <td>
                    <div class="d-flex flex-row justify-content-center">
                      <octicon
                        name="primitive-dot"
                        scale="2"
                        v-bind:class="{ 'text-success': user.enabled, 'text-muted': !user.enabled }"
                      ></octicon>
                    </div>
                  </td>
                  <td>{{formatDate(user.createdAt)}}</td>
                  <td>{{formatDate(user.updatedAt)}}</td>
                  <td>
                    <div class="d-flex flex-row justify-content-center">
                      <b-dropdown variant="button" no-caret right>
                        <template slot="button-content">
                          <octicon name="gear"></octicon>
                        </template>
                        <b-dropdown-item>Edit</b-dropdown-item>
                        <template v-if="users.length>1">
                          <b-dropdown-divider></b-dropdown-divider>
                          <b-dropdown-item>Lock</b-dropdown-item>
                          <b-dropdown-item v-on:click.stop.prevent="removeUser(user.id)">
                            <span class="text-danger">Delete</span>
                          </b-dropdown-item>
                        </template>
                      </b-dropdown>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="total > perPage" class="row py-3">
          <div class="col-12 d-flex justify-content-center">
            <b-pagination
              v-model="currentPage"
              :total-rows="total"
              :per-page="perPage"
              size="sm"
              class="float-xs-left float-sm-right my-0"
            ></b-pagination>
          </div>
        </div>
      </b-overlay>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as config from "../../../config";
import * as moment from "moment";
import axios from "axios";

export default {
  name: "UserList",
  data() {
    return {
      users: [],
      total: 0,
      perPage: 50,
      currentPage: 1,
      showOverlay: true
    };
  },
  created() {
    this.load();
  },
  computed: {
    ...mapGetters({
      user: "getUser",
      isAdmin: "isAdmin",
      isLoggedIn: "isLoggedIn"
    })
  },
  watch: {
    currentPage: function() {
      this.load();
    }
  },
  methods: {
    refresh() {
      this.load();
    },
    formatDate(date) {
      if (!date) return null;
      const d = moment
        .utc(date)
        .local()
        .format("YYYY-MM-DD HH:mm:ss Z");

      return d ? d : date;
    },
    routeTo(to) {
      this.$router.push(to);
    },
    load() {
      let self = this;

      self.showOverlay = true;

      const url = `${config.server}/admin/users`;

      axios
        .get(url, {
          params: {
            page: this.currentPage - 1,
            limit: this.perPage
          }
        })
        .then(resp => {
          const { data } = resp;
          self.users = data;
          self.total = self.users.length;
        })
        .catch(error => {
          self.$notify({ group: "main", type: "error", text: error.response.data });
        })
        .finally(() => {
          self.showOverlay = false;
        });
    },
    removeUser(id) {
      let self = this;

      if (!confirm("Are you sure to delete?")) {
        return;
      }

      self.$store.commit("setShowLoading", true);

      const url = `${config.server}/admin/users/${id}`;

      axios
        .delete(url)
        .then(resp => {
          console.log(resp);
          if (resp.status === 200) {
            self.$notify({
              group: "main",
              type: "success",
              text: "Successful!"
            });
            self.load();
          } else {
            self.$notify({ group: "main", type: "error", text: resp.data });
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
<style lang="scss" scoped>
</style>
