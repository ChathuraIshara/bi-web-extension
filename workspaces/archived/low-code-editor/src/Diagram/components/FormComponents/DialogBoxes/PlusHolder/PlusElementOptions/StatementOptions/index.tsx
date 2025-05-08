/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js, ordered-imports
import React, { ReactNode, useContext, useState } from "react";

import { Divider } from "@material-ui/core";
import cn from "classnames";
import { ADD_CONNECTOR, ADD_STATEMENT, LowcodeEvent } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { Tooltip } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";

import {
    LogIcon,
    PropertyIcon,
    AssignmentIcon,
    IfIcon,
    ForEachIcon,
    ReturnIcon,
    RespondIcon,
    CustomStatementIcon,
    ConnectorIcon,
    ActionIcon,
    AsyncSend,
    AsyncReceive,
    AsyncWait,
    Flush,
} from "../../../../../../../assets/icons";

import { Context } from "../../../../../../../Contexts/Diagram";
import "../../style.scss";
import While from "../../../../../../../assets/icons/While";
import { FormattedMessage, useIntl } from "react-intl";
import { HttpLogo, PlusViewState } from "@wso2-enterprise/ballerina-low-code-diagram";
import { isStatementEditorSupported } from "../../../../Utils";

export const PROCESS_TYPES = [""];

export interface StatementOptionsProps {
    onSelect: (type: string) => void;
    viewState: PlusViewState;
    isResource?: boolean;
    isCallerAvailable?: boolean;
    hasWorkerDecl?: boolean;
}

export interface StatementComponent {
    name: string;
    component: ReactNode;
    category: string;
}

export interface Statements {
    statement: StatementComponent[];
    selectedCompoent: string;
}

