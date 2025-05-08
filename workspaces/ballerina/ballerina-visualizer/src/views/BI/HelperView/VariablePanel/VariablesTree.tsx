/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { TypeWithIdentifier } from "@wso2-enterprise/ballerina-core";
import { PrimitiveType } from "./PrimitiveType";
import { RecordTypeTree } from "./RecordType";

interface VariableTreeProps {
    variable: TypeWithIdentifier;
    depth: number;
    handleOnSelection: (variable: string) => void;
    parentValue?: string;
    isOptional?: boolean;
}

export function VariableTree(props: VariableTreeProps) {
    const { variable, depth, handleOnSelection, parentValue, isOptional } = props

    const handleOnClick = (name: string) => {
        handleOnSelection(name);
    }

    if (variable.type.typeName === "record") {
        return (
            <RecordTypeTree
                variable={variable}
                depth={depth}
                handleOnClick={handleOnClick}
                parentValue={parentValue}
                isOptional={isOptional}
            />
        );
    } else {
        return (<PrimitiveType variable={variable} handleOnClick={handleOnClick} />);
    }
}
