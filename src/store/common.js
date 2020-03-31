export const common = {
    state: {
        showLoading: false,
        isTodaysLogWritten: false
    },
    mutations: {
        setShowLoading(state, show) {
            state.showLoading = show;
        },
        setTodaysLogWritten(state, written) {
            state.isTodaysLogWritten = written;
        }
    },
    getters: {
        getShowLoading: state => {
            return state.showLoading;
        },
        isTodaysLogWritten: state => {
            return state.isTodaysLogWritten;
        }
    }
};