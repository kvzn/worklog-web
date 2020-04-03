<template>
  <div class="bg-white m-1 m-sm-2 m-md-4 p-1 p-sm-2 p-md-4">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 py-3 d-flex flex-row justify-content-between">
          <h3>全部日志</h3>
        </div>
      </div>
      <b-overlay :show="showOverlay" rounded="lg">
        <div v-if="!showOverlay && total == 0" class="col-12 d-flex justify-content-center p-5">
          <h1 class="text-muted">空空如也</h1>
        </div>
        <div v-else class="row">
          <div class="col-12">
            <table class="table table-bordered">
              <thead>
                <th>用户</th>
                <th>日期</th>
                <th>工作内容</th>
                <th>工作进展</th>
                <th>问题</th>
                <th>后续计划</th>
                <th></th>
              </thead>
              <tbody>
                <template v-for="log in logs">
                  <tr
                    class="col-12 col-sm-3 col-md-4 col-lg-3 py-2"
                    v-for="(item, index) in log.items"
                    v-bind:key="log.id + index"
                  >
                    <th v-if="index==0" :rowspan="log.items.length">
                      <span class="text-nowrap">{{log.creator.name}}</span>
                    </th>
                    <th v-if="index==0" :rowspan="log.items.length">
                      <span class="text-nowrap">{{log.date}}</span>
                    </th>

                    <td class="align-top">{{item[0]}}</td>
                    <td class="align-top">{{item[1]}}</td>
                    <td class="align-top">{{item[2]}}</td>
                    <td class="align-top">{{item[3]}}</td>

                    <td v-if="index==0" :rowspan="log.items.length">
                      <div class="d-flex flex-row justify-content-center">
                        <b-dropdown variant="button" no-caret right>
                          <template slot="button-content">
                            <octicon name="gear"></octicon>
                          </template>
                          <template v-if="log.date === dateOfToday">
                            <b-dropdown-item v-on:click="routeTo(`/worklogs/${log.id}/edit`)">编辑</b-dropdown-item>
                            <b-dropdown-divider></b-dropdown-divider>
                            <b-dropdown-item v-on:click.stop.prevent="removeLog(log.id)">
                              <span class="text-danger">删除</span>
                            </b-dropdown-item>
                          </template>
                        </b-dropdown>
                      </div>
                    </td>
                  </tr>
                </template>
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
import { store } from "../../store";

export default {
  name: "AdminWorklogList",
  data() {
    return {
      logs: [],
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
    }),
    dateOfToday() {
      const d = moment
        .utc()
        .local()
        .format("YYYY-MM-DD");
      return d;
    }
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

      const url = `${config.server}/admin/worklogs`;

      axios
        .get(url, {
          params: {
            page: this.currentPage - 1,
            limit: this.perPage
          }
        })
        .then(resp => {
          const { data } = resp;
          self.logs = data ? data.reverse() : [];
          self.total = self.logs.length;
        })
        .catch(function(error) {
          self.$notify({ group: "main", type: "error", text: error });
        })
        .finally(() => {
          self.showOverlay = false;
        });
    },
    removeLog(id) {
      let self = this;

      if (!confirm("Are you sure to delete?")) {
        return;
      }

      self.showOverlay = true;

      const url = `${config.server}/worklogs/${id}`;

      axios
        .delete(url)
        .then(resp => {
          if (resp.status === 200) {
            self.$notify({
              group: "main",
              type: "success",
              text: "Successful!"
            });
            self.load();
            store.commit("setTodaysLogWritten", false);
          } else {
            self.$notify({ group: "main", type: "error", text: resp.data });
          }
        })
        .catch(function(error) {
          self.$notify({ group: "main", type: "error", text: error });
        })
        .finally(() => {
          self.showOverlay = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
