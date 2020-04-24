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
                <th>姓名</th>
                <th>邮箱</th>
                <th>角色</th>
                <th>启用</th>
                <th>创建</th>
                <th>更新</th>
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
                        <b-dropdown-item @click="selectedUser=user; showEditModal=true">编辑</b-dropdown-item>
                        <template v-if="users.length>1">
                          <b-dropdown-divider></b-dropdown-divider>
                          <b-dropdown-item v-on:click.stop.prevent="lockUser(user.id)">
                            <span v-if="user.enabled" class="text-danger">锁定</span>
                            <span v-else class="text-danger">解锁</span>
                          </b-dropdown-item>
                          <b-dropdown-item v-on:click.stop.prevent="removeUser(user.id)">
                            <span class="text-danger">删除</span>
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

    <b-modal id="modal-update-user" title="编辑用户" v-model="showEditModal">
      <form action>
        <div class="form-group">
          <label for="roles">角色</label>
          <template v-if="selectedUser">
            <b-form-checkbox v-model="selectedUser.roles" value="USER" unchecked-value="null">用户</b-form-checkbox>
            <b-form-checkbox v-model="selectedUser.roles" value="ADMIN" unchecked-value="null">管理员</b-form-checkbox>
          </template>
        </div>
      </form>

      <template v-slot:modal-footer="{ isSubmitting }">
        <b-button variant="light" @click="showEditModal = false">取消</b-button>
        <b-button variant="success" v-bind:disabled="isSubmitting" @click="submitEditing()">
          <span v-if="isSubmitting">
            <b-spinner small class="mr-2"></b-spinner>提交中...
          </span>
          <span v-else>确定</span>
        </b-button>
      </template>
    </b-modal>
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
      showOverlay: true,
      showEditModal: false,
      selectedUser: null
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
          self.$notify({
            group: "main",
            type: "error",
            text: error.response.data
          });
        })
        .finally(() => {
          self.showOverlay = false;
        });
    },
    removeUser(id) {
      let self = this;

      if (!confirm("Are you sure to delete this user?")) {
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
    },
    lockUser(id) {
      let self = this;

      if (!confirm("Are you sure to lock this user?")) {
        return;
      }

      self.$store.commit("setShowLoading", true);

      const url = `${config.server}/admin/users/${id}/lock`;

      axios
        .put(url)
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
    },
    submitEditing() {
      const self = this;

      self.isSubmitting = true;

      self.$http
        .put(`/admin/users/${self.selectedUser.id}/roles`, {
          roles: self.selectedUser.roles
        })
        .then(function(response) {
          if (response.status == 200) {
            self.showEditModal = false;
            self.load();
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
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
