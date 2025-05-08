/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useEffect, useState } from "react";

import { BallerinaProjectComponents, FileListEntry } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

import { useDiagramContext } from "../Contexts/Diagram";
import { WorkspaceFolder } from "../DiagramGenerator/vscode/Diagram";

import { TopLevelActionButton } from "./components/TopLevelActionButton";
import { CategoryView } from "./components/ViewTypes/CategoryView";
import './style.scss';
import { ComponentViewInfo } from "./util";

export const DEFAULT_MODULE_NAME = 'default';

export interface OverviewDiagramProps {
    lastUpdatedAt: string;
    currentProject: WorkspaceFolder;
    currentFile: string;
    currentFileName: string;
    notifyComponentSelection: (info: ComponentViewInfo) => void;
    updateCurrentFile: (filePath: string) => void;
    fileList: FileListEntry[];
    triggerUpdateFileContent: () => void;
}

export function OverviewDiagram(props: OverviewDiagramProps) {
    const { api: { ls: { getDiagramEditorLangClient } } } = useDiagramContext();
    const {
        currentProject, currentFile, notifyComponentSelection, lastUpdatedAt, updateCurrentFile, fileList,
        currentFileName, triggerUpdateFileContent
    } = props;
    const [projectComponents, updateProjectComponenets] = useState<BallerinaProjectComponents>();

    useEffect(() => {
        (async () => {
            try {
                if (currentProject) {
                    const langClient = await getDiagramEditorLangClient();
                    const componentResponse: BallerinaProjectComponents = await langClient.getBallerinaProjectComponents({
                        documentIdentifiers: [{ uri: currentProject.uri.external }]
                    });

                    updateProjectComponenets(componentResponse);
                    triggerUpdateFileContent();
                }
            } catch (err) {
                // tslint:disable-next-line: no-console
                console.error(err);
            }
        })();
    }, [lastUpdatedAt, currentProject]);

    const hasProjectComponents = projectComponents && !!projectComponents.packages;

    const renderCategoryView = () => (
        <>
            <CategoryView
                projectComponents={projectComponents}
                currentFile={currentFile}
                currentFileName={currentFileName}
                updateSelection={notifyComponentSelection}
                updateCurrentFile={updateCurrentFile}
                fileList={fileList}
            />
        </>
    )

    const renderEmptyProjectMessage = () => (
        <div className="empty-message" >No ballerina components detected.</div>
    );

    return (
        <div className="view-container">
            {hasProjectComponents && renderCategoryView()}
            {!hasProjectComponents && renderEmptyProjectMessage()}
        </div>
    )
}
