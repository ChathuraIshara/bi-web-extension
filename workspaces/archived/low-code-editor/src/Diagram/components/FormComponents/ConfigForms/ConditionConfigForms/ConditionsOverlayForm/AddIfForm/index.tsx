/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext, useState } from "react";
import { useIntl } from "react-intl";

import { FormControl, IconButton, Typography } from "@material-ui/core";
import { ControlPoint, RemoveCircleOutlineRounded } from "@material-ui/icons";
import { ExpressionEditorProps } from "@wso2-enterprise/ballerina-expression-editor";
import { ConditionConfig, DiagramDiagnostic, ElseIfConfig, FormField } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormActionButtons, FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { StatementEditorWrapper } from "@wso2-enterprise/ballerina-statement-editor";
import { BlockStatement, IfElseStatement, NodePosition } from "@wso2-enterprise/syntax-tree";

import Tooltip from '../../../../../../../components/TooltipV2'
import { Context } from "../../../../../../../Contexts/Diagram";
import {
    createElseIfStatement,
    createElseIfStatementWithBlock,
    createElseStatement,
    createElseStatementWithBlock,
    createIfStatement,
    createIfStatementWithBlock,
    getInitialSource
} from "../../../../../../utils";
import { useStyles } from "../../../../DynamicConnectorForm/style";
import { LowCodeExpressionEditor } from "../../../../FormFieldComponents/LowCodeExpressionEditor";
import { FormElementProps } from "../../../../Types";
import { isStatementEditorSupported } from "../../../../Utils";

interface IfProps {
    condition: ConditionConfig;
    formArgs: any;
    onCancel: () => void;
    onSave: () => void;
    onWizardClose: () => void;
}

export const DEFINE_CONDITION: string = "Define Condition Expression";

interface ExpressionsArray {
    id: number;
    expression: string;
    position: NodePosition;
    diagnostics?: DiagramDiagnostic[];
    isValid?: boolean;
}

