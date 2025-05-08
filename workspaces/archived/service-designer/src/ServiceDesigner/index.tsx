/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js no-submodule-imports
import React, { useContext, useEffect, useState } from "react";

import { Grid, Tooltip, Typography } from "@material-ui/core";
import { default as AddIcon } from "@material-ui/icons/Add";
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import { IBallerinaLangClient } from "@wso2-enterprise/ballerina-languageclient";
import { ConfigOverlayFormStatus, SettingsIcon } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import {
    ModulePart,
    NodePosition,
    ResourceAccessorDefinition,
    ServiceDeclaration,
    STKindChecker,
    STNode,
} from "@wso2-enterprise/syntax-tree";

import { ResourceBody } from "./components/Resource";
import { ServiceHeader } from "./components/ServiceHeader/ServiceHeader";
import { useStyles } from "./style";
import "./style.scss";
import { RecordEditorProps } from "./types";

export interface ServiceDesignProps {
    model: STNode;
    langClientPromise: Promise<IBallerinaLangClient>;
    currentFile?: {
        content: string,
        path: string,
        size: number
    };
    onClose: () => void;
    handleDiagramEdit: (model: STNode, targetPosition: NodePosition, configOverlayFormStatus: ConfigOverlayFormStatus, onClose?: () => void, onSave?: () => void) => void;
    fullST: any;
    getDiagramEditorLangClient: any;
    getExpressionEditorLangClient: any;
    gotoSource: any;
    handleResourceDefInternalNav: (model: ResourceAccessorDefinition) => void;
    modifyDiagram: any;
    recordEditor: (props: RecordEditorProps) => JSX.Element;
}

export function ServiceDesigner(props: ServiceDesignProps) {

    const {
        model,
        handleDiagramEdit,
        currentFile,
        fullST,
        getDiagramEditorLangClient,
        getExpressionEditorLangClient,
        gotoSource,
        handleResourceDefInternalNav,
        langClientPromise,
        modifyDiagram,
        onClose,
        recordEditor
    } = props;

    const RecordEditor = recordEditor;

    const [isAllExpanded, setIsAllExpanded] = useState(false);
    const [children, setChildren] = useState<JSX.Element[]>([]);

    const classes = useStyles();

    const serviceST = model as ServiceDeclaration;

    useEffect(() => {
        const cc: JSX.Element[] = [];
        serviceST?.members.forEach((member) => {
            if (STKindChecker.isResourceAccessorDefinition(member)) {
                const startPosition = member.position?.startLine + ":" + member.position?.startColumn;
                cc.push(
                    <div className={'service-member'} data-start-position={startPosition} >
                        <ResourceBody
                            handleDiagramEdit={handleDiagramEdit}
                            model={member as ResourceAccessorDefinition}
                            isExpandedAll={isAllExpanded}
                            renderRecordPanel={renderRecordPanel}
                            currentFile={currentFile}
                            fullST={fullST}
                            getDiagramEditorLangClient={getDiagramEditorLangClient}
                            getExpressionEditorLangClient={getExpressionEditorLangClient}
                            gotoSource={gotoSource}
                            handleResourceDefInternalNav={handleResourceDefInternalNav}
                            modifyDiagram={modifyDiagram}
                        />
                    </div>
                );
            }
        });
        setChildren(cc);
    }, [serviceST, isAllExpanded]);



    const onExpandAllClick = () => {
        const ex = !isAllExpanded;
        setIsAllExpanded(ex);
    }

    const onSave = () => {
        // Record Editor Save
    }

    const renderRecordPanel = (closeRecordEditor: (createdRecord?: string) => void) => {
        const eofToken: NodePosition = (fullST as ModulePart).eofToken.position;
        const lastMemberPosition: NodePosition = {
            startLine: eofToken.endLine,
            startColumn: eofToken.endColumn,
            endLine: eofToken.endLine,
            endColumn: eofToken.endColumn,
        }
        return (
            <RecordEditor
                formType={""}
                targetPosition={lastMemberPosition}
                name={"record"}
                onCancel={closeRecordEditor}
                onSave={onSave}
                isTypeDefinition={true}
                isDataMapper={false}
                showHeader={true}
            />
        );
    };

    const emptyView = (
        <Grid
            container={true}
            direction="column"
            justify="center"
            alignItems="center"
            className={classes.gridContainer}
        >
            <Grid item={true}>
                <Typography variant="h3" component="div">
                    Service list is empty
                </Typography>
            </Grid>
            <Grid item={true}>
                <Typography variant="subtitle1" component="div">
                    Add a new resource
                </Typography>
            </Grid>
        </Grid>
    );

    return (
        <div className={classes.root} data-testid="service-design-view">
            {serviceST && (
                <>
                   <ServiceHeader model={serviceST} handleDiagramEdit={handleDiagramEdit} renderRecordPanel={renderRecordPanel} />
                    {children.length > 0 && (
                        <div className={classes.expandAll}>
                            <div className={classes.collapseBtn} onClick={onExpandAllClick}>
                                <Typography variant="body1">{isAllExpanded ? "Collapse All" : "Expand All"}</Typography>
                                {isAllExpanded && <UnfoldLessIcon onClick={onExpandAllClick} />}
                                {!isAllExpanded && <UnfoldMoreIcon onClick={onExpandAllClick} />}
                            </div>
                        </div>
                    )}
                    <div className={classes.serviceList}>
                        <>
                            {children.length > 0 ? children : emptyView}
                        </>
                    </div>

                </>
            )}

        </div>
    )
}
