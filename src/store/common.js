export const common = {
    state: {
        showLoading: false
    },
    mutations: {
        setShowLoading(state, show) {
            state.showLoading = show;
        }
    },
    getters: {
        getShowLoading: state => {
            return state.showLoading;
        }
    }
};