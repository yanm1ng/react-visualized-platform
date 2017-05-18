export default function(location, cb) {
  require.ensure([], require => {
    cb(null, require('./index.jsx').default)
  }, 'city')
}