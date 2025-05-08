/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-wrap-multiline object-literal-shorthand align
import React, { useState } from "react";

import { Margin } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition } from "@wso2-enterprise/syntax-tree";

import { useDiagramContext } from "../../../../../../Contexts/Diagram";
import { DataMapperOverlay } from "../../../../DataMapperOverlay";
import { FormGenerator } from "../../../FormGenerator";
import { PlusOptionRenderer } from "../PlusOptionRenderer";

export interface PlusOptionsProps {
    kind: string
    margin?: Margin;
    onClose: () => void;
    goBack: () => void;
    targetPosition?: NodePosition;
    isTriggerType?: boolean;
    isLastMember?: boolean;
    showCategorized?: boolean;
}

export enum PlusMenuCategories {
    MODULE_INIT,
    CONSTRUCT,
    ENTRY_POINT
}

export interface PlusMenuEntry {
    name: string,
    type: string,
    category?: PlusMenuCategories,
    subMenu?: PlusMenuEntry[]
}

export const moduleLevelEntries: PlusMenuEntry[] = [
    { name: 'Main', type: 'FunctionDefinition', category: PlusMenuCategories.ENTRY_POINT },
    { name: 'Service', type: 'ServiceDeclaration', category: PlusMenuCategories.ENTRY_POINT },
    { name: 'Trigger', type: 'TriggerList', category: PlusMenuCategories.ENTRY_POINT },
    { name: 'Record', type: 'RecordEditor', category: PlusMenuCategories.CONSTRUCT },
    { name: 'Function', type: 'FunctionDefinition', category: PlusMenuCategories.CONSTRUCT },
    { name: 'Listener', type: 'ListenerDeclaration', category: PlusMenuCategories.CONSTRUCT },
    { name: 'Enum', type: 'EnumDeclaration', category: PlusMenuCategories.CONSTRUCT },
    { name: 'Class', type: 'ClassDefinition', category: PlusMenuCategories.CONSTRUCT },
    { name: 'Connector', type: 'ModuleConnectorDecl', category: PlusMenuCategories.MODULE_INIT },
    { name: 'Variable', type: 'ModuleVarDecl', category: PlusMenuCategories.MODULE_INIT },
    { name: 'Configurable', type: 'Configurable', category: PlusMenuCategories.MODULE_INIT },
    { name: 'Constant', type: 'ConstDeclaration', category: PlusMenuCategories.MODULE_INIT },
    { name: 'Other', type: 'Custom', category: PlusMenuCategories.MODULE_INIT },
    { name: 'Data Mapper', type: 'DataMapper', category: PlusMenuCategories.CONSTRUCT }
];

export const classMemberEntries: PlusMenuEntry[] = [
    // { name: 'Variable', type: 'ObjectField' },
    { name: 'Resource', type: 'ResourceAccessorDefinition', category: PlusMenuCategories.ENTRY_POINT },
    // { name: 'Function', type: 'ObjectMethodDefinition' }
]

export const triggerEntries: PlusMenuEntry[] = [
    { name: 'Variable', type: 'ObjectField', category: PlusMenuCategories.CONSTRUCT },
    { name: 'Function', type: 'ObjectMethodDefinition', category: PlusMenuCategories.CONSTRUCT }
]

export const PlusOptionsSelector = (props: PlusOptionsProps) => {
    const { onClose, goBack, targetPosition, kind, isTriggerType, isLastMember, showCategorized } = props;

    const { props: { ballerinaVersion } } = useDiagramContext();

    const defaultOption = ((kind === "ServiceDeclaration") && !isTriggerType) ?
        { name: "Resource", type: "ResourceAccessorDefinition" } : undefined;
    const [selectedOption, setSelectedOption] = useState<PlusMenuEntry>(defaultOption);

    let menuEntries: PlusMenuEntry[] = [];

    const handleOnClose = () => {
        setSelectedOption(undefined);
        onClose();
    }

    const handleOnSave = () => {
        onClose();
    }

    const onOptionSelect = (option: PlusMenuEntry) => {
        setSelectedOption(option);
    }

    switch (kind) {
        case 'ModulePart':
            menuEntries = moduleLevelEntries;
            break;
        case 'ServiceDeclaration':
            menuEntries = isTriggerType ? triggerEntries : classMemberEntries;
            break;
        default:
    }

    return (
        <>
            {
                !selectedOption && (
                    <PlusOptionRenderer
                        entries={menuEntries}
                        onClose={handleOnClose}
                        goBack={goBack}
                        onOptionSelect={onOptionSelect}
                        targetPosition={targetPosition}
                        showCategorized={showCategorized}
                    />
                )
            }
            {selectedOption && selectedOption.type !== "DataMapper" && (
                <FormGenerator
                    targetPosition={targetPosition}
                    configOverlayFormStatus={{
                        formType: selectedOption.type,
                        formName: selectedOption.name,
                        isLoading: false,
                        isLastMember: isLastMember
                    }}
                    onCancel={handleOnClose}
                    onSave={handleOnSave}
                />
            )}
            {selectedOption && selectedOption.type === "DataMapper" && (
                <DataMapperOverlay
                    targetPosition={targetPosition}
                    // configOverlayFormStatus={{
                    //     formType: selectedOption.type,
                    //     formName: selectedOption.name,
                    //     isLoading: false,
                    //     isLastMember: isLastMember
                    // }}
                    ballerinaVersion={ballerinaVersion}
                    onCancel={handleOnClose}
                    openedViaPlus={true}
                />
            )}
        </>
    );
};
