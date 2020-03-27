import { store } from '../store'
import { router } from '../router';
import Vue from 'vue'

export const authService = {
    login,
    logout
};

function login(accessToken, user) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));

    store.commit('login');
}

function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    store.commit('logout');

    Vue.notify({
        group: 'main',
        type: 'success',
        text: 'Logged out!'
    });

    router.push('/login');
}