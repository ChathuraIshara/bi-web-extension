/**
 * Copyright (c) 2018, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import * as fs from 'fs';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import { ballerinaExtInstance } from '../../src/core';
import { getBallerinaHome, getBallerinaVersion } from '../test-util';

// Ballerina tools distribution will be copied to following location by maven
const testBallerinaHome = getBallerinaHome();
const testBallerinaVersion = getBallerinaVersion();

// Defines a Mocha test suite to group tests of similar kind together
suite("Ballerina Extension Core Tests", function () {
    test("Test autoDetectBallerinaHome", function () {
        // Following should not throw an error all times.
        const { home } = ballerinaExtInstance.autoDetectBallerinaHome();
        if (home) {
            assert.equal(fs.existsSync(home), true);
        }
    });

    test("Test getBallerinaVersion", function () {
        ballerinaExtInstance.getBallerinaVersion(testBallerinaHome, true).then(detected => {
            const regex = /(s|S)wan( |-)(l|L)ake/g;
            if (detected.match(regex) && testBallerinaHome.match(regex)) {
                let detectedLowerCase = detected.toLowerCase();
                let balVersionLowerCase = testBallerinaVersion.toLowerCase();
                assert.equal(balVersionLowerCase.substring(balVersionLowerCase.indexOf('lake') + 4)
                    .replace(/( |-)/g, '').includes(detectedLowerCase.substring(detectedLowerCase.indexOf('lake') + 4)
                        .replace(/( |-)/g, '')), true);
            } else {
                assert.equal(detected, testBallerinaVersion);
            }
        });
    });
});
