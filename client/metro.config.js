// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
require("dotenv").config();

const config = getDefaultConfig(__dirname);

const isTermux = process.env.TERMINUX;

console.log(isTermux);

if (isTermux) {
    console.log(
        "Termux mode: excluding heavy node_modules, keeping Expo Router + metro-runtime"
    );

    config.watchFolders = [];

    config.resolver.blacklistRE = [
        /node_modules\/nativewind\/.*/, 
        /node_modules\/tailwindcss\/.*/,
        /node_modules\/expo-notifications\/.*/ 
    ];

    process.env.CHOKIDAR_USEPOLLING = "true";
}

module.exports = withNativeWind(config, { input: "./global.css" });
