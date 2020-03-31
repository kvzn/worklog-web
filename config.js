module.exports = {
    server: process.env.NODE_ENV === 'production'
        ? 'https://worklog.springupbackend.com'
        : 'http://localhost:3000/dev' //'https://worklog.springupbackend.com'
}