/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx|)$': 'babel-jest',
        '^.+\\.(ts|tsx)?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        "^react$": "<rootDir>/node_modules/react/index.js",
    },
    setupFilesAfterEnv: [
        '<rootDir>/src/test/jest.env.ts',
    ],
    setupFiles: ['<rootDir>/src/test/matchMedia.ts'],
    "transformIgnorePatterns": [
        "<rootDir>/node_modules/(?!(@wso2-enterprise)/)"
    ]
};