export function AddIfForm(props: IfProps) {
    const {
        props: {
            isMutationProgress: isMutationInProgress,
            currentFile,
            fullST,
            stSymbolInfo,
            importStatements,
            experimentalEnabled,
            ballerinaVersion,
            isCodeServerInstance
        },
        api: {
            ls: { getExpressionEditorLangClient },
            code: {
                modifyDiagram,
                updateFileContent
            },
            library,
            openExternalUrl
        },
    } = useContext(Context);
    const { condition, formArgs, onCancel, onSave, onWizardClose } = props;
    const classes = useStyles();
    const intl = useIntl();

    let statementConditions: ExpressionsArray[];
    statementConditions = (condition.conditionExpression as ElseIfConfig)?.values
        ? (condition.conditionExpression as ElseIfConfig).values
        : [{ id: 0, expression: "", position: {}, isValid: false }];
    const [compList, setCompList] = useState(
        statementConditions.map((item) => ({
            ...item,
            isValid: item.diagnostics?.length === 0,
        }))
    );

    const handlePlusButton = (order: number) => () => {
        if (order === -1) {
            setCompList((prev) => {
                return [...prev, { id: prev.length, expression: "", position: {}, isValid: false }];
            });
        } else {
            setCompList((prev) => {
                return [...prev.slice(0, order), { id: order, expression: "", position: {}, isValid: false }, ...prev.slice(order, prev.length)];
            });
        }
    };

    const handleMinusButton = (order: number) => () => {
        setCompList(
            compList.filter((comp) => {
                return comp.id !== order;
            })
        );
    };

    const handleExpEditorChange = (order: number) => (value: string) => {
        setCompList((prevState) => {
            return [...prevState.slice(0, order), { ...prevState[order], expression: value }, ...prevState.slice(order + 1, prevState.length)];
        });
    };

    const validateExpEditor = (isInvalid: boolean, order: number) => {
        setCompList((prevState) => {
            return [...prevState.slice(0, order), { ...prevState[order], isValid: !isInvalid }, ...prevState.slice(order + 1, prevState.length)];
        });
    };

    const setFormField = (order: number): FormField => {
        return {
            name: "condition",
            displayName: "Condition",
            typeName: "boolean",
            value: compList[order]?.expression,
        };
    };

    const getInitialDiagnostics = (order: number): DiagramDiagnostic[] => compList[order]?.diagnostics;

    const IFStatementTooltipMessages = {
        title: intl.formatMessage({
            id: "lowcode.develop.configForms.IFStatementTooltipMessages.expressionEditor.tooltip.title",
            defaultMessage: "Press CTRL+Spacebar for suggestions.",
        }),
        actionText: intl.formatMessage({
            id: "lowcode.develop.configForms.IFStatementTooltipMessages.expressionEditor.tooltip.actionText",
            defaultMessage: "Learn about Ballerina expressions here",
        }),
        actionLink: intl.formatMessage(
            {
                id: "lowcode.develop.configForms.IFStatementTooltipMessages.expressionEditor.tooltip.actionTitle",
                defaultMessage: "{learnBallerina}",
            },
            { learnBallerina: "https://ballerina.io/1.2/learn/by-example/if-else.html?is_ref_by_example=true#iMainNavigation" }
        ),
        codeBlockTooltip: intl.formatMessage({
            id: "lowcode.develop.configForms.IFStatementTooltipMessages.expressionEditor.tooltip.codeBlock",
            defaultMessage: "To add code inside the if block, save if condition and use the diagram add buttons",
        }),
    };

    const setElementProps = (order: number): FormElementProps<ExpressionEditorProps> => {
        return {
            model: setFormField(order),
            customProps: {
                validate: (_name: string, isInvalid: boolean) => validateExpEditor(isInvalid, order),
                tooltipTitle: IFStatementTooltipMessages.title,
                tooltipActionText: IFStatementTooltipMessages.actionText,
                tooltipActionLink: IFStatementTooltipMessages.actionLink,
                interactive: true,
                statementType: setFormField(order).typeName,
                expressionInjectables: {
                    list: formArgs?.expressionInjectables?.list,
                    setInjectables: formArgs?.expressionInjectables?.setInjectables,
                },
                initialDiagnostics: getInitialDiagnostics(order),
                editPosition: {
                    startLine: formArgs?.model ? formArgs?.model.position.startLine : formArgs.targetPosition.startLine,
                    endLine: formArgs?.model ? formArgs?.model.position.startLine : formArgs.targetPosition.startLine,
                    startColumn: 0,
                    endColumn: 0
                }

            },
            onChange: handleExpEditorChange(order),
            defaultValue: compList[order]?.expression
        };
    };

    const handleOnSaveClick = () => {
        condition.conditionExpression = { values: compList };
        onSave();
    };

    const saveIfConditionButtonLabel = intl.formatMessage({
        id: "lowcode.develop.configForms.if.saveButton.label",
        defaultMessage: "Save",
    });

    const cancelIfButtonLabel = intl.formatMessage({
        id: "lowcode.develop.configForms.if.cancelButton.label",
        defaultMessage: "Cancel",
    });

    const formTitle = intl.formatMessage({
        id: "lowcode.develop.configForms.if.title",
        defaultMessage: "If"
    });

    const validForm = compList.every((item) => item.isValid) && compList[0]?.expression !== "";

    const getCompleteSource = () => {
        let source = "";
        if (formArgs.model){
            let currentModel = formArgs.model as IfElseStatement;
            source = source + getInitialSource(createIfStatementWithBlock(
                compList[0].expression ? compList[0].expression : 'EXPRESSION',
                currentModel.ifBody.statements.map(statement => {
                    return statement.source
                })
            ));
            if (compList.length > 1) {
                compList.map((element, index) => {
                    if (index !== 0){
                        currentModel = currentModel.elseBody.elseBody as IfElseStatement
                        source = source + getInitialSource(createElseIfStatementWithBlock(
                            element.expression ? element.expression : 'EXPRESSION',
                            currentModel.ifBody.statements.map(statement => {
                                return statement.source
                            })
                        ));
                    }
                })
            }
            if (currentModel.elseBody) {
                source = source + getInitialSource(createElseStatementWithBlock(
                    (currentModel.elseBody.elseBody as BlockStatement).statements.map(statement => {
                        return statement.source
                    })
                ));
            } else {
                source = source + "}";
            }

        }
        else {
            source = getInitialSource(createIfStatement(
                compList[0].expression ? compList[0].expression : 'EXPRESSION'
            ));
            if (compList.length > 1) {
                compList.map((element, index) => {
                    if (index !== 0){
                        source = source + getInitialSource(createElseIfStatement(element.expression ? element.expression : 'EXPRESSION'))
                    }
                })
            }
            source = source + getInitialSource(createElseStatement());
        }
        return source;
    }

    const initialSource = getCompleteSource();
    const statementEditorSupported = isStatementEditorSupported(ballerinaVersion);

    const ElseIfElement = (order: number) => {
        return (
            <div className={classes.elseBlockWrapper}>
                <div className={classes.elseIfExpressionWrapper}>
                    <Typography variant='body2' className={classes.endCode}>{`}`}</Typography>
                    {formArgs?.wizardType === 0 && (
                        <div className={classes.formCodeMinusWrapper}>
                            <IconButton
                                color="primary"
                                onClick={handleMinusButton(order)}
                                className={classes.button}
                                data-testid="minus-button"
                            >
                                <RemoveCircleOutlineRounded />
                            </IconButton>
                        </div>
                    )}
                    <Typography variant='body2' className={classes.startCode}>else if</Typography>
                    <div className={classes.formCodeExpressionSmallField}>
                        <LowCodeExpressionEditor {...setElementProps(order)} hideLabelTooltips={true} />
                    </div>
                    <Typography variant='body2' className={classes.endCode}>{`{`}</Typography>
                </div>
                <div className={classes.middleDottedwrapper}>
                    <Tooltip type='info' text={{ content: IFStatementTooltipMessages.codeBlockTooltip }}>
                        <Typography variant='body2' className={classes.middleCode}>...</Typography>
                    </Tooltip>
                </div>
            </div>
        )
    }

    return (
        <>
            {statementEditorSupported ? (
                StatementEditorWrapper(
                    {
                        label: formTitle,
                        initialSource,
                        formArgs: { formArgs },
                        config: condition,
                        onWizardClose,
                        onCancel,
                        currentFile,
                        getLangClient: getExpressionEditorLangClient,
                        applyModifications: modifyDiagram,
                        updateFileContent,
                        library,
                        syntaxTree: fullST,
                        stSymbolInfo,
                        importStatements,
                        experimentalEnabled,
                        ballerinaVersion,
                        isCodeServerInstance,
                        openExternalUrl,
                        skipSemicolon: true
                    }
                )
            ) : (
                <FormControl data-testid="if-form" className={classes.wizardFormControl}>
                    <FormHeaderSection
                        onCancel={onCancel}
                        formTitle={formTitle}
                        defaultMessage={"If"}
                    />
                    <div className={classes.formContentWrapper}>
                        <div className={classes.formCodeBlockWrapper}>
                            <div className={classes.formCodeExpressionEndWrapper}>
                                <Typography variant='body2' className={classes.ifStartCode}>if</Typography>
                                <div className={classes.formCodeExpressionField}>
                                    <LowCodeExpressionEditor {...setElementProps(0)} />
                                </div>
                                <Typography variant='body2' className={classes.endCode}>{`{`}</Typography>
                            </div>
                        </div>
                        <div className={classes.middleDottedwrapper}>
                            <Tooltip type='info' text={{ content: IFStatementTooltipMessages.codeBlockTooltip }}>
                                <Typography variant='body2' className={classes.middleCode}>...</Typography>
                            </Tooltip>
                        </div>
                        {compList.slice(1, compList.length).map((comp) => {
                            return <React.Fragment key={comp.id}>{ElseIfElement(comp.id)}</React.Fragment>
                        })}
                        <div className={classes.formCodeExpressionCenterWrapper}>
                            <Typography variant='body2' className={classes.endCode}>{`}`}</Typography>
                            <div className={classes.formCodePlusWrapper}>
                                {formArgs?.wizardType === 0 && (
                                    <IconButton
                                        color="primary"
                                        onClick={handlePlusButton(-1)}
                                        className={classes.button}
                                        data-testid="plus-button"
                                    >
                                        <ControlPoint />
                                    </IconButton>
                                )}
                            </div>
                            <Typography variant='body2' className={classes.startCode}>else</Typography>
                            <Typography variant='body2' className={classes.endCode}>{`{`}</Typography>
                        </div>
                        <div className={classes.formCodeBlockWrapper}>
                            <div className={classes.middleDottedwrapper}>
                                <Tooltip type='info' text={{ content: IFStatementTooltipMessages.codeBlockTooltip }}>
                                    <Typography variant='body2' className={classes.middleCode}>{`...`}</Typography>
                                </Tooltip>
                            </div>
                            <Typography variant='body2' className={classes.endCode}>{`}`}</Typography>
                        </div>
                    </div>
                    <FormActionButtons
                        cancelBtnText={cancelIfButtonLabel}
                        cancelBtn={true}
                        saveBtnText={saveIfConditionButtonLabel}
                        isMutationInProgress={isMutationInProgress}
                        validForm={validForm}
                        onSave={handleOnSaveClick}
                        onCancel={onCancel}
                    />
                </FormControl>
            )}
        </>
    )
}
