/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext } from "react";

import { ModulePart, STNode } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../Context/diagram";
import { getSTComponent } from "../../../Utils";
import { TopLevelPlus } from "../../PlusButtons/TopLevelPlus";

import './style.scss';

export const GAP_BETWEEN_MEMBERS = 31;
export const INIT_PLUS_MARGIN_LEFT = 24.5;
export const INIT_PLUS_MARGIN_TOP = 7.5;
export const INIT_PLUS_MARGIN_BOTTOM = 7.5;

export interface ModulePartProps {
    model: ModulePart
}

export function ModulePartComponent(props: ModulePartProps) {
    const { model } = props;
    const { props: { isReadOnly } } = useContext(Context);

    const moduleMembers: JSX.Element[] = [];

    model.members.forEach((member: STNode) => {
        const startPosition = member.position?.startLine + ":" + member.position?.startColumn;
        moduleMembers.push(
            <>
                <div className={'member-container'} >
                    {!isReadOnly && <TopLevelPlus kind={model.kind} targetPosition={member.position} showCategorized={true} />}
                    {getSTComponent(member)}
                </div>
            </>
        )
    });

    return (
        <>
            <div id={'canvas-overlay'} className={"overlayContainer"} />
            {moduleMembers}
            {!isReadOnly && (
                <div className={'member-container'} >
                    <TopLevelPlus
                        kind={model.kind}
                        targetPosition={model.eofToken.position}
                        isDocumentEmpty={model.members.length === 0}
                        isModuleLevel={true}
                        isLastMember={true}
                        showCategorized={true}
                    />
                </div>
            )
            }
        </>
    );
}
