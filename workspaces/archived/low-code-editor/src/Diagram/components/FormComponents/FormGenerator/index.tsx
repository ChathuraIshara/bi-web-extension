/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useState } from "react";

import { Box } from "@material-ui/core";
import { ConfigOverlayFormStatus, STModification } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { NodePosition, STNode } from "@wso2-enterprise/syntax-tree";

import { useDiagramContext } from "../../../../Contexts/Diagram";
import { TextPreLoader } from "../../../../PreLoader/TextPreLoader";
import { Panel } from "../../Panel";
import { UnsupportedConfirmButtons } from "../DialogBoxes/UnsupportedConfirmButtons";
import { getForm } from "../Utils";

export interface FormGeneratorProps {
    model?: STNode;
    targetPosition?: NodePosition;
    showLoader?: boolean;
    onCancel?: () => void;
    onSave?: () => void;
    onBack?: () => void;
    filePath?: string;
    currentST?: STNode;
    configOverlayFormStatus: ConfigOverlayFormStatus; // FixMe : There are lot of unwanted properties passed through
    // this model clean up or remove this
}

// Copy of this interface is maintained in low-code-commons
export interface InjectableItem {
    id: string;
    modification: STModification;
    name?: string;
    value?: string;
}

// Copy of this interface is maintained in low-code-commons
export interface ExpressionInjectablesProps {
    list: InjectableItem[];
    setInjectables: (InjectableItem: InjectableItem[]) => void;
}

export function FormGenerator(props: FormGeneratorProps) {
    const {
        api: {
            code: { gotoSource },
        },
    } = useDiagramContext();
    const [ injectables, setInjectables ] = useState<InjectableItem[]>([]);
    const { onCancel, configOverlayFormStatus, targetPosition, showLoader, ...restProps } = props;
    const { isLoading, isLastMember, formType } = configOverlayFormStatus;
    const expressionInjectables: ExpressionInjectablesProps = {
        list: injectables,
        setInjectables,
    };
    if (configOverlayFormStatus.formArgs) {
        configOverlayFormStatus.formArgs.expressionInjectables = expressionInjectables;
    }
    const args = { onCancel, configOverlayFormStatus, formType, targetPosition, isLastMember, ...restProps }; // FixMe: Sort out form args

    const handleConfirm = () => {
        onCancel();
        gotoSource({ startLine: targetPosition.startLine, startColumn: targetPosition.startColumn });
    };

    return (
        <div>
            { formType === "ClassDefinition" || formType === "Custom" ? (
                <UnsupportedConfirmButtons onConfirm={handleConfirm} onCancel={onCancel} />
            ) : (
                <Panel onClose={onCancel}>
                    <>
                        { showLoader && isLoading && (
                            <Box display="flex" justifyContent="center" alignItems="center" height="80vh" width="600px">
                                <TextPreLoader position="absolute" text="Loading..." />
                            </Box>
                        ) }
                        {(!showLoader || !isLoading) && <div className="form-generator"  style={{height: "100%"}}>{getForm(formType, args)}</div>}
                    </>
                </Panel>
            ) }
        </div>
    );
}
