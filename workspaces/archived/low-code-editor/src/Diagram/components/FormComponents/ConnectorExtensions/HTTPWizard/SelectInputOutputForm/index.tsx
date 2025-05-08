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
import { FormattedMessage, useIntl } from "react-intl";

import { Box, FormControl, FormHelperText, IconButton, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { withQuotes } from "@wso2-enterprise/ballerina-expression-editor";
import {
    ActionConfig,
    ConnectorConfig,
    FormField,
    FunctionDefinitionInfo,
    genVariableName,
    getAllVariables,
    STSymbolInfo
} from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { PrimaryButton } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { LocalVarDecl, NodePosition, STNode } from "@wso2-enterprise/syntax-tree";
import classNames from "classnames";

import { Context } from "../../../../../../Contexts/Diagram";
import { checkVariableName } from "../../../../Portals/utils";
import { VariableTypeInput } from "../../../ConfigForms/Components/VariableTypeInput";
import { wizardStyles } from "../../../ConnectorConfigWizard/style";
import { Form } from "../../../DynamicConnectorForm";
import { useStyles } from "../../../DynamicConnectorForm/style";
import { SelectDropdownWithButton } from "../../../FormFieldComponents/DropDown/SelectDropdownWithButton";
import { FormTextInput } from "../../../FormFieldComponents/TextField/FormTextInput";
import { httpHeaderKeys, httpHeaderValues } from "../HTTPHeaders";
import { OperationDropdown } from "../OperationDropdown";
import '../style.scss'

interface SelectInputOutputFormProps {
    functionDefinitions: Map<string, FunctionDefinitionInfo>;
    connectorConfig: ConnectorConfig;
    onConnectionChange?: () => void;
    onSave?: () => void;
    isNewConnectorInitWizard: boolean;
    targetPosition?: NodePosition;
    model?: STNode,
}

interface ReturnNameState {
    value: string;
    isNameProvided: boolean;
    isValidName: boolean;
}

interface PayloadState {
    isPayloadSelected: boolean;
    selectedPayload: string;
    validPayloadName: boolean;
    isNameProvided: boolean;
    variableName: string;
}

export function SelectInputOutputForm(props: SelectInputOutputFormProps) {
    const { onSave, functionDefinitions, connectorConfig, isNewConnectorInitWizard, targetPosition, model } = props;
    const actions = functionDefinitions;
    const {
        props: { isMutationProgress, stSymbolInfo },
        api: {
            helpPanel: {
                openConnectorHelp
            }
        }
    } = useContext(Context);
    const symbolInfo: STSymbolInfo = stSymbolInfo;
    const nameRegex = new RegExp("^[a-zA-Z][a-zA-Z0-9_]*$");
    const classes = useStyles();
    const wizardClasses = wizardStyles();
    const intl = useIntl();
    const defaultTargetType = "json"; // TODO: Change default value to "http:Response" after fixing expression editor temp module import

    const defaultActionName = connectorConfig && connectorConfig.action && connectorConfig.action.name ? connectorConfig.action.name : "";
    const [state, setDefaultActionName] = useState(defaultActionName);
    const [responseVarError, setResponseVarError] = useState("");
    const isFieldsAvailable = connectorConfig.action && connectorConfig.action.name && connectorConfig.action.fields.length > 0;
    const payloadType = connectorConfig.responsePayloadMap && connectorConfig.responsePayloadMap.selectedPayloadType ? connectorConfig.responsePayloadMap.selectedPayloadType : "";
    const isPayloadSelected = connectorConfig.responsePayloadMap?.isPayloadSelected;
    const payloadSelected = !(connectorConfig.responsePayloadMap &&
        (connectorConfig.responsePayloadMap.selectedPayloadType === "" ||
            connectorConfig.responsePayloadMap.selectedPayloadType === undefined));
    const [isGenFieldsFilled, setIsGenFieldsFilled] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState<string>(connectorConfig?.action?.name);
    const [returnType, setReturnType] = useState<string>("");
    const [validReturnType, setValidReturnType] = useState(false);
    const httpVar = model as LocalVarDecl;
    const initialReturnNameState: ReturnNameState = {
        value: connectorConfig.action.returnVariableName,
        isNameProvided: false,
        isValidName: true
    };

    if (actions) {
        // TODO: Remove this FormField once Map metadata generation fixed in LS
        const headerValueField: FormField = {
            typeName: "string",
            optional: false,
            defaultValue: false,
            customAutoComplete: withQuotes(httpHeaderValues),
        };
        actions.forEach((selectedAction) => {
            selectedAction.parameters.forEach((formField) => {
                if (formField.name === "headers") {
                    formField.typeName = "map";
                    formField.customAutoComplete = withQuotes(httpHeaderKeys);
                    formField.fields = [headerValueField];
                }
            });
        });
    }

    if (selectedOperation) {
        connectorConfig.action.fields = actions.get(selectedOperation).parameters;
    }

    if (selectedOperation !== connectorConfig?.action?.name) {
        connectorConfig.action.returnVariableName = undefined;
    }

    const initialPayloadState: PayloadState = {
        isPayloadSelected: payloadSelected,
        selectedPayload: payloadType,
        isNameProvided: !!connectorConfig?.responsePayloadMap?.payloadVariableName,
        validPayloadName: true,
        variableName: connectorConfig.responsePayloadMap ? connectorConfig.responsePayloadMap.payloadVariableName : "",
    };

    const [returnNameState, setReturnNameState] = useState<ReturnNameState>(initialReturnNameState);
    const [payloadState, setPayloadState] = useState<PayloadState>(initialPayloadState);
    const [defaultResponseVarName, setDefaultResponseVarName] = useState<string>(returnNameState.value);
    const frmFields: FormField[] = connectorConfig?.action?.fields;
    const [formFields, setFormFields] = useState(frmFields);
    const [onOperationChange, setOnOperationChange] = useState(false);
    let action: ActionConfig = new ActionConfig();
    if (connectorConfig.action) {
        action = connectorConfig.action;
    }

    let responseVariableHasReferences: boolean = false;
    if (!isNewConnectorInitWizard) {
        const symbolRefArray = symbolInfo.variableNameReferences.get(returnNameState.value);
        responseVariableHasReferences = symbolRefArray ? symbolRefArray.length > 0 : false;
        const actionReturnType = httpVar.typedBindingPattern.typeDescriptor.source.trim();
        if (returnType === "" && actionReturnType) {
            setReturnType(actionReturnType);
        }
    } else if (isNewConnectorInitWizard && returnType === "") {
        setReturnType(defaultTargetType);
    }

    const onValidate = (isRequiredFieldsFilled: boolean) => {
        setIsGenFieldsFilled(isRequiredFieldsFilled);
    };

    const onPayloadTypeSelect = (value: string) => {
        if (connectorConfig.responsePayloadMap) {
            connectorConfig.responsePayloadMap.isPayloadSelected = true;
            connectorConfig.responsePayloadMap.selectedPayloadType = value;
            connectorConfig.responsePayloadMap.payloadVariableName =
                isNewConnectorInitWizard || !connectorConfig.responsePayloadMap.payloadVariableName ?
                    genVariableName(value.toLowerCase() + "Payload", getAllVariables(symbolInfo))
                    :
                    connectorConfig.responsePayloadMap.payloadVariableName;
        }
        setPayloadState({
            ...payloadState,
            selectedPayload: value,
            isNameProvided: true,
            variableName: isNewConnectorInitWizard || (!isNewConnectorInitWizard &&
                !connectorConfig.responsePayloadMap.payloadVariableName) ?
                genVariableName(value.toLowerCase() + "Payload", getAllVariables(symbolInfo))
                :
                connectorConfig.responsePayloadMap.payloadVariableName
        });
    };

    const handleOnSave = () => {
        action.returnVariableName = returnNameState.value;
        action.fields.find(subField => subField.name === "targetType").selectedDataType = returnType;
        onSave();
    };

    const validateResponseNameValue = (value: string) => {
        if (value) {
            const varValidationResponse = checkVariableName("response name", value,
                defaultResponseVarName, stSymbolInfo);
            setResponseVarError(varValidationResponse.message);
            if (varValidationResponse?.error) {
                return false;
            }
        }
        return true;
    };

    const onNameChange = (text: string) => {
        setReturnNameState({
            ...returnNameState,
            value: text,
            isNameProvided: text && text !== '',
            isValidName: nameRegex.test(text)
        });
        connectorConfig.action.returnVariableName = text;
    };

    const onReturnTypeChange = (text: string) => {
        connectorConfig.action.returnType = text;
        setReturnType(text);
    };

    const onValidateReturnType = (fieldName: string, isInvalid: boolean) => {
        setValidReturnType(!isInvalid);
    };

    const operations: string[] = [];
    if (actions) {
        actions.forEach((value, key) => {
            if (key !== "init") {
                operations.push(key);
            }
        });
    }

    const selectedOperationParams = state && isFieldsAvailable && action.name && (
        <Form fields={formFields} onValidate={onValidate} editPosition={targetPosition} />
    );

    const payloadTypePlaceholder = intl.formatMessage({
        id: "lowcode.develop.configForms.HTTP.seletPayloadType",
        defaultMessage: "Select Type",
    });

    const addReturnTypeLabel = intl.formatMessage({
        id: "lowcode.develop.configForms.HTTP.returnType",
        defaultMessage: "Response Type",
    });

    let payloadComponent: React.ReactNode = null;
    if (connectorConfig.responsePayloadMap) {
        const payloadTypes: string[] = [];
        connectorConfig.responsePayloadMap.payloadTypes.forEach((value, key) => {
            payloadTypes.push(key);
        });

        payloadComponent = payloadState.isPayloadSelected && (
            <>
                <div className={classes.labelWrapper}>
                    <FormHelperText className={classes.inputLabelForRequired}><FormattedMessage id="lowcode.develop.connectorForms.HTTP.seletPayloadType" defaultMessage="Select payload type :" /></FormHelperText>
                    <FormHelperText className={classes.starLabelForRequired}>*</FormHelperText>
                </div>
                <div className="product-tour-payload-click">
                    <SelectDropdownWithButton
                        defaultValue={connectorConfig.responsePayloadMap.selectedPayloadType}
                        onChange={onPayloadTypeSelect}
                        placeholder={payloadTypePlaceholder}
                        customProps={{
                            values: payloadTypes,
                            disableCreateNew: true,
                        }}
                    />
                </div>
            </>
        );
    }

    const isSaveDisabled = isMutationProgress || !isGenFieldsFilled || !validReturnType;

    React.useEffect(() => {
        if (!isNewConnectorInitWizard) {
            setReturnNameState({
                isNameProvided: true,
                value: connectorConfig.action.returnVariableName,
                isValidName: true
            });
            setDefaultResponseVarName(connectorConfig.action.returnVariableName);
        }
    }, [isNewConnectorInitWizard]);

    React.useEffect(() => {
        if (!isNewConnectorInitWizard) {
            setPayloadState({
                isPayloadSelected: (connectorConfig.responsePayloadMap.selectedPayloadType !==
                    undefined || (connectorConfig.responsePayloadMap.selectedPayloadType !== "")),
                selectedPayload: connectorConfig.responsePayloadMap.selectedPayloadType,
                isNameProvided: true,
                validPayloadName: true,
                variableName: connectorConfig.responsePayloadMap.payloadVariableName
            });
        }
    }, [isPayloadSelected]);

    const handleOnOperationSelect = (operation: string) => {
        connectorConfig.action.name = operation;
        setSelectedOperation(operation);
        if (symbolInfo.localEndpoints.get(connectorConfig.name)) {
            const typeSymbol = symbolInfo.localEndpoints.get(connectorConfig.name)?.typeData?.typeSymbol;
            const { moduleName, orgName: organization, version } = typeSymbol?.moduleID;
            const name = typeSymbol?.name;
            openConnectorHelp({ moduleName, package: { name, version, organization }, name }, operation);
        }
        if (isNewConnectorInitWizard) {
            setReturnNameState({
                value: genVariableName(operation + "Response", getAllVariables(symbolInfo)),
                isValidName: true,
                isNameProvided: true,
            });
        }
        if (operation) {
            const derivedFormFields = actions.get(operation).parameters;
            connectorConfig.action.name = operation;
            connectorConfig.action.fields = derivedFormFields;
            setDefaultActionName(connectorConfig.action.name);
            setFormFields(derivedFormFields);
            setOnOperationChange(false);
        }
        setPayloadState({
            isPayloadSelected: true,
            selectedPayload: "",
            isNameProvided: false,
            validPayloadName: true,
            variableName: undefined,
        });
        connectorConfig.responsePayloadMap.selectedPayloadType = "";
        connectorConfig.responsePayloadMap.isPayloadSelected = true;
    };

    const handleOperationChange = () => {
        setOnOperationChange(true);
    };

    return (
        <div>
            {(!selectedOperation || onOperationChange) && (
                <OperationDropdown
                    operations={["get", "post", "put", "delete", "patch", "forward"]}
                    onOperationSelect={handleOnOperationSelect}
                    selectedValue={selectedOperation}
                />
            )}
            {selectedOperation && !onOperationChange && (
                <FormControl className={wizardClasses.mainWrapper}>
                    <div className={wizardClasses.configWizardAPIContainer}>
                        <div className={classes.fullWidth}>
                            <>
                                <p className={wizardClasses.subTitle}>Operation</p>
                                <Box border={1} borderRadius={5} className={wizardClasses.box}>
                                    <Typography variant="subtitle2">{connectorConfig.action.name}</Typography>
                                    <IconButton
                                        color="primary"
                                        classes={{
                                            root: wizardClasses.changeConnectionBtn,
                                        }}
                                        onClick={handleOperationChange}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Box>
                            </>
                            <FormHelperText className={classes.subtitle}>Operation Inputs</FormHelperText>
                            <div className={classNames(classes.groupedForm, classes.marginTB)}>
                                {selectedOperationParams}
                            </div>
                            <div className={classes.marginTB}>
                                <FormTextInput
                                    dataTestId={"response-variable-name"}
                                    customProps={{
                                        validate: validateResponseNameValue,
                                        disabled: responseVariableHasReferences,
                                    }}
                                    defaultValue={returnNameState.value}
                                    placeholder={"Enter Response Variable Name"}
                                    onChange={onNameChange}
                                    label={"Response Variable Name"}
                                    errorMessage={responseVarError}
                                />
                            </div>
                            <div className={classes.marginTB}>
                                <Box className="exp-wrapper">
                                    <VariableTypeInput
                                        displayName={addReturnTypeLabel}
                                        value={returnType}
                                        hideTextLabel={false}
                                        onValueChange={onReturnTypeChange}
                                        position={targetPosition}
                                        validateExpression={onValidateReturnType}
                                    />
                                </Box>
                            </div>
                        </div>
                    </div>
                    <div className={classes.saveConnectorBtnHolder}>
                        <PrimaryButton
                            dataTestId={"http-save-done"}
                            text="Save &amp; Done"
                            fullWidth={false}
                            disabled={isSaveDisabled}
                            onClick={handleOnSave}
                        />
                    </div>
                </FormControl>
            )}
        </div>
    );
}
