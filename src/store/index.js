import Vue from 'vue';
import Vuex from 'vuex';

import { auth } from './auth';
import { common } from './common';

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        auth,
        common
    }
});