/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useContext, useEffect, useState } from "react";

import { Grid } from "@material-ui/core";
import { ExpressionEditorCustomTemplate } from "@wso2-enterprise/ballerina-expression-editor";
import { FunctionDefinition, NodePosition, ObjectMethodDefinition, ResourceAccessorDefinition } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../../../../../Contexts/Diagram";
import { checkVariableName } from "../../../../../../Portals/utils";
import { SelectDropdownWithButton } from "../../../../../FormFieldComponents/DropDown/SelectDropdownWithButton";
import { FormTextInput } from "../../../../../FormFieldComponents/TextField/FormTextInput";
import {
    VariableTypeInput,
    VariableTypeInputProps
} from "../../../../Components/VariableTypeInput";
import { Payload } from "../../types";
import { convertPayloadStringToPayload, extractPayloadFromSTNode, extractPayloadPositionFromST, payloadTypes } from "../../util";

import { useStyles } from './style';

interface PayloadEditorProps {
    payload?: string,
    disabled?: boolean,
    onChange?: (segment: Payload) => void;
    onError: (isError?: boolean) => void;
    targetPosition: NodePosition;
    model?: ResourceAccessorDefinition | FunctionDefinition | ObjectMethodDefinition;
    setIsValid?: (isValid: boolean) => void;
}

export function PayloadEditor(props: PayloadEditorProps) {
    const { payload, disabled, onChange, onError, targetPosition, model, setIsValid } = props;
    const { props: { stSymbolInfo } } = useContext(Context);
    const segment: Payload = convertPayloadStringToPayload(payload ? payload : "");
    const [validType, setValidType] = useState(false);
    const funcSignature = (model as ResourceAccessorDefinition)?.functionSignature;

    const classes = useStyles();
    const initValue: Payload = segment.type !== "" && segment.type !== "" ? { ...segment } : {
        name: "payload",
        type: ""
    };

    const payloadTypeArray: string[] = payloadTypes;
    if (!payloadTypeArray.includes(initValue.type)) {
        payloadTypeArray.push(initValue.type);
    }

    const [payloadType, setPayloadType] = useState<string>(initValue.type);
    const [payloadName, setPayloadName] = useState<string>(initValue.name);

    const [payloadVarNameError, setPayloadVarNameError] = useState<string>("");
    const payloadNode = extractPayloadFromSTNode(funcSignature?.parameters);

    // TODO: Uncomment once payload suggestions are coming from LS
    // When creating new resource
    // let updateNodePosition: NodePosition = {
    //     ...targetPosition,
    //     endLine: 0,
    //     endColumn: 0,
    // };
    // let overrideTemplate: ExpressionEditorCustomTemplate = {
    //     defaultCodeSnippet: `resource function post tempResource(@http:Payload  ${segmentState?.name || 'tempPayload'}) {}`,
    //     targetColumn: 51
    // };

    // if (extractPayloadPositionFromST(funcSignature?.parameters)){
    //     // If @http:Payload already exists
    //     updateNodePosition = extractPayloadPositionFromST(funcSignature?.parameters);
    //     overrideTemplate = {
    //         defaultCodeSnippet: `@http:Payload  ${segmentState?.name || 'tempPayload'}`,
    //         targetColumn: 15
    //     }
    // }else if (funcSignature?.parameters.length > 0){
    //     // if some other payload already exists
    //     updateNodePosition = {
    //         ...funcSignature.openParenToken.position,
    //         startColumn: funcSignature.openParenToken.position.startColumn + 1,
    //     };
    //     overrideTemplate = {
    //         defaultCodeSnippet: `@http:Payload  ${segmentState?.name || 'tempPayload'},`,
    //         targetColumn: 15
    //     }
    // }else if (funcSignature?.parameters.length === 0){
    //     // If no payload exists
    //     updateNodePosition = {
    //         ...funcSignature.openParenToken.position,
    //         startColumn: funcSignature.openParenToken.position.startColumn + 1,
    //     };
    //     overrideTemplate = {
    //         defaultCodeSnippet: `@http:Payload  ${segmentState?.name || 'tempPayload'}`,
    //         targetColumn: 15
    //     }
    // }

    useEffect(() => {
        if (disabled) {
            onError(false);
            setPayloadVarNameError("");
        } else {
            const validPayload = validatePayloadNameValue(payloadName);
            onError(!validPayload);
        }
    }, [disabled]);

    useEffect(() => {
        if (onChange) {
            onChange({ name: payloadName, type: payloadType });
        }
    }, [payloadName, payloadType]);

    const onChangeSegmentType = (type: string) => {
        setPayloadType(type);
    };

    const onChangeSegmentName = (name: string) => {
        setPayloadName(name);
    };

    const validatePayloadNameValue = (value: string) => {
        const varValidationResponse = checkVariableName("payload name", value,
            payloadName, stSymbolInfo);
        setPayloadVarNameError(varValidationResponse.message);
        if (varValidationResponse?.error) {
            onError(true);
            return false;
        }
        onError(false);
        return true;
    };

    const validateExpression = (fieldName: string, isInvalid: boolean) => {
        setIsValid(!isInvalid);
    };

    // TODO: Uncomment once payload suggestions are coming from LS
    // const variableTypeConfig: VariableTypeInputProps = {
    //     displayName: '',
    //     value: segmentState?.type,
    //     onValueChange: onChangeSegmentType,
    //     validateExpression,
    //     position: updateNodePosition,
    //     overrideTemplate,
    //     hideLabel: true,
    //     disabled,
    //     initialDiagnostics: payloadNode?.typeData?.diagnostics,
    //     diagnosticsFilterExtraColumns: {
    //         end: 1 + segmentState?.name?.length,
    //     }
    // }
    const variableTypeConfig: VariableTypeInputProps = {
        displayName: 'Payload type',
        value: payloadType,
        onValueChange: onChangeSegmentType,
        validateExpression,
        hideLabel: true,
        disabled,
        position: targetPosition,
        initialDiagnostics: payloadNode?.typeData?.diagnostics,
        diagnosticsFilterExtraColumns: {
            end: 1 + payloadName.length,
        }
    }

    return (
        !disabled && (
            <div className={classes.segmentEditorWrap}>
                <div>
                    <Grid container={true} spacing={1}>
                        <Grid container={true} item={true} spacing={2}>
                            <Grid item={true} xs={5}>
                                <div className={classes.labelOfInputs}>
                                    Type
                                </div>
                            </Grid>
                            <Grid item={true} xs={7}>
                                <div className={classes.labelOfInputs}>
                                    Name
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container={true} item={true} spacing={2}>
                            <Grid item={true} xs={5}>
                                <VariableTypeInput {...variableTypeConfig} />
                            </Grid>
                            <Grid item={true} xs={7}>
                                <FormTextInput
                                    dataTestId="api-extract-segment"
                                    disabled={disabled}
                                    defaultValue={payloadName}
                                    customProps={{ validate: validatePayloadNameValue }}
                                    onChange={onChangeSegmentName}
                                    errorMessage={payloadVarNameError}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    );
}
