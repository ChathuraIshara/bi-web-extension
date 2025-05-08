/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IDMModel, IOType, Mapping } from "@wso2-enterprise/ballerina-core";

export interface BaseVisitor {
    beginVisit?(node: IDMModel, parent?: IDMModel): void;
    endVisit?(node: IDMModel, parent?: IDMModel): void;
    
    beginVisitInputType?(node: IOType, parent?: IDMModel): void;
    endVisitInputType?(node: IOType, parent?: IDMModel): void;

    beginVisitOutputType?(node: IOType, parent?: IDMModel): void;
    endVisitOutputType?(node: IOType, parent?: IDMModel): void;

    beginVisitMapping?(node: Mapping, parentMapping: Mapping, parentModel?: IDMModel): void;
    endVisitMapping?(node: Mapping, parentMapping: Mapping, parentModel?: IDMModel): void;
}
