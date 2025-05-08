/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Project, ProjectOptions } from "ts-morph";

export class DMProject {
    private _project: Project;
    private static _instance: DMProject;

    private constructor(filePath: string, options?: ProjectOptions) {
        this._project = new Project(options);
        this._project.addSourceFileAtPath(filePath);
    }

    public static getInstance(filePath: string, options?: ProjectOptions): DMProject {
        if (!this._instance?._project?.getSourceFile(filePath)) {
            this._instance = new DMProject(filePath, options);
        }
        return this._instance;
    }

    public getProject(): Project {
        return this._project;
    }

    public static refreshProject(filePath: string, options?: ProjectOptions){
        this._instance = new DMProject(filePath, options);
    }
}

