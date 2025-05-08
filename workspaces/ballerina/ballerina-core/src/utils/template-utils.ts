/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import * as hbs from "handlebars";
import { Parameter, templates } from "..";

async function getInsertTemplate(insertTempName: string) {
    return templates[insertTempName];
}

const hbsInstance = hbs.create();
hbsInstance.registerHelper('checkConfigurable', (listenerParam: Parameter[]) => {
    const data = listenerParam.find((params) => params.name === 'listenerConfig');
    return !!data;
});
hbsInstance.registerHelper('checkBootstrapServers', (listenerParam: Parameter[]) => {
    const data = listenerParam?.find((params) => params.name === 'bootstrapServers');
    return !!data;
});

export async function getInsertComponentSource(insertTempName: string, config: { [key: string]: any }) {
    const hbTemplate = hbsInstance.compile(await getInsertTemplate(insertTempName));
    return hbTemplate(config);
}
