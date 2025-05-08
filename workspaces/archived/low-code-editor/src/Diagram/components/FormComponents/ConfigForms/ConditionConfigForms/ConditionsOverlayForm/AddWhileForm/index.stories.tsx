/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';

// tslint:disable-next-line: no-submodule-imports
import { Story } from '@storybook/react/types-6-0';
import { FileListEntry } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition } from '@wso2-enterprise/syntax-tree';

import { Provider as LowCodeEditorProvider } from "../../../../../../../Contexts/Diagram";
import { ComponentViewInfo } from '../../../../../../../OverviewDiagram/util';

import { AddWhileForm, WhileProps } from "./index";


export default {
    title: 'Low Code Editor/Testing/Diagram/Statements/While',
    component: AddWhileForm,
};

// tslint:disable-next-line:no-empty
const dummyFunction = async (arg: any) => { };
const dummyFunctionReturn = (arg: any): any => { return; };
const dummyWithBooleanReturn = async (arg: any) => {
    return true;
};
// tslint:disable-next-line:no-empty
const dummyFunctionWithoutArgs = () => { };
// tslint:disable-next-line:no-empty
const asyncDummyFunctionWithoutArgs = async () => { };

const api = {
    tour: { goToNextTourStep: dummyFunction },
    helpPanel: { openConnectorHelp: dummyFunction },
    notifications: {},
    ls: {},
    insights: { onEvent: dummyFunction },
    code: {
        modifyDiagram: dummyFunction,
        onMutate: dummyFunction,
        modifyTrigger: dummyFunction,
        setCodeLocationToHighlight: dummyFunction,
        gotoSource: dummyFunction,
        updateFileContent: dummyWithBooleanReturn,
        isMutationInProgress: false,
        isModulePullInProgress: false,
        loaderText: '',
        getFunctionDef: dummyFunctionReturn,
        undo: asyncDummyFunctionWithoutArgs
    },
    splitPanel: {
        maximize: dummyFunction,
        minimize: dummyFunction,
        setPrimaryRatio: dummyFunction,
        setSecondaryRatio: dummyFunction,
        handleRightPanelContent: dummyFunction
    },
    panNZoom: {
        pan: dummyFunction,
        fitToScreen: dummyFunctionWithoutArgs,
        zoomIn: dummyFunctionWithoutArgs,
        zoomOut: dummyFunctionWithoutArgs,
    },
    configPanel: {
        dispactchConfigOverlayForm: dummyFunction,
        closeConfigOverlayForm: dummyFunctionWithoutArgs,
        configOverlayFormPrepareStart: dummyFunctionWithoutArgs,
        closeConfigPanel: dummyFunctionWithoutArgs,
    },
    webView: {
        showTryitView: dummyFunction,
    },
    project: {
        run: dummyFunction
    },
    navigation: {
        // tslint:disable-next-line:no-empty
        updateActiveFile: (currentFile: FileListEntry) => { },
        // tslint:disable-next-line:no-empty
        updateSelectedComponent: (info: ComponentViewInfo) => { },
        // tslint:disable-next-line:no-empty
        navigateUptoParent: (position: NodePosition) => { }
    }
}


export const mockedEditorProps = {
    api,
    currentFile: {
        // @ts-ignore
        type: undefined,
        path: '',
        size: 3,
        content: ''
    },
    // @ts-ignore
    fileList: undefined,
    // @ts-ignore
    syntaxTree: undefined,
    // @ts-ignore
    fullST: undefined,
    // @ts-ignore
    originalSyntaxTree: undefined,
    // @ts-ignore
    stSymbolInfo: undefined,
    langServerURL: '',
    // @ts-ignore
    configOverlayFormStatus: undefined,
    // @ts-ignore
    configPanelStatus: undefined,
    isCodeEditorActive: false,
    isPerformanceViewOpen: false,
    isLoadingSuccess: false,
    isWaitingOnWorkspace: false,
    isMutationProgress: false,
    isCodeChangeInProgress: false,
    isReadOnly: false,
    // @ts-ignore
    zoomStatus: undefined,
    importStatements: ['']
}

const Template: Story<WhileProps> = (args: WhileProps) => {
    return (
        <LowCodeEditorProvider {...mockedEditorProps} >
            <AddWhileForm {...args} />
        </LowCodeEditorProvider>
    );
}

export const While = Template.bind({});
While.args = {
    condition: {
        type: ''
    },
    formArgs: {
        targetPosition: {
            startLine: '',
            endLine: ''
        }
    }
};
