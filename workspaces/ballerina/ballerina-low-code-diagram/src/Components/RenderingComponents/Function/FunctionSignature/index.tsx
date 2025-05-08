/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from 'react';

import { FunctionIcon } from '@wso2-enterprise/ballerina-core';
import { FunctionDefinition, IdentifierToken, ObjectMethodDefinition, RequiredParam, ResourceAccessorDefinition, STKindChecker, STNode } from "@wso2-enterprise/syntax-tree";
import classNames from 'classnames';

import { truncateText } from '../../../../Utils';
import { FunctionViewState } from '../../../../ViewState';
import { ComponentExpandButton } from '../../../ComponentExpandButton';
import '../RegularFunction/style.scss';

interface FunctionSignatureProps {
    model: FunctionDefinition | ResourceAccessorDefinition | ObjectMethodDefinition;
    onExpandClick: () => void;
    isExpanded: boolean;
}

export function FunctionSignature(props: FunctionSignatureProps) {
    const { model, onExpandClick, isExpanded } = props;
    const viewState: FunctionViewState = model.viewState as FunctionViewState;

    const component: JSX.Element[] = [];

    const rectProps = {
        x: viewState.bBox.cx,
        y: viewState.bBox.cy,
        width: viewState.bBox.w,
        height: viewState.bBox.h,
    };

    if (STKindChecker.isResourceAccessorDefinition(model)) {
        const functionSignature = model.functionSignature;

        let pathConstruct = '';

        model.relativeResourcePath.forEach(resourceMember => {
            pathConstruct += resourceMember.source ? resourceMember.source : resourceMember.value;
        });

        const queryParamComponents: JSX.Element[] = [];
        const otherParamComponents: JSX.Element[] = [];

        functionSignature.parameters
            .filter(param => !STKindChecker.isCommaToken(param))
            .filter((param) => STKindChecker.isRequiredParam(param)
                && (STKindChecker.isStringTypeDesc(param.typeName) || STKindChecker.isIntTypeDesc(param.typeName)
                    || STKindChecker.isBooleanTypeDesc(param.typeName) || STKindChecker.isFloatTypeDesc(param.typeName)
                    || STKindChecker.isDecimalTypeDesc(param.typeName)))
            .forEach((param: RequiredParam, i) => {
                queryParamComponents.push((
                    <>
                        {i !== 0 ? '&' : ''}
                        {param.paramName.value}
                        <span ><sub><span className={'code'}>{truncateText((param.typeName as any)?.name?.value)}</span></sub></span>
                    </>
                ));
            });

        functionSignature.parameters
            .filter(param => !STKindChecker.isCommaToken(param))
            .filter((param) => STKindChecker.isRequiredParam(param)
                && !(STKindChecker.isStringTypeDesc(param.typeName) || STKindChecker.isIntTypeDesc(param.typeName)
                    || STKindChecker.isBooleanTypeDesc(param.typeName) || STKindChecker.isFloatTypeDesc(param.typeName)
                    || STKindChecker.isDecimalTypeDesc(param.typeName)))
            .forEach((param: RequiredParam, i) => {
                otherParamComponents.push(
                    <span className={'signature-param'} >{param.source}</span>
                )
            });

        component.push((
            <div
                className={
                    classNames(
                        'function-signature',
                        STKindChecker.isResourceAccessorDefinition(model) ? model.functionName.value : ''
                    )
                }
            >
                <div
                    className={
                        classNames(
                            'resource-badge',
                            STKindChecker.isResourceAccessorDefinition(model) ? model.functionName.value : ''
                        )
                    }
                >
                    <p className={'text'}>{model.functionName.value.toUpperCase()}</p>
                </div>
                <div className="param-wrapper">
                    <div className={'param-container'} >
                        <p className={'path-text'} >
                            {pathConstruct === '.' ? '/' : pathConstruct}{queryParamComponents.length > 0 ? '?' : ''}{queryParamComponents}
                        </p>
                    </div>
                    <div className={'param-container'} >
                        <p className={'path-text'} >{otherParamComponents}</p>
                    </div>
                </div>
                <ComponentExpandButton isExpanded={isExpanded} onClick={onExpandClick} />
            </div>
        ));
    } else {
        const functionSignature = model.functionSignature;
        const functionName: IdentifierToken = model.functionName as IdentifierToken;

        const params: JSX.Element[] = [];
        functionSignature.parameters
            .filter(param => !STKindChecker.isCommaToken(param))
            .forEach((param: RequiredParam, i) => {
                params.push(
                    <span className={'param'} >{param.source}</span>
                )
            })

        component.push((
            <div
                className={
                    classNames(
                        'function-signature',
                        STKindChecker.isResourceAccessorDefinition(model) ? model.functionName.value : ''
                    )
                }
            >
                <div className={'function-icon'}>
                    <FunctionIcon />
                </div>

                <div className="param-wrapper">
                    <div className={'param-container'} >
                        <p className={'path-text'}>{functionName.value}</p>
                    </div>
                    <div className={'param-container'} >
                        <p className={'path-text'}>{params}</p>
                    </div>
                </div>

                <ComponentExpandButton isExpanded={isExpanded} onClick={onExpandClick} />
            </div>
        ));
    }

    return (
        <>
            {component}
        </>
    )
}
