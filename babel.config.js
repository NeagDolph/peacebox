module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  "plugins": [
    ["react-native-platform-specific-extensions", {
      "extensions": ["css", "scss", "sass"],
    }]
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
}