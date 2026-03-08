const { withAndroidStyles } = require("@expo/config-plugins");

module.exports = function withDisableForceDark(config) {
  return withAndroidStyles(config, (config) => {
    const styles = config.modResults.resources.style;

    styles.forEach((style) => {
      if (style.$.name === "AppTheme") {
        style.item.push({
          _: "false",
          $: { name: "android:forceDarkAllowed" },
        });
      }
    });

    return config;
  });
};
