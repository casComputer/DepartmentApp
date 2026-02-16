const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

require("dotenv").config();

const config = getDefaultConfig(__dirname);

const isTermux = process.env.TERMINUX;

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

module.exports = withUniwindConfig(config, {
    cssEntryFile: "./global.css",
    dtsFile: "./uniwind-types.d.ts",
    extraThemes: [
        "ocean",
        "sunset",
        "forest",
        "high-contrast",
        "cocoa-ember",
        "aurora",
        "arctic",
        "ember",
        "earthy-rhythm",
        "luxury-ember",
        "midnight-moss",
        "deep-amethyst",
        "obsidian-gold",
        "slate-crimson",
        "basalt-cyan",
        "charcoal-rose",
        "forest-rust",
        "abyss-electric",
        "ink-bronze",
        "carbon-mint",
        "velvet-noir",
        "sapphire-luxury",
        "champagne-noir",
        "platinum-edge",
        "graphite-amber",
        "burgundy-depths",
        "imperial-plum",
        "espresso-gold",
        "titanium-indigo",
        "onyx-coral"
    ]
});