export function StatementOptions(props: StatementOptionsProps) {
    const { api: { insights: { onEvent } }, props: { ballerinaVersion } } = useContext(Context);

    const statementEditorSupported = isStatementEditorSupported(ballerinaVersion);
    const intl = useIntl();
    const { onSelect, viewState, isCallerAvailable, isResource, hasWorkerDecl } = props;

    const plusHolderStatementTooltipMessages = {
        worker: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.worker.tooltip.title",
                defaultMessage: "A worker allows to execute code in parallel with function's default worker and other named workers."
            })
        },
        send: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.send.tooltip.title",
                defaultMessage: "A send allows to send data from one worker to another."
            })
        },
        receive: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.receive.tooltip.title",
                defaultMessage: "A receive allows to receive data from other workers."
            })
        },
        wait: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.wait.tooltip.title",
                defaultMessage: "A wait allows worker to wait for another worker and get the return value of it."
            })
        },
        flush: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.flush.tooltip.title",
                defaultMessage: "A flush allows the worker to wait until all the send messages are consumed by the target workers."
            })
        },
        variableStatement: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.variable.tooltip.title",
                defaultMessage: "A variable statement holds the value of a specific data type (string, integer, etc.) so that it can be used later in the logical process of the service or integration."
            })
        },
        assignmentStatement: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.assignment.tooltip.title",
                defaultMessage: "An assignment statement lets you to assign a value to a variable that is already defined"
            })
        },
        ifStatement: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.if.tooltip.title",
                defaultMessage: "An if statement lets you specify two blocks of logical components so that the system can decide which block to execute based on whether the provided condition is true or false."
            })
        },
        foreachStatement: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.foreach.tooltip.title",
                defaultMessage: "A foreach statement is a control flow statement that can be used to iterate over a list of items.",
            })
        },
        whileStatement: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.while.tooltip.title",
                defaultMessage: "A while statement executes a block of statements in a loop as long as the specified condition is true."
            })
        },
        returnStatement: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.return.tooltip.title",
                defaultMessage: "A return statement stops executing the current path or returns a value back to the caller."
            })
        },
        respondStatement: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.respond.tooltip.title",
                defaultMessage: "A respond statement sends the response from a service back to the client."
            })
        },
        customStatement: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.customStatement.tooltip.title",
                defaultMessage: "A custom statement can be used to write a single or a multiline code snippet that is not supported by the low code diagram."
            })
        },
        httpConnectorStatement: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.http.tooltip.title",
                defaultMessage: "An HTTP connector can be used to integrate with external applications."
            })
        },
        dataMapperStatement: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.dataMapping.tooltip.title",
                defaultMessage: "A data mapping statement can be used to create an object using several other variables."
            })
        },
        connectorStatement: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.connector.tooltip.title",
                defaultMessage: "A connector can be used to integrate with external applications."
            })
        },
        actionStatement: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.action.tooltip.title",
                defaultMessage: "An action can be used to invoke operations of an existing connector."
            })
        },
        functionCallStatement: {
            title: intl.formatMessage({
                id: "lowcode.develop.plusHolder.plusElements.statements.functionCall.tooltip.title",
                defaultMessage: "A function call is a request that performs a predetermined function."
            })
        }
    }

    const onSelectStatement = (type: string) => {
        onSelect(type);
    }


    const onConnectorClick = (type: string) => {
        const event: LowcodeEvent = {
            type: ADD_CONNECTOR,
        };
        onEvent(event);
        onSelectStatement(type)
    }

    const workerBlock: StatementComponent = {
        name: "worker",
        category: 'concurrency',
        component:
            (
                <Tooltip
                    title={plusHolderStatementTooltipMessages.worker.title}
                    placement="right"
                    arrow={true}
                    interactive={true}
                    disabled={!viewState.allowWorker}
                >
                    <div
                        className={cn("sub-option", { enabled: viewState.allowWorker })}
                        data-testid="addWorker"
                        onClick={viewState.allowWorker ? onSelectStatement.bind(undefined, "Worker") : null}
                    >
                        <div className="icon-wrapper">
                            <LogIcon />
                        </div>
                        <div className="text-label"><FormattedMessage id="lowcode.develop.plusHolder.plusElements.statements.worker.title" defaultMessage="Worker" /></div>
                    </div>
                </Tooltip>
            )
    }
    const propertyStm: StatementComponent = {
        name: "variable",
        category: 'generics',
        component: (
            <Tooltip
                title={plusHolderStatementTooltipMessages.variableStatement.title}
                placement="right"
                arrow={true}
                interactive={true}
            >
                <div className="sub-option enabled" data-testid="addVariable" onClick={onSelectStatement.bind(undefined, "Variable")}>
                    <div className="icon-wrapper">
                        <PropertyIcon />
                    </div>
                    <div className="text-label"><FormattedMessage id="lowcode.develop.plusHolder.plusElements.statements.variable.title" defaultMessage="Variable" /></div>
                </div>
            </Tooltip>
        )
    }
    const assignmentStm: StatementComponent = {
        name: "assignment",
        category: 'generics',
        component: (
            <Tooltip
                title={plusHolderStatementTooltipMessages.assignmentStatement.title}
                placement="right"
                arrow={true}
                interactive={true}
            >
                <div
                    className="sub-option enabled"
                    data-testid="addAssignment"
                    onClick={onSelectStatement.bind(undefined, "AssignmentStatement")}
                >
                    <div className="icon-wrapper">
                        <AssignmentIcon />
                    </div>
                    <div className="text-label">
                        <FormattedMessage
                            id="lowcode.develop.plusHolder.plusElements.statements.assignment.title"
                            defaultMessage="Assignment"
                        />
                    </div>
                </div>
            </Tooltip>
        )
    }
    const sendStmt: StatementComponent = {
        name: "send",
        category: 'concurrency',
        component: (
            <Tooltip
                title={plusHolderStatementTooltipMessages.send.title}
                placement="right"
                arrow={true}
                interactive={true}
                disabled={!hasWorkerDecl}
            >
                <div
                    className={cn("sub-option", { enabled: hasWorkerDecl })}
                    data-testid="addSend"
                    onClick={hasWorkerDecl ? onSelectStatement.bind(undefined, "AsyncSend") : null}
                >
                    <div className="icon-wrapper">
                        <AsyncSend />
                    </div>
                    <div className="text-label">
                        <FormattedMessage
                            id="lowcode.develop.plusHolder.plusElements.statements.send.title"
                            defaultMessage="Send"
                        />
                    </div>
                </div>
            </Tooltip>
        )
    }
    const receiveStmt: StatementComponent = {
        name: "receive",
        category: 'concurrency',
        component: (
            <Tooltip
                title={plusHolderStatementTooltipMessages.receive.title}
                placement="right"
                arrow={true}
                interactive={true}
                disabled={!hasWorkerDecl}
            >
                <div
                    className={cn("sub-option", { enabled: hasWorkerDecl })}
                    data-testid="addReceive"
                    onClick={hasWorkerDecl ? onSelectStatement.bind(undefined, "ReceiveStatement") : null}
                >
                    <div className="icon-wrapper">
                        <AsyncReceive />
                    </div>
                    <div className="text-label">
                        <FormattedMessage
                            id="lowcode.develop.plusHolder.plusElements.statements.receive.title"
                            defaultMessage="Receive"
                        />
                    </div>
                </div>
            </Tooltip>
        )
    }
    const waitStmt: StatementComponent = {
        name: "wait",
        category: 'concurrency',
        component: (
            <Tooltip
                title={plusHolderStatementTooltipMessages.wait.title}
                placement="right"
                arrow={true}
                interactive={true}
                disabled={!hasWorkerDecl}
            >
                <div
                    className={cn("sub-option", { enabled: hasWorkerDecl })}
                    data-testid="addWait"
                    onClick={hasWorkerDecl ? onSelectStatement.bind(undefined, "WaitStatement") : null}
                >
                    <div className="icon-wrapper">
                        <AsyncWait />
                    </div>
                    <div className="text-label">
                        <FormattedMessage
                            id="lowcode.develop.plusHolder.plusElements.statements.wait.title"
                            defaultMessage="Wait"
                        />
                    </div>
                </div>
            </Tooltip>
        )
    }
    const flushStmt: StatementComponent = {
        name: "flush",
        category: 'concurrency',
        component: (
            <Tooltip
                title={plusHolderStatementTooltipMessages.flush.title}
                placement="right"
                arrow={true}
                interactive={true}
                disabled={!hasWorkerDecl}
            >
                <div
                    className={cn("sub-option", { enabled: hasWorkerDecl })}
                    data-testid="addFlush"
                    onClick={hasWorkerDecl ? onSelectStatement.bind(undefined, "FlushStatement") : null}
                >
                    <div className="icon-wrapper">
                        <Flush />
                    </div>
                    <div className="text-label">
                        <FormattedMessage
                            id="lowcode.develop.plusHolder.plusElements.statements.flush.title"
                            defaultMessage="Flush"
                        />
                    </div>
                </div>
            </Tooltip>
        )
    }
    const ifStm: StatementComponent = {
        name: "if",
        category: 'controlflows',
        component: (
            <Tooltip
                title={plusHolderStatementTooltipMessages.ifStatement.title}
                placement="right"
                arrow={true}
                interactive={true}
            >
                <div className="sub-option enabled" data-testid="addIf" onClick={onSelectStatement.bind(undefined, "If")}>
                    <div className="icon-wrapper">
                        <IfIcon />
                    </div>
                    <div className="text-label"><FormattedMessage id="lowcode.develop.plusHolder.plusElements.statements.if.title" defaultMessage="If" /></div>
                </div>
            </Tooltip>
        )
    }
    const foreachStm: StatementComponent = {
        name: "foreach",
        category: 'controlflows',
        component: (
            <Tooltip
                title={plusHolderStatementTooltipMessages.foreachStatement.title}
                placement="right"
                arrow={true}
                interactive={true}
            >
                <div className="sub-option enabled" data-testid="addForeach" onClick={onSelectStatement.bind(undefined, "ForEach")} >
                    <div className="icon-wrapper">
                        <ForEachIcon />
                    </div>
                    <div className="text-label"><FormattedMessage id="lowcode.develop.plusHolder.plusElements.statements.foreach.title" defaultMessage="Foreach" /></div>
                </ div>
            </Tooltip>
        )
    }
    const whileStmt: StatementComponent = {
        name: "while",
        category: 'controlflows',
        component: (
            <Tooltip
                title={plusHolderStatementTooltipMessages.whileStatement.title}
                placement="right"
                arrow={true}
                interactive={true}
            >
                <div className="sub-option enabled" data-testid="addWhile" onClick={onSelectStatement.bind(undefined, "While")} >
                    <div className="icon-wrapper">
                        <While />
                    </div>
                    <div className="text-label"><FormattedMessage id="lowcode.develop.plusHolder.plusElements.statements.while.title" defaultMessage="While" /></div>
                </ div>
            </Tooltip>
        )
    }
    const connectorStatement: StatementComponent = {
        name: "connector",
        category: "actors",
        component: (
            <Tooltip
                title={plusHolderStatementTooltipMessages.connectorStatement.title}
                placement="right"
                arrow={true}
                interactive={true}
            >
                <div
                    className="sub-option enabled"
                    data-testid="addConnector"
                    onClick={onConnectorClick.bind(undefined, "Connector")}
                >
                    <div className="icon-wrapper">
                        <ConnectorIcon />
                    </div>
                    <div className="text-label">
                        <FormattedMessage
                            id="lowcode.develop.plusHolder.plusElements.statements.connector.title"
                            defaultMessage="Connector"
                        />
                    </div>
                </div>
            </Tooltip>
        ),
    };
    const actionStatement: StatementComponent = {
        name: "action",
        category: "actors",
        component: (
            <Tooltip
                title={plusHolderStatementTooltipMessages.actionStatement.title}
                placement="right"
                arrow={true}
                interactive={true}
            >
                <div
                    className="sub-option enabled"
                    data-testid="addAction"
                    onClick={onSelectStatement.bind(undefined, "Action")}
                >
                    <div className="icon-wrapper">
                        <ActionIcon />
                    </div>
                    <div className="text-label">
                        <FormattedMessage
                            id="lowcode.develop.plusHolder.plusElements.statements.action.title"
                            defaultMessage="Action"
                        />
                    </div>
                </div>
            </Tooltip>
        ),
    };
    const httpConnector: StatementComponent = {
        name: "httpConnector",
        category: 'connector',
        component: (
            <Tooltip
                title={plusHolderStatementTooltipMessages.httpConnectorStatement.title}
                placement="right"
                arrow={true}
                interactive={true}
            >
                <div
                    className={cn("sub-option enabled", { height: 'unset' })}
                    data-testid="addHttp"
                    onClick={onSelectStatement.bind(undefined, "HTTP")}
                >
                    <div className="icon-wrapper icon-wrapper-http">
                        <HttpLogo />
                    </div>
                    <div className="text-label"><FormattedMessage id="lowcode.develop.plusHolder.plusElements.statements.httpConnectorStatement.title" defaultMessage="HTTP" /></div>
                </div>
            </Tooltip>
        )
    }

    const returnStm: StatementComponent = {
        name: "return",
        category: 'communications',
        component: (
            <Tooltip
                title={plusHolderStatementTooltipMessages.returnStatement.title}
                placement="right"
                arrow={true}
                disabled={!viewState.isLast}
                interactive={true}
            >
                <div
                    data-testid="addReturn"
                    className={cn("sub-option", { enabled: viewState.isLast })}
                    onClick={viewState.isLast ? onSelectStatement.bind(undefined, 'Return') : null}
                >
                    <div className="icon-wrapper">
                        <ReturnIcon />
                    </div>
                    <div className="text-label"><FormattedMessage id="lowcode.develop.plusHolder.plusElements.statements.return.title" defaultMessage="Return" /></div>
                </div>
            </Tooltip>
        )
    }
    const respondStm: StatementComponent = {
        name: "respond",
        category: 'communications',
        component: (
            <Tooltip
                title={plusHolderStatementTooltipMessages.respondStatement.title}
                placement="right"
                arrow={true}
                disabled={!isResource || !isCallerAvailable}
                interactive={true}
            >
                <div
                    className={cn("sub-option", "product-tour-stop-respond", { enabled: isResource && isCallerAvailable })}
                    data-testid="addrespond"
                    onClick={isResource && isCallerAvailable ? onSelectStatement.bind(undefined, 'Respond') : null}
                >
                    <div className="icon-wrapper">
                        <RespondIcon />
                    </div>
                    <div className="text-label"><FormattedMessage id="lowcode.develop.plusHolder.plusElements.statements.respond.title" defaultMessage="Respond" /></div>
                </div>
            </Tooltip>
        )
    }

    const customStatement: StatementComponent = {
        name: "customStatement",
        category: 'generics',
        component: (
            <Tooltip
                title={plusHolderStatementTooltipMessages.customStatement.title}
                placement="right"
                arrow={true}
                interactive={true}
            >
                <div
                    className={cn("sub-option enabled", { height: 'unset' })}
                    data-testid="addcustom"
                    onClick={onSelectStatement.bind(undefined, "Custom")}
                >
                    <div className="icon-wrapper">
                        <CustomStatementIcon />
                    </div>
                    <div className="text-label"><FormattedMessage id="lowcode.develop.plusHolder.plusElements.statements.customStatement.title" defaultMessage="Other" /></div>
                </div>
            </Tooltip>
        )
    }

    const functionCall: StatementComponent = {
        name: "functionCall",
        category: 'generics',
        component: (
            <Tooltip
                title={plusHolderStatementTooltipMessages.functionCallStatement.title}
                placement="right"
                arrow={true}
                interactive={true}
            >
                <div
                    className={cn("sub-option enabled", { height: 'unset' })}
                    data-testid="addFunctionCall"
                    onClick={onSelectStatement.bind(undefined, "Call")}
                >
                    <div className="icon-wrapper">
                        <CustomStatementIcon />
                    </div>
                    <div className="text-label"><FormattedMessage id="lowcode.develop.plusHolder.plusElements.statements.functionCall.tooltip.title" defaultMessage="Function Call" /></div>
                </div>
            </Tooltip>
        )
    }

    const statements: StatementComponent[] = [];
    statements.push(connectorStatement);
    statements.push(actionStatement);
    statements.push(propertyStm);
    statements.push(assignmentStm);
    statements.push(ifStm);
    statements.push(foreachStm);
    statements.push(whileStmt);
    statements.push(returnStm);
    statements.push(respondStm);
    if (statementEditorSupported) {
        statements.push(workerBlock);
        statements.push(sendStmt);
        statements.push(receiveStmt);
        statements.push(waitStmt);
        statements.push(flushStmt);
    }
    // statements.push(datamappingStatement);
    // statements.push(customStatement);
    statements.push(functionCall);
    statements.push(httpConnector);

    const initStatements: Statements = {
        statement: statements,
        selectedCompoent: ""
    };
    const [selectedCompName, setSelectedCompName] = useState("");

    const actorElements: ReactNode[] = [];
    const genericElements: ReactNode[] = [];
    const concurrencyElements: ReactNode[] = [];
    const controlFlowElements: ReactNode[] = [];
    const communicationElements: ReactNode[] = [];

    if (selectedCompName !== "") {
        const stmts: StatementComponent[] = initStatements.statement.filter(el => el.name.toLowerCase().includes(selectedCompName.toLowerCase()));
        stmts.forEach((stmt) => {
            switch (stmt.category) {
                case "actors":
                    actorElements.push(stmt.component);
                    break;
                case "generics":
                    genericElements.push(stmt.component);
                    break;
                case "controlflows":
                    controlFlowElements.push(stmt.component);
                    break;
                case "communications":
                    communicationElements.push(stmt.component);
                    break;
            }
        });
    } else {
        initStatements.statement.forEach((stmt) => {
            switch (stmt.category) {
                case "actors":
                    actorElements.push(stmt.component);
                    break;
                case "generics":
                    genericElements.push(stmt.component);
                    break;
                case "controlflows":
                    controlFlowElements.push(stmt.component);
                    break;
                case "communications":
                    communicationElements.push(stmt.component);
                    break;
                case "concurrency":
                    concurrencyElements.push(stmt.component);
                    break;
            }
        });
    }

    return (
        <>
            <div className="element-option-holder" >
                <div className="options-wrapper">
                    {actorElements}
                    {(controlFlowElements.length > 0 ? <Divider className="options-divider" /> : null)}
                    {controlFlowElements}
                    {(genericElements.length > 0 ? <Divider className="options-divider" /> : null)}
                    {genericElements}
                    {(concurrencyElements.length > 0 ? <Divider className="options-divider" /> : null)}
                    {concurrencyElements}
                    {(communicationElements.length > 0 ? <Divider className="options-divider" /> : null)}
                    {communicationElements}
                </div>
            </div>
        </>
    );
}
