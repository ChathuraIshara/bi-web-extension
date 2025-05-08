/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Paths as P, PathItem as PI, Operation as O } from '../../../Definitions/ServiceDefinitions';
import { useContext } from 'react';
import { APIDesignerContext } from '../../../APIDesignerContext';
import { ReadOnlyOperation } from '../Operation/ReadOnlyOperation';
import { ReadOnlyPathItem } from '../PathItem/ReadOnlyPathItem';

interface PathsProps {
    paths: P;
}

export function ReadOnlyPaths(props: PathsProps) {
    const { paths } = props;
    const { 
        props: { selectedComponentID },
    } = useContext(APIDesignerContext);
    const selectedPath = selectedComponentID.split("#-")[2];
    const selectedMethod = selectedComponentID.split("#-")[3];
    const selectedOperation: O = selectedPath && selectedMethod && paths[selectedPath] && paths[selectedPath][selectedMethod] as O;
    return (
        <>
            {Object.keys(paths).map((key) => {
                if (key !== "$ref" && key !== "summary" && key !== "description" && key !== "servers" && selectedPath === key && selectedMethod && selectedOperation) {
                    return (
                        <ReadOnlyOperation
                            operation={selectedOperation}
                            method={selectedMethod}
                            path={selectedPath}
                        />
                    )
                } else if (key !== "$ref" && key !== "summary" && key !== "description" && key !== "servers" && selectedPath === key) {
                    return (
                        <ReadOnlyPathItem
                            pathItem={paths[key]}
                            path={key}
                        />
                    )
                }
            })}
        </>
    )
}
