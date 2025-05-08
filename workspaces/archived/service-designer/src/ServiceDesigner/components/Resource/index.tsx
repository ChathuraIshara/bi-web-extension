/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js, jsx-no-lambda
import { URI } from "vscode-uri";
import React, { useContext, useEffect, useState } from "react";
import { Tooltip } from "@material-ui/core";
import {
    BallerinaSTModifyResponse, CompletionResponse, ConfigOverlayFormStatus, CtrlClickWrapper, DiagramEditorLangClientInterface,
    LabelEditIcon, responseCodes, STModification
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { ConfigPanelSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { ModulePart, NodePosition, ResourceAccessorDefinition, STKindChecker, STNode, traversNode, TypeDefinition } from "@wso2-enterprise/syntax-tree";
import classNames from "classnames";
import { TextDocumentPositionParams } from "vscode-languageserver-protocol";

import { useStyles } from "../../style";
import { getKeywordTypes, HTTP_POST, isStructuredType, removeStatement } from "../../util";
import { visitor as RecordsFinderVisitor } from "../../visitors/records-finder-visitor";

import { ResourceHeader } from "./ResourceHeader";

export interface ResourceBodyProps {
    model: ResourceAccessorDefinition;
    handleDiagramEdit: (model: STNode, targetPosition: NodePosition, configOverlayFormStatus: ConfigOverlayFormStatus, onClose?: () => void, onSave?: () => void) => void;
    isExpandedAll: boolean;
    currentFile: any;
    fullST: any;
    modifyDiagram: any;
    gotoSource: any;
    getDiagramEditorLangClient: any;
    getExpressionEditorLangClient: any;
    handleResourceDefInternalNav: (model: ResourceAccessorDefinition) => void;
    renderRecordPanel: (closeRecordEditor: (createdRecord?: string) => void) => JSX.Element
}

export function ResourceBody(props: ResourceBodyProps) {
    const {
        model,
        handleDiagramEdit,
        isExpandedAll,
        currentFile,
        fullST,
        modifyDiagram,
        gotoSource,
        getDiagramEditorLangClient,
        getExpressionEditorLangClient,
        renderRecordPanel,
        handleResourceDefInternalNav
    } = props;

    const editStatementTxt = "Edit in statement editor";

    const classes = useStyles();
    const [isExpanded, setIsExpanded] = useState(false);
    const [schema, setSchema] = useState({});
    const [schemaParam, setSchemaParam] = useState({});
    const [responseArgs, setResponseArgs] = useState([]);
    const [types, setTypes] = useState([]);
    const [paramArgs, setParamArgs] = useState([]);
    const [payloadSchema, setPayloadSchema] = useState([]);

    useEffect(() => {
        getKeywordTypes(currentFile.path, getExpressionEditorLangClient).then(setTypes);
    }, []);

    useEffect(() => {
        setIsExpanded(isExpandedAll)
    }, [isExpandedAll]);

    useEffect(() => {
        if (types.length > 0) {
            renderResponses(types).then(setResponseArgs);
        }
        renderParameters().then(setParamArgs);
    }, [schema, schemaParam]);

    useEffect(() => {
        if (types.length > 0) {
            renderResponses(types).then(setResponseArgs);
        }
    }, [types]);

    useEffect(() => {
        setSchema({});
        setSchemaParam({});
        if (types.length > 0) {
            renderResponses(types).then(setResponseArgs);
        }
        renderParameters().then(setParamArgs);
    }, [model]);

    const handleIsExpand = () => {
        setIsExpanded(!isExpanded)
    }

    const onEdit = (e?: React.MouseEvent) => {
        e.stopPropagation();
        const lastMemberPosition: NodePosition = {
            endColumn: model.position.endColumn,
            endLine: model.position.endLine - 1,
            startColumn: model.position.startColumn,
            startLine: model.position.startLine - 1
        }
        handleDiagramEdit(model, lastMemberPosition, { formType: "ResourceAccessorDefinition", isLoading: false, renderRecordPanel });
    }

    const handleDeleteBtnClick = (e?: React.MouseEvent) => {
        e.stopPropagation();
        const modifications: STModification[] = [];
        const deleteAction: STModification = removeStatement(
            model.position
        );
        modifications.push(deleteAction);
        modifyDiagram(modifications);
    }



    const bodyArgs: any[] = [];

    model.functionSignature?.parameters?.forEach((param, i) => {
        // value = record {|*http:Ok; Foo body;|}
        if (STKindChecker.isRequiredParam(param) && (param.source.includes("Payload") || (i === 0 && param.annotations.length === 0 && isStructuredType(param.typeName)))) {
            const typeSymbol = param.typeData?.typeSymbol;
            const typeName = typeSymbol?.name || typeSymbol?.memberTypeDescriptor?.name;
            if (typeName) {
                const onClickHandler = () => openRecordEditor(typeName)
                const payloadSchemaComponent = (
                    <pre className={classes.schema}>{payloadSchema[i]}
                        <Tooltip title={editStatementTxt} placement="right" enterDelay={1000} enterNextDelay={1000}>
                            <div onClick={onClickHandler} className={classes.recordEdit}><LabelEditIcon /></div>
                        </Tooltip>
                    </pre>
                )
                bodyArgs.push(
                    <tr key={i} className={classes.signature}>
                        <td>
                            <div>
                                Schema : <span
                                    className={classes.schemaButton}
                                    onClick={() => recordEditor(payloadSchema, setPayloadSchema, typeName, i)}
                                >
                                    {param.typeName?.source.trim()}
                                </span> :{param.paramName?.value}
                                {payloadSchema[i] && payloadSchemaComponent}
                            </div>
                        </td>
                    </tr>
                )
            } else {
                bodyArgs.push(
                    <div key={i} className={classes.signature}>
                        {param.source}
                    </div>
                )
            }
        }
    });

    traversNode(model, RecordsFinderVisitor);
    const records = RecordsFinderVisitor.getRecords();

    function getReturnTypesArray() {
        const returnTypes = model.functionSignature?.returnTypeDesc?.type?.source.split(/\|(?![^\{]*[\}])/gm);
        return returnTypes || [];
    }

    const getRecord = async (
        recordName: any,
        langClient: DiagramEditorLangClientInterface,
    ): Promise<BallerinaSTModifyResponse> => {
        const record: STNode = records.get(recordName.replace(/[\[\]\?]/g, "").trim());
        if (record) {
            const request: TextDocumentPositionParams = {
                textDocument: { uri: URI.file(currentFile.path).toString() },
                position: { line: record.position.startLine, character: record.position.startColumn }
            };
            return langClient.getDefinitionPosition(request);
        }
    };

    function defaultResponseCode() {
        const isPost = model?.functionName.value.toUpperCase() === HTTP_POST;
        return isPost ? "201" : "200";
    }

    async function renderResponses(keywordTypes: CompletionResponse[]) {
        const values = await getReturnTypesArray();
        const langClient = await getDiagramEditorLangClient();
        const responses = [];

        for (const [i, value] of values.entries()) {
            let code = defaultResponseCode();
            let recordName = value.replace("?", "").trim();
            let des = "";

            responseCodes.forEach(item => {
                if (recordName.includes(item.source)) {
                    code = item.code.toString();
                }
            });

            keywordTypes.forEach(item => {
                if (recordName.replace(/\[\]/g, "").trim() === item.insertText) {
                    code = defaultResponseCode();
                }
            })

            if (value.includes("error")) {
                code = "500";
            }

            if (value.includes("body")) {
                recordName = value.split(";").find(item => item.includes("body")).trim().split("body")[0].trim();
                const recordInfo = await getRecord(recordName, langClient);
                des = value.split("|*").length > 0 ? value.split("|*")[1].split(";")[0] : "";
                const tooltip = (
                    <pre className={classes.schema}>
                        {schema[i]}
                        <Tooltip title={editStatementTxt} placement="right" enterDelay={1000} enterNextDelay={1000}>
                            <div onClick={() => openRecordEditor(recordName)} className={classes.recordEdit}><LabelEditIcon /></div>
                        </Tooltip>
                    </pre>
                );
                responses.push(
                    <tr key={i} className={classes.signature}>
                        <td>
                            {code}
                        </td>
                        <td>
                            {des}
                            <div>
                                Record Schema :
                                <span className={recordInfo && recordInfo.parseSuccess ? classes.schemaButton : ""} onClick={() => recordEditor(schema, setSchema, recordName, i)}>
                                    {recordName}
                                </span>
                                {schema[i] && tooltip}
                            </div>
                        </td>
                    </tr>
                )
            } else {
                const recordInfo = await getRecord(value, langClient);

                if (recordInfo && recordInfo.parseSuccess) {
                    const ST: TypeDefinition = recordInfo.syntaxTree as TypeDefinition;
                    code = defaultResponseCode();
                    responseCodes.forEach(item => {
                        if (ST.source.includes(item.source)) {
                            code = item.code.toString();
                        }
                    });
                }
                const tooltip = (
                    <pre className={classes.schema}>
                        {schema[i]}
                        <Tooltip title={editStatementTxt} placement="right" enterDelay={1000} enterNextDelay={1000}>
                            <div onClick={() => openRecordEditor(recordName)} className={classes.recordEdit}><LabelEditIcon /></div>
                        </Tooltip>
                    </pre>
                );
                responses.push(
                    <tr key={i} className={classes.signature}>
                        <td>
                            {code}
                        </td>
                        <td>
                            <span className={recordInfo && recordInfo.parseSuccess ? classes.schemaButton : ""} onClick={() => recordEditor(schema, setSchema, recordName, i)}>
                                {recordName}
                            </span>
                            {schema[i] && tooltip}
                        </td>
                    </tr>
                )
            }
        }

        if (values.length === 0 || values.findIndex(val => val.includes("?")) > -1) {
            const method = model.functionName.value.toUpperCase();
            responses.push(
                <tr key={0} className={classes.defaultResponse}>
                    <td>
                        {method === HTTP_POST ? "201" : "202"}
                    </td>
                    <td>
                        <span>
                            {"Default Response"}
                        </span>
                    </td>
                </tr>
            )
        }
        return responses;
    }

    async function renderParameters() {
        const values = model.functionSignature?.parameters;
        const langClient = await getDiagramEditorLangClient();
        const responses = [];
        for (const [i, param] of values.entries()) {
            if (
                (STKindChecker.isRequiredParam(param) || STKindChecker.isDefaultableParam(param))
                && (!param.source.includes("Payload") && !(i === 0 && param.annotations.length === 0 && isStructuredType(param.typeName)))
            ) {
                let paramDetails = param.source.split(" ");
                let annotation = "";
                if (param.annotations.length > 0) {
                    annotation = param.annotations[0].source;
                    const sourceWithoutAnnotation = param.source.replace(annotation, "");
                    paramDetails = sourceWithoutAnnotation.split(" ");
                }
                const recordName = paramDetails[0];
                let description = paramDetails.length > 0 && paramDetails[1];
                if (paramDetails.length > 2) {
                    description = paramDetails.slice(1).join(" ");
                }
                const recordInfo = await getRecord(recordName.trim(), langClient);
                const onClickHandler = () => openRecordEditor(recordName);
                const tooltip = (
                    <pre className={classes.schema}>
                        {schemaParam[i]}
                        <Tooltip title={editStatementTxt} placement="right" enterDelay={1000} enterNextDelay={1000}>
                            <div onClick={onClickHandler} className={classes.recordEdit}><LabelEditIcon /></div>
                        </Tooltip>
                    </pre>
                );
                responses.push(
                    <tr key={i} className={classes.signature}>
                        <td>
                            {annotation && <span className={classes.annotation}>{annotation}</span>}
                            <span className={recordInfo && recordInfo.parseSuccess ? classes.schemaButton : ""} onClick={() => recordEditor(schemaParam, setSchemaParam, recordName, i)}>
                                {recordName}
                            </span>
                            {schemaParam[i] && tooltip}
                        </td>
                        <td>
                            {description}
                        </td>
                    </tr>
                )
            }
        };
        return responses;
    }

    const recordEditor = async (schemaValue: {} | [], setSchemaState: React.Dispatch<React.SetStateAction<{}>>, record: any, key?: any) => {

        if (schemaValue.hasOwnProperty(key)) {
            const updatedSchema = { ...schema };
            delete updatedSchema[key];
            setSchemaState(updatedSchema);
            return;
        }
        const langClient = await getDiagramEditorLangClient();
        const recordInfo = await getRecord(record, langClient);

        if (recordInfo && recordInfo.parseSuccess) {
            const ST: TypeDefinition = recordInfo.syntaxTree as TypeDefinition;
            setSchemaState({ ...schema, [key]: [ST.source] })
        }
    }

    const openRecordEditor = async (record: any) => {

        const langClient = await getDiagramEditorLangClient();
        const recordInfo = await getRecord(record, langClient);

        if (recordInfo && recordInfo.parseSuccess) {
            const ST: TypeDefinition = recordInfo.syntaxTree as TypeDefinition;
            handleDiagramEdit(ST, ST.position, { formType: "RecordEditor", isLoading: false });
        }
    }

    const args = (
        <>
            <ConfigPanelSection title={"Parameters"}>
                <table className={classes.responseTable}>
                    <thead>
                        <td>Type</td>
                        <td>Description</td>
                    </thead>
                    <tbody>
                        {paramArgs}
                    </tbody>
                </table>
            </ConfigPanelSection>
            {/* <Divider className="resource-divider" /> */}
        </>
    );

    const bodyAr = (
        <>
            <ConfigPanelSection title={"Body"}>
                <table className={classes.responseTable}>
                    <thead>
                        <td>Description</td>
                    </thead>
                    <tbody>
                        {bodyArgs}
                    </tbody>
                </table>
            </ConfigPanelSection>

            {/* <Divider className="resource-divider" /> */}
        </>
    )

    const metaData = (
        <div className="service-member" onClick={handleIsExpand}>
            <table className={classes.responseTable}>
                <tbody>
                    {model.metadata?.source.split("#").map(value => !value.includes("+") && value)}
                </tbody>
            </table>
        </div>
    )

    const body = (
        <>
            {model.metadata && metaData}
            <div className="service-member">
                {paramArgs.length > 0 && args}

                {bodyArgs.length > 0 && bodyAr}

                <ConfigPanelSection title={"Responses"}>
                    <table className={classes.responseTable}>
                        <thead>
                            <td>Code</td>
                            <td>Description</td>
                        </thead>
                        <tbody>
                            {responseArgs}
                        </tbody>
                    </table>
                </ConfigPanelSection>
            </div>
        </>
    )

    const handleGoToSource = () => {
        gotoSource(model.position, currentFile.path);
    }

    return (
        <CtrlClickWrapper
            onClick={handleGoToSource}
        >
            <div id={"resource"} className={classNames("function-box", model.functionName.value)}>
                <ResourceHeader
                    isExpanded={isExpanded}
                    onExpandClick={handleIsExpand}
                    model={model}
                    onEdit={onEdit}
                    onDelete={handleDeleteBtnClick}
                    handleResourceDefInternalNav={handleResourceDefInternalNav}
                />
                {isExpanded && body}
            </div>
        </CtrlClickWrapper>
    );
}
