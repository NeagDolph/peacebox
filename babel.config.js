module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            "babel-plugin-inline-import",
            {
                "extensions": [".svg"]
            }
        ],
        'react-native-reanimated/plugin',
    ],
    env: {
        production: {
            plugins: [
                'react-native-paper/babel',
                'react-native-reanimated/plugin',
                [
                    "babel-plugin-inline-import",
                    {
                        "extensions": [".svg"]
                    }
                ]
            ],
        },
    },
};
