/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { BallerinaProjectComponents, ComponentInfo } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

import { DEFAULT_MODULE_NAME } from "../../..";
import { ComponentCollection, ComponentViewInfo, genFilePath } from "../../../util";
import { ComponentView } from "../ComponentView";

import './style.scss';

interface ModuleViewProps {
    projectComponents: BallerinaProjectComponents;
    updateSelection: (info: ComponentViewInfo) => void;
}


interface ModuleViewInfo {
    moduleName: string;
    components: ComponentCollection;
}

export function ModuleView(props: ModuleViewProps) {
    const { projectComponents, updateSelection } = props;
    const moduleMap = new Map<string, ModuleViewInfo>();

    projectComponents.packages.forEach(packageInfo => {
        packageInfo.modules.forEach(module => {
            const moduleName = module.name || DEFAULT_MODULE_NAME;
            Object.keys(module)
                .filter(key => module[key].length)
                .forEach(key => {
                    if (key !== 'name') {
                        module[key].forEach((element: ComponentInfo) => {
                            if (!moduleMap.has(moduleName)) {
                                moduleMap.set(moduleName, {
                                    components: {
                                        functions: [],
                                        services: [],
                                        records: [],
                                        objects: [],
                                        classes: [],
                                        types: [],
                                        constants: [],
                                        enums: [],
                                        listeners: [],
                                        moduleVariables: []
                                    },
                                    moduleName: module.name || DEFAULT_MODULE_NAME
                                });
                            }
                            (moduleMap.get(moduleName) as ModuleViewInfo).components[key].push({
                                filePath: genFilePath(packageInfo, module, element),
                                position: {
                                    startLine: element.startLine,
                                    startColumn: element.startColumn,
                                    endLine: element.endLine,
                                    endColumn: element.endColumn
                                },
                                fileName: element.filePath,
                                moduleName: module.name ? module.name : undefined,
                                name: element.name
                            });
                        });
                    }
                })
        })
    });


    const moduleViews: React.ReactElement[] = [];

    moduleMap.forEach(info => {
        const categories: React.ReactElement[] = [];

        Object.keys(info.components).filter(key => info.components[key].length).forEach(key => {
            const components = info.components[key].map((comp: ComponentViewInfo, index: number) => (
                <ComponentView key={key + index} info={comp} updateSelection={updateSelection} />
            ))
            categories.push(
                <>
                    <h3>{key}</h3>
                    <div className="component-container">
                        {components}
                    </div>
                </>
            )
        })
        moduleViews.push(
            <div className="module-view-container">
                <div className="module-info">
                    <span className="module-name">{info.moduleName}</span>
                </div>
                <div className="component-info">
                    {categories}
                </div>
            </div>
        )
    });

    return (
        <>
            {moduleViews}
        </>
    )
}
