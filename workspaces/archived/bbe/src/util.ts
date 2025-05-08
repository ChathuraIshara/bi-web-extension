/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { createElement } from "react";
import { render } from "react-dom";
import { SamplesList } from "./ExampleList";
import { BallerinaExampleCategory } from "./model";

export function renderSamplesList(target: HTMLElement,
                                  openSample: (url: string) => void,
                                  getSamples: () => Promise<BallerinaExampleCategory[]>,
                                  openLink: (url: string) => void) {
    const props = {
        getSamples,
        openLink,
        openSample,
    };
    const SamplesListElement = createElement(SamplesList, props);
    render(SamplesListElement, target);
}
