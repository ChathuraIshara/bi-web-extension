/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Paths as P, PathItem as PI, Operation as O } from '../../../Definitions/ServiceDefinitions';
import { PathItem } from '../PathItem/PathItem';
import { Operation } from "../Operation/Operation";
import { useContext, useState } from 'react';
import { APIDesignerContext } from '../../../APIDesignerContext';
import { PathID } from '../../../constants';

interface PathsProps {
    paths: P;
    onPathsChange: (path: P, newPath?: string) => void;
}

export function Paths(props: PathsProps) {
    const { paths, onPathsChange } = props;
    const { 
        props: { selectedComponentID },
        api: { onSelectedComponentIDChange }
    } = useContext(APIDesignerContext);
    const [prevSelectedPath, setPrevSelectedPath] = useState(selectedComponentID.split("#-")[2]);
    const handlePathsChange = (pathItem: PI, path: string) => {
        const previousPath = selectedComponentID.split("#-")[2];
        setPrevSelectedPath(previousPath);
        if (previousPath !== path) {
            const newPaths = Object.keys(paths).reduce((acc, key) => {
                if (key === previousPath) {
                    // Add new path item
                    acc[path] = pathItem;
                    return acc;
                }
                acc[key] = paths[key];
                return acc;
            }, {} as P);
            onPathsChange(newPaths, path); // Call onPathsChange with the updated paths
            onSelectedComponentIDChange(`${PathID.PATHS_COMPONENTS}${PathID.SEPERATOR}${path}`);
        } else {
            onPathsChange({ ...paths, [path]: pathItem });
        }
    };
    const handleOperationsChange = (operation: O) => {
        onPathsChange({ 
            ...paths, 
            [selectedPath]: {
                ...paths[selectedPath], 
                [selectedMethod]: operation
            }
        });
    };
    const selectedPath = selectedComponentID.split("#-")[2];
    const selectedMethod = selectedComponentID.split("#-")[3];
    const selectedOperation: O = selectedPath && selectedMethod && paths[selectedPath] && paths[selectedPath][selectedMethod] as O;
    const selectedPathInPaths = Object.keys(paths).includes(selectedPath);
    return (
        <>
            {Object.keys(paths).map((key) => {
                if (key !== "$ref" && key !== "summary" && key !== "description" && key !== "servers" && !selectedMethod && (selectedPathInPaths ? selectedPath === key : key === prevSelectedPath)) {
                    return (
                        <PathItem
                            pathItem={paths[key]}
                            path={key !== selectedPath ? selectedPath : key}
                            onPathItemChange={handlePathsChange}
                        />
                    )
                } else if (key !== "$ref" && key !== "summary" && key !== "description" && key !== "servers" && selectedPath === key && selectedMethod) {
                    return (
                        <Operation
                            operation={selectedOperation}
                            method={selectedMethod}
                            path={selectedPath}
                            onOperationChange={handleOperationsChange}
                        />
                    )
                }
            })}
        </>
    )
}
