module.exports = {
configureWebpack: () => {
  return {
    externals: {
      firebase: "firebase",
      VueFirestore:"vue-firestore"
    },
  }
}
}