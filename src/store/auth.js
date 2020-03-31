export const auth = {
    state: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        loggedIn: localStorage.getItem('accessToken') != null
    },
    mutations: {
        login(state) {
            state.loggedIn = true;
            state.user = JSON.parse(localStorage.getItem('user'));
        },
        logout(state) {
            state.loggedIn = false;
            state.user = null;
        },
        nameChanged(state, newName) {
            state.user.name = newName;
        }
    },
    getters: {
        isLoggedIn: state => {
            return state.loggedIn;
        },
        getUser: state => {
            return state.user;
        },
        isAdmin: state => {
            return state.user && state.user.roles && state.user.roles.includes("ADMIN");
        },
    }
};