module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    ["module-resolver", {
      alias: {
        "@icons": "./src/lib/icons.js"
      }
    }]
  ]
};