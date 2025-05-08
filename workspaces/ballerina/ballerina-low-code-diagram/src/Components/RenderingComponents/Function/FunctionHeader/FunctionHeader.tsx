/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import { SettingsIcon } from "@wso2-enterprise/ballerina-core";
import {
    RequiredParam,
    STKindChecker,
} from "@wso2-enterprise/syntax-tree";
import classNames from "classnames";

import { useDiagramContext } from "../../../../Context/diagram";
import { useFunctionContext } from "../../../../Context/Function";
import { isQueryParam } from "../util";

import "./style.scss";


export function FunctionHeader() {
    const { functionNode } = useFunctionContext();
    const diagramContext = useDiagramContext();
    const contextProps = diagramContext?.props;
    const diagramApi = diagramContext?.api;
    const editApi = diagramApi?.edit;
    const renderEditForm = editApi?.renderEditForm;

    const titleComponents: React.ReactElement[] = [];
    const argumentComponents: React.ReactElement[] = [];

    const handleConfigFormClick = async () => {
        const signature = await diagramContext.props.getListenerSignature(functionNode);
        if (signature && signature.includes('graphql')) {
            if (STKindChecker.isObjectMethodDefinition(functionNode)) {
                renderEditForm(functionNode, functionNode.position, {
                    formType: "GraphqlConfigForm",
                    formName: "GraphqlMutation", isLoading: false
                });
            } else if (STKindChecker.isResourceAccessorDefinition(functionNode)) {
                if (functionNode.functionName.value === 'subscribe') {
                    renderEditForm(functionNode, functionNode.position, {
                        formType: "GraphqlConfigForm",
                        formName: "GraphqlSubscription", isLoading: false
                    });
                } else {
                    renderEditForm(functionNode, functionNode.position, {
                        formType: "GraphqlConfigForm",
                        formName: "GraphqlResource", isLoading: false
                    });
                }
            }
        } else {
            renderEditForm(functionNode, functionNode.position, { formType: functionNode.kind, isLoading: false });
        }
    }

    if (STKindChecker.isFunctionDefinition(functionNode)) {
        // TODO: handle general funciton
        titleComponents.push(
            <div key={"title"} className="title-components">
                {`Function ${functionNode.functionName.value}`}
            </div>
        );

        functionNode.functionSignature.parameters
            .forEach((param, paramIndex) => {
                if (STKindChecker.isRequiredParam(param)
                    || STKindChecker.isDefaultableParam(param)
                    || STKindChecker.isRestParam(param)) {

                    argumentComponents.push(
                        <div key={paramIndex} className={'argument-item'}>
                            <span className="type-name">{param.typeName.source.trim()}</span>
                            <span className="argument-name">{param.paramName.value}</span>
                        </div>
                    );
                }
            });
    } else if (STKindChecker.isResourceAccessorDefinition(functionNode)) {
        // TODO: handle resource function
        const resourceTitleContent: React.ReactElement[] = [];
        resourceTitleContent.push(
            <span className={classNames("resource-badge", functionNode.functionName.value)}>
                {functionNode.functionName.value.toUpperCase()}
            </span>
        )

        functionNode.relativeResourcePath.forEach(node => {
            if (STKindChecker.isIdentifierToken(node) || STKindChecker.isSlashToken(node)) {
                resourceTitleContent.push(
                    <>{node.value}</>
                );
            } else if (STKindChecker.isResourcePathSegmentParam(node) || STKindChecker.isResourcePathRestParam(node)) {
                resourceTitleContent.push(
                    <>
                        [<span className={'type-descriptor'}>
                            {`${(node as any).typeDescriptor?.name?.value} `}
                        </span>
                        {STKindChecker.isResourcePathRestParam(node) ? '...' : ''}{(node as any).paramName?.value}]
                    </>
                );
            } else if (STKindChecker.isDotToken(node)) {
                resourceTitleContent.push(<>/</>);
            }
        });

        functionNode.functionSignature.parameters
            .forEach((param, paramIndex) => {
                if (STKindChecker.isRequiredParam(param)
                    || STKindChecker.isDefaultableParam(param)
                    || STKindChecker.isRestParam(param)) {
                    argumentComponents.push(
                        <div key={paramIndex} className={'argument-item'}>
                            <span className="type-name">{param.typeName.source.trim()}</span>
                            <span className="argument-name">{param.paramName.value}</span>
                        </div>
                    );
                }
            });

        titleComponents.push(
            <div key={"params"} className="title-components">
                <div className="content">
                    {resourceTitleContent}
                </div>
            </div>
        )
    } else if (STKindChecker.isObjectMethodDefinition(functionNode)) {
        titleComponents.push(
            <div key={"title"} className="title-components">{`${functionNode.functionName.value}`}</div>
        );

        functionNode.functionSignature.parameters
            .forEach((param, paramIndex) => {
                if (STKindChecker.isRequiredParam(param)
                    || STKindChecker.isDefaultableParam(param)
                    || STKindChecker.isRestParam(param)) {

                    argumentComponents.push(
                        <div key={paramIndex} className={'argument-item'}>
                            <span className="type-name">{param.typeName.source.trim()}</span>
                            <span className="argument-name">{param.paramName.value}</span>
                        </div>
                    );
                }
            });
    }

    if (!contextProps.isReadOnly) {
        titleComponents.push(
            <div key={"config"} className="config-form-btn" onClick={handleConfigFormClick}>
                <SettingsIcon onClick={handleConfigFormClick} />
            </div>
        );
    }

    return (
        <>
            <div className="title-container">
                {titleComponents}
            </div>
            <div className="argument-container">{argumentComponents}</div>
        </>
    )
}

