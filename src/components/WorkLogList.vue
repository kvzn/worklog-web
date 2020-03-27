<template>
  <div class="content-board m-1 m-sm-2 m-md-4 p-1 p-sm-2 p-md-4">
    <div class="container-fluid">
      <div class="row">
        <table class="table table-bordered">
          <thead>
            <th>工作内容</th>
            <th>工作进展</th>
            <th>问题</th>
            <th>后续计划</th>
            <th></th>
          </thead>
          <tbody>
            <tr
              class="col-12 col-sm-3 col-md-4 col-lg-3 py-2"
              v-for="item in items"
              v-bind:key="item.id"
            >
              <td>{{item.items[0]}}</td>
              <td>{{item.items[1]}}</td>
              <td>{{item.items[2]}}</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="row py-3">
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as config from "../../config";
import * as moment from "moment";
import axios from "axios";
import { EventBus } from "../event-bus.js";

export default {
  name: "WorklogList",
  data() {
    return {
      items: [],
      total: 0,
      perPage: 50,
      currentPage: 1,
      approved: "all",
      searchText: null
    };
  },
  created() {
    let self = this;

    this.load();

    EventBus.$on("licenses-created", () => {
      self.load();
    });
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
      EventBus.$emit("reload-daysales");
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

      self.$store.commit("setShowLoading", true);

      const url = `${config.server}/worklogs`;

      axios
        .get(url, {
          params: {
            page: this.currentPage - 1,
            limit: this.perPage
          }
        })
        .then(resp => {
          const { data } = resp;
          console.log(data);
          self.items = data.filter(item => item.items);
          self.total = self.items.size;
        })
        .catch(function(error) {
          self.$notify({ group: "main", type: "error", text: error });
        })
        .finally(() => {
          self.$store.commit("setShowLoading", false);
        });

      return;
    }
  }
};
</script>
<style lang="scss" scoped>
.license-key {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  font-weight: 600;
  font-size: 18px;
}

.address-field {
  height: 50px;
}

.webhook-flag {
  background-image: url(../assets/webhook.svg);
  width: 16px;
  height: 16px;
  filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg)
    brightness(104%) contrast(97%);
}
</style>
