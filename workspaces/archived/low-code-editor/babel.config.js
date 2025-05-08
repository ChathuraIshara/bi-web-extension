// babel.config.js

module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
            },
        ],
    ],
    "plugins": [
        ["istanbul", {
            "all": true,
            "include": [
              "low-code-editor/src/**",
              "node_modules/@wso2-enterprise/**"
            ],
            "exclude": [
              "**/*.stories.tsx"
            ],
            "excludeNodeModules": false,
            "cwd": "./../"
          }
        ]
    ]
};
