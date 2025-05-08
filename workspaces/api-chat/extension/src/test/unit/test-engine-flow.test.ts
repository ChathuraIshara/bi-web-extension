/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as assert from 'assert';
import * as TestEngine from '../../TestEngine';
import axios from 'axios';
import { parse, stringify } from 'yaml';
import { error } from 'console';

suite.only('Test Engine Flow', () => {
    let service = TestEngine.getService();
    service.onTransition((state: any) => {
        console.log(state.value);
    })

    // Check if test engine is in init state
    test('Init state', () => {
        assert.strictEqual(TestEngine.getState(), "init");
    });

    // Set OpenAPI and see if it goes to loading and then ready state
    test('See if engine goes to ready state', (done) => {
        const listner = (state: any) => {
            if (state.matches('ready')) {
                assert.notEqual(state.context.apiSpec, undefined);
                subscription.off(listner);
                done();
            }
        }
        const subscription = service.onTransition(listner);
        TestEngine.setOpenAPI(loadPetstoreData());
        assert.strictEqual(TestEngine.getState(), "loading");
    }).timeout(10000);

    // See executing
    test('test the engine executing flow', (done) => {
        // first check if engine is in ready state
        assert.strictEqual(TestEngine.getState(), "ready");
        // Check engine goes to executing state
        const listner = (state: any) => {
            if (state.matches('executing')) {
                subscription.off(listner);
                done();
            }
        }
        const subscription = service.onTransition(listner);

        // register test to see if it goes to fetchRequest

        test('Test if it goes to fetch request', (done) => {
            const listner = (state: any) => {
                if (state.matches({ executing: "fetchRequest" })) {
                    assert.notEqual(state.context.nextRequest, undefined);
                    subscription1.off(listner);
                    done();
                }
            }
            const subscription1 = service.onTransition(listner);
        });

        TestEngine.runExecute("Add a pet and check if it gets created");
    }).timeout(10000);




});

function loadPetstoreData() {
    const petstoreYaml = './src/test/unit/resources/petstore.yaml';
    const fs = require('fs');

    let petstoreData = {};
    try {
        petstoreData = parse(fs.readFileSync(petstoreYaml, 'utf8'));
    } catch (e) {
        console.log(e);
    }
    return petstoreData;
}