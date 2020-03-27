module.exports = {
    server: process.env.NODE_ENV === 'production'
        ? 'https://worklog.springup.app'
        : 'http://localhost:3000/dev'
}