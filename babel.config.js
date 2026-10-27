module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo (SDK 58) auto-configures react-native-worklets /
    // reanimated, so no separate plugin entry is needed here.
    presets: ['babel-preset-expo'],
  };
};
