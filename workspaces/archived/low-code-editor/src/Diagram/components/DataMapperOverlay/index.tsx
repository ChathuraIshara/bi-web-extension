/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-wrap-multiline
import React, { useContext, useEffect, useRef } from "react";

import { DataMapper } from "@wso2-enterprise/ballerina-data-mapper";
import { IBallerinaLangClient } from "@wso2-enterprise/ballerina-languageclient";
import {
    ComponentInfo,
    ComponentViewInfo,
    ConfigOverlayFormStatus,
    DiagramEditorLangClientInterface,
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import {
    FunctionDefinition,
    ModulePart,
    NodePosition,
    STKindChecker,
    STNode,
} from "@wso2-enterprise/syntax-tree";
import { Uri } from "monaco-editor";

import { Context } from "../../../Contexts/Diagram";
import { WorkspaceFolder } from "../../../DiagramGenerator/vscode/Diagram";
import { useHistoryContext } from "../../../DiagramViewManagerClone/context/history";
import { extractFilePath, isPathEqual } from "../../../DiagramViewManagerClone/utils";
import { RecordEditor } from "../FormComponents/ConfigForms";
import { DiagramOverlayContainer } from "../Portals/Overlay";

import { dataMapperStyles } from "./style";

export interface DataMapperProps {
    model?: STNode;
    currentProject?: WorkspaceFolder;
    lastUpdatedAt?: string;
    targetPosition?: NodePosition;
    ballerinaVersion?: string;
    onCancel?: () => void;
    configOverlayFormStatus?: ConfigOverlayFormStatus;
    openedViaPlus?: boolean;
}

export function DataMapperOverlay(props: DataMapperProps) {
    const { currentProject, lastUpdatedAt, targetPosition, ballerinaVersion, onCancel: onClose, model, openedViaPlus } = props;

    const dataMapperClasses = dataMapperStyles();

    const {
        props: { currentFile, stSymbolInfo, importStatements, fullST },
        api: {
            code: { modifyDiagram, updateFileContent, gotoSource },
            ls: { getDiagramEditorLangClient },
            library,
            navigation: {
                updateActiveFile,
                updateSelectedComponent
            }
        }
    } = useContext(Context);

    const { history, historyPush, historyUpdateCurrentEntry } = useHistoryContext();

    const [functionST, setFunctionST] =
        React.useState<FunctionDefinition>(undefined);
    const [newFnName, setNewFnName] = React.useState("");
    const isMounted = useRef(false);
    const [moduleVariables, setModuleVaribles] = React.useState(undefined);

    useEffect(() => {
        (async () => {
            if (isMounted.current) {
                if (newFnName !== "") {
                    handleFunctionST(newFnName).then();
                } else if (model && STKindChecker.isFunctionDefinition(model)) {
                    handleFunctionST(model.functionName.value).then();
                } else if (!!functionST) {
                    handleFunctionST(functionST.functionName.value).then();
                }
            } else {
                isMounted.current = true;
            }
        })();
    }, [currentFile.content]);

    useEffect(() => {
        (async () => {
            await getModuleVariables()
        })();
    }, [currentProject, lastUpdatedAt])

    useEffect(() => {
        if (model && STKindChecker.isFunctionDefinition(model)) {
            setFunctionST(model);
        }
    }, [model]);

    const getModuleVariables = async () => {
        const moduleVars = []
        const consts = []
        const enums = []
        const langClient: DiagramEditorLangClientInterface = await getDiagramEditorLangClient();
        const componentResponse = await langClient.getBallerinaProjectComponents({
            documentIdentifiers: [
                {
                    uri: Uri.file(currentFile.path).toString(),
                }
            ]
        })
        for (const pkg of componentResponse.packages) {
            for (const mdl of pkg.modules) {
                for (const moduleVariable of mdl.moduleVariables) {
                    moduleVars.push(moduleVariable);
                }
                for (const constant of mdl.constants) {
                    consts.push(constant);
                }
                for (const enumType of mdl.enums) {
                    enums.push({
                        filePath: pkg.filePath,
                        enum: enumType,
                    });
                }
            }
        }
        setModuleVaribles({
            moduleVarDecls: moduleVars,
            constDecls: consts,
            enumDecls: enums,
        })
    }

    const handleFunctionST = async (funcName: string) => {
        const langClient: DiagramEditorLangClientInterface =
            await getDiagramEditorLangClient();
        const { parseSuccess, syntaxTree } = await langClient.getSyntaxTree({
            documentIdentifier: {
                uri: Uri.file(currentFile.path).toString(),
            },
        });
        if (parseSuccess) {
            const modPart = syntaxTree as ModulePart;
            const fns = modPart.members.filter((mem) =>
                STKindChecker.isFunctionDefinition(mem)
            ) as FunctionDefinition[];
            const st = fns.find((mem) => mem.functionName.value === funcName);
            if (isPathEqual(history[history.length - 1].file, currentFile.path) && history[history.length - 1].name === funcName) {
                historyUpdateCurrentEntry({ ...history[history.length - 1], position: st.position })
            } else {
                historyPush({ file: currentFile.path, position: st.position, fromDataMapper: true, dataMapperDepth: 0 });
            }
            return;
        }
        setFunctionST(undefined);
    };

    const onSave = (fnName: string) => {
        setNewFnName(fnName);
    };

    const renderRecordPanel = (panelProps: { targetPosition: NodePosition, closeAddNewRecord: (createdNewRecord?: string) => void }) => {
        return (
            <RecordEditor
                formType={""}
                targetPosition={panelProps.targetPosition}
                name={"record"}
                onCancel={panelProps.closeAddNewRecord}
                onSave={onSave}
                isTypeDefinition={true}
                isDataMapper={true}
            />
        );
    };

    const handleInternalNavigation = (info: ComponentViewInfo) => {
        historyPush({
            file: extractFilePath(info.filePath),
            position: info.position,
            fromDataMapper: true,
            dataMapperDepth: history[history.length - 1].dataMapperDepth + 1,
            name: info.name
        });
    }

    return (
        <DiagramOverlayContainer>
            <div className={dataMapperClasses.dataMapperContainer}>
                <DataMapper
                    library={library}
                    targetPosition={targetPosition}
                    fnST={functionST}
                    langClientPromise={
                        getDiagramEditorLangClient() as unknown as Promise<IBallerinaLangClient>
                    }
                    filePath={currentFile.path}
                    currentFile={currentFile}
                    openedViaPlus={openedViaPlus}
                    stSymbolInfo={stSymbolInfo}
                    moduleVariables={moduleVariables}
                    ballerinaVersion={ballerinaVersion}
                    applyModifications={modifyDiagram}
                    updateFileContent={updateFileContent}
                    goToSource={gotoSource}
                    onClose={onClose}
                    onSave={onSave}
                    importStatements={importStatements}
                    recordPanel={renderRecordPanel}
                    syntaxTree={fullST}
                    updateActiveFile={updateActiveFile}
                    updateSelectedComponent={handleInternalNavigation}
                />
            </div>
        </DiagramOverlayContainer>
    );
}
