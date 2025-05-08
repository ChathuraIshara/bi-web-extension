/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */


import { BallerinaProjectComponents, ComponentInfo, ComponentViewInfo, FileListEntry, ModuleSummary, PackageSummary } from "@wso2-enterprise/ballerina-core";
import { ComponentCollection } from "../ComponentListView";
import { URI } from "vscode-uri"


export class ProjectComponentProcessor {
    private projectComponents: BallerinaProjectComponents;
    private fileMap: Map<string, FileListEntry>;
    private currentPackage: PackageSummary;
    private currentModule: ModuleSummary;
    private components: ComponentCollection;


    constructor(projectComponents: BallerinaProjectComponents) {
        this.projectComponents = projectComponents;
        this.fileMap = new Map<string, FileListEntry>();
        this.components = {
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
        };
    }

    public process() {
        if (this.projectComponents && this.projectComponents.packages) {
            this.projectComponents.packages.forEach(packageInfo => {
                this.processPackage(packageInfo);
            });
        }
    }

    private processPackage(packageInfo: PackageSummary) {
        this.currentPackage = packageInfo;

        packageInfo.modules.forEach(module => {
            this.processModule(module);
        });
    }

    private processModule(module: ModuleSummary) {
        this.currentModule = module;

        for (const [key, value] of Object.entries(module)) {
            if (key === 'name') continue;
            this.processComponents(key, value);
        }
    }

    private processComponents(type: string, components: ComponentInfo[]) {
        components.forEach(component => {
            this.components[type].push({
                filePath: genFilePath(this.currentPackage, this.currentModule, component),
                position: {
                    startLine: component.startLine,
                    startColumn: component.startColumn,
                    endLine: component.endLine,
                    endColumn: component.endColumn,
                },
                fileName: component.filePath,
                name: component.name,
                moduleName: this.currentModule.name,
            });

            const fileEntryKey = `${this.currentModule.name ? `${this.currentModule.name}/` : ''}${component.filePath}`;

            if (!this.fileMap.has(fileEntryKey)) {
                const uri = URI.parse(genFilePath(this.currentPackage, this.currentModule, component));
                this.fileMap.set(fileEntryKey, {
                    uri,
                    fileName: `${this.currentModule.name ? `${this.currentModule.name}/` : ''}${component.filePath}`,
                });
            }
        });
    }

    public getComponents() {
        return this.components;
    }

    public getComponentsFor(file: string) {
        const filteredComponents: ComponentCollection = {
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
        }

        for (const [type, collection] of Object.entries(this.components)) {
            collection.forEach((el: ComponentViewInfo) => {
                if (isPathEqual(el.filePath, file)) {
                    filteredComponents[type].push(el);
                }
            })
        }

        return filteredComponents;
    }

    public getFileMap() {
        return this.fileMap;
    }
}

export function genFilePath(packageInfo: PackageSummary, module: ModuleSummary, element: ComponentInfo) {
    let filePath: string;
    if (packageInfo.filePath.endsWith('.bal')) {
        filePath = packageInfo.filePath.replace('file://', '');
    } else {
        filePath = `${packageInfo.filePath}${module.name ? `modules/${module.name}/` : ''}${element.filePath}`
            .replace('file://', '');
    }

    filePath = extractFilePath(filePath);

    return filePath;
}


export function extractFilePath(uri: string): string | null {
    let filePath = uri;
    if (uri.startsWith('file://')) {
        const url = new URL(uri);
        filePath = url.pathname;
    }

    if (filePath && filePath.match(/^\/[a-zA-Z]:/g)) {
        filePath = filePath.replace('/', '');
    }

    if (filePath && filePath.match(/^[A-Z]:\//g)) {
        const firstCharacter = filePath.charAt(0).toLowerCase();
        const remaining = filePath.slice(1);
        filePath = `${firstCharacter}${remaining}`;
    }

    return filePath;
}


export function isPathEqual(uri1: string, uri2: string): boolean {
    const filePath1 = extractFilePath(uri1);
    const filePath2 = extractFilePath(uri2);
    return filePath1 === filePath2;
}
