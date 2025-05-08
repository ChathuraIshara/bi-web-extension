/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState } from "react";
import { Paths as P } from "../../../Definitions/ServiceDefinitions";
import { Paths } from "./Paths";
import petstoreJSON from "../../Data/petstoreJSON.json";
import { ReadOnlyPaths } from "./ReadOnlyPaths";

export default {
    component: Paths,
    title: 'New Paths',
};

const paths: P = petstoreJSON.paths as unknown as P;

export const PathsStory = () => {
    const [pi, setPI] = useState<P>(paths);
    const handlePathItemChange = (pathItem: P) => {
        console.log("PathItem changed", pathItem);
        setPI(pathItem);
    }
    return (
        <Paths paths={pi} onPathsChange={handlePathItemChange} />
    );
};

export const ReadOnlyPathsStory = () => {
    return (
        <ReadOnlyPaths paths={paths} />
    );
}
