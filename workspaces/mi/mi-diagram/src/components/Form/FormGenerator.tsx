/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useEffect, useRef, useState } from 'react';
import {
    AutoComplete,
    CheckBox,
    Codicon,
    ComponentCard,
    FormGroup,
    Icon,
    LinkButton,
    RequiredFormInput,
    TextArea,
    TextField,
    Tooltip,
    Typography
} from '@wso2-enterprise/ui-toolkit';
import styled from '@emotion/styled';
import { Controller } from 'react-hook-form';
import React from 'react';
import {
    ExpressionFieldValue,
    Keylookup,
    FormExpressionField,
    ExpressionField,
    CodeTextArea,
    FormTokenEditor
} from '.';
import ExpressionEditor from '../sidePanel/expressionEditor/ExpressionEditor';
import { handleOpenExprEditor, sidepanelGoBack } from '../sidePanel';
import SidePanelContext from '../sidePanel/SidePanelContexProvider';
import { openPopup, deriveDefaultValue } from './common';
import { useVisualizerContext } from '@wso2-enterprise/mi-rpc-client';
import { Range } from "@wso2-enterprise/mi-syntax-tree/lib/src";
import ParameterManager from './GigaParamManager/ParameterManager';
import { StringWithParamManagerComponent } from './StringWithParamManager';
import { isLegacyExpression, isValueExpression } from './utils';
import { Colors } from '../../resources/constants';
import ReactMarkdown from 'react-markdown';

const Field = styled.div`
    margin-bottom: 12px;
`;

const WarningBanner = styled.div`
    background-color: ${Colors.WARNING};
    color: #fff;
    padding: 0 10px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 4px;
`;

export const cardStyle = {
    display: "block",
    margin: "15px 0",
    padding: "0 15px 15px 15px",
    width: "auto",
    cursor: "auto"
};

export interface FormGeneratorProps {
    documentUri?: string;
    formData: any;
    connectorName?: string;
    sequences?: string[];
    onEdit?: boolean;
    control: any;
    errors: any;
    setValue: any;
    reset: any;
    watch: any;
    getValues: any;
    skipGeneralHeading?: boolean;
    ignoreFields?: string[];
    addNewConnection?: any;
    autoGenerateSequences?: boolean;
    range?: Range;
}

export interface Element {
    inputType: any;
    name: string | number;
    displayName: any;
    description?: string;
    required: string;
    helpTip: any;
    placeholder: any;
    comboValues?: any[];
    defaultValue?: any;
    currentValue?: any;
    allowedConnectionTypes?: string[];
    keyType?: any;
    canAddNew?: boolean;
    elements?: any[];
    tableKey?: string;
    tableValue?: string;
    configurableType?: string;
    addParamText?: string;
    deriveResponseVariable?: boolean;
    separatorPattern?: string;
    initialSeparator?: string;
    secondarySeparator?: string;
    keyValueSeparator?: string;
    viewIdentifier?: string;
    viewDisplayName?: string;
    expressionType?: 'xpath/jsonPath' | 'synapse';
    supportsAIValues?: boolean;
}

interface ExpressionValueWithSetter {
    value: ExpressionFieldValue;
    setValue: (value: ExpressionFieldValue) => void;
};


export function getNameForController(name: string | number) {
    if (name === 'configRef') {
        return 'configKey';
    }
    return String(name).replace(/\./g, '__dot__');
}

export function FormGenerator(props: FormGeneratorProps) {
    const { rpcClient } = useVisualizerContext();
    const sidePanelContext = React.useContext(SidePanelContext);
    const {
        documentUri,
        formData,
        connectorName,
        control,
        errors,
        setValue,
        reset,
        getValues,
        watch,
        skipGeneralHeading,
        ignoreFields,
        addNewConnection,
        range
    } = props;
    const [currentExpressionValue, setCurrentExpressionValue] = useState<ExpressionValueWithSetter | null>(null);
    const [expressionEditorField, setExpressionEditorField] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLegacyExpressionEnabled, setIsLegacyExpressionEnabled] = useState<boolean>(false);
    const handleOnCancelExprEditorRef = useRef(() => { });
    const [connectionNames, setConnections] = useState<{ [key: string]: string[] }>({});

    useEffect(() => {
        rpcClient
            .getMiVisualizerRpcClient()
            .isLegacyExpressionSupportEnabled()
            .then(isEnabled => {
                setIsLegacyExpressionEnabled(isEnabled);
            })
            .catch(() => {
                // Fallback to false if the project details cannot be fetched
                setIsLegacyExpressionEnabled(false);
            });
    }, []);

    useEffect(() => {
        setIsLoading(true);
        handleOnCancelExprEditorRef.current = () => {
            sidepanelGoBack(sidePanelContext);
        };

        if (formData.elements) {
            const defaultValues = getDefaultValues(formData.elements);
            reset(defaultValues);
        }
        setIsLoading(false);
    }, [sidePanelContext.pageStack, formData]);

    function getDefaultValues(elements: any[]) {
        const defaultValues: Record<string, any> = {};
        elements.forEach(async (element: any) => {
            const name = getNameForController(element.value.name);
            if (element.type === 'attributeGroup') {
                Object.assign(defaultValues, getDefaultValues(element.value.elements));
            } else {
                defaultValues[name] = getDefaultValue(element);

                if (element.value.inputType === 'connection' && documentUri && connectorName) {
                    const allowedTypes: string[] = element.value.allowedConnectionTypes;

                    const connectorData = await rpcClient.getMiDiagramRpcClient().getConnectorConnections({
                        documentUri: documentUri,
                        connectorName: formData?.connectorName ?? connectorName.replace(/\s/g, '')
                    });

                    const filteredConnections = connectorData.connections.filter(
                        connection => allowedTypes?.some(
                            // Ignore case in checking allowed connection types
                            type => type.toLowerCase() === connection.connectionType.toLowerCase()
                        ));
                    const connectionNames = filteredConnections.map(connection => connection.name);

                    setConnections((prevConnections) => ({
                        ...prevConnections,
                        [name]: connectionNames
                    }));
                }
            }
        });
        return defaultValues;
    }

    function getDefaultValue(element: any) {
        const name = getNameForController(element.value.name);
        const type = element.type;
        const value = element.value;
        const inputType = value.inputType;
        const deriveResponseVariable = value.deriveResponseVariable ?? false;
        const defaultValue = deriveResponseVariable ? deriveDefaultValue(formData.connectorName, formData.operationName) : value.defaultValue;
        const currentValue = value.currentValue ?? getValues(name) ?? defaultValue;
        deriveDefaultValue(formData.connectorName, formData.operationName);
        const expressionTypes = ['stringOrExpression', 'integerOrExpression', 'expression', 'keyOrExpression', 'resourceOrExpression',
            'textOrExpression', 'textAreaOrExpression', 'stringOrExpresion'
        ];

        if (type === 'table') {
            const valueObj: any[] = [];
            currentValue?.forEach((param: any[]) => {
                const val: any = {};

                if (!Array.isArray(param)) {
                    param = Object.values(param);
                }

                value.elements.forEach((field: any, index: number) => {
                    const fieldName = getNameForController(field.value.name);
                    const fieldValue = param[index];

                    val[fieldName] = fieldValue;
                });
                valueObj.push(val);
            });

            return valueObj;
        } else if (expressionTypes.includes(inputType) &&
            (!currentValue || typeof currentValue !== 'object' || !('isExpression' in currentValue))) {
            const isExpression = inputType === "expression" || isValueExpression(currentValue);
            return { isExpression: isExpression, value: currentValue ?? "" };
        } else if (inputType === 'checkbox') {
            return currentValue ?? false;
        } else {
            return currentValue ?? "";
        }
    }

    function ParamManagerComponent(element: Element, isRequired: boolean, helpTipElement: React.JSX.Element, field: any) {
        return <ComponentCard sx={cardStyle} disbaleHoverEffect>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h3">{element.displayName}</Typography>
                {isRequired && (<RequiredFormInput />)}
                <div style={{ paddingTop: '5px' }}>
                    {helpTipElement}
                </div>
            </div>
            <Typography variant="body3">{element.description}</Typography>

            <ParameterManager
                formData={element}
                parameters={field.value}
                setParameters={field.onChange}
                nodeRange={range}
            />
        </ComponentCard>;
    }

    const ExpressionFieldComponent = ({ element, canChange, field, helpTipElement, placeholder, isRequired }: { element: Element, canChange: boolean, field: any, helpTipElement: React.JSX.Element, placeholder: string, isRequired: boolean }) => {
        const name = getNameForController(element.name);

        return expressionEditorField !== name ? (
            <ExpressionField
                {...field}
                label={element.displayName}
                labelAdornment={helpTipElement}
                placeholder={placeholder}
                canChange={canChange}
                required={isRequired}
                isTextArea={element.inputType === 'textAreaOrExpression'}
                errorMsg={errors[name] && errors[name].message.toString()}
                openExpressionEditor={(value: ExpressionFieldValue, setValue: any) => {
                    setCurrentExpressionValue({ value, setValue });
                    setExpressionEditorField(name);
                }}
            />
        ) : (
            <>
                <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
                    <label>{element.displayName}</label>
                    {element.required === "true" && <RequiredFormInput />}
                    <div style={{ paddingTop: '5px' }}>
                        {helpTipElement}
                    </div>
                </div>
                <ExpressionEditor
                    value={currentExpressionValue.value || { isExpression: false, value: '', namespaces: [] }}
                    handleOnSave={(newValue) => {
                        if (currentExpressionValue) {
                            currentExpressionValue.setValue(newValue);
                        }
                        setExpressionEditorField(null);
                    }}
                    handleOnCancel={() => {
                        setExpressionEditorField(null);
                    }}
                />
            </>
        )
    }

    const FormExpressionFieldComponent = (element: Element, field: any, helpTipElement: React.JSX.Element, isRequired: boolean, errorMsg: string) => {
        const name = getNameForController(element.name);

        return expressionEditorField !== name ? (
            <FormExpressionField
                {...field}
                labelAdornment={helpTipElement}
                label={element.displayName}
                required={isRequired}
                placeholder={element.placeholder}
                nodeRange={range}
                canChange={element.inputType !== 'expression'}
                supportsAIValues={element.supportsAIValues}
                errorMsg={errorMsg}
                openExpressionEditor={(value, setValue) => {
                    setCurrentExpressionValue({ value, setValue });
                    setExpressionEditorField(name);
                }}
            />
        ) : (
            <>
                <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
                    <label>{element.displayName}</label>
                    {element.required === "true" && <RequiredFormInput />}
                    <div style={{ paddingTop: '5px' }}>
                        {helpTipElement}
                    </div>
                </div>
                <ExpressionEditor
                    value={currentExpressionValue.value || { isExpression: false, value: '', namespaces: [] }}
                    handleOnSave={(newValue) => {
                        if (currentExpressionValue) {
                            currentExpressionValue.setValue(newValue);
                        }
                        setExpressionEditorField(null);
                    }}
                    handleOnCancel={() => {
                        setExpressionEditorField(null);
                    }}
                />
            </>
        );
    }

    const renderFormElement = (element: Element, field: any) => {
        const name = getNameForController(element.name);
        const isRequired = typeof element.required === 'boolean' ? element.required : element.required === 'true';
        const errorMsg = errors[name] && errors[name].message.toString();
        const helpTip = element.helpTip;

        const helpTipElement = helpTip ? (
            <Tooltip
                content={helpTip}
                position='right'
            >
                <Icon name="question" isCodicon iconSx={{ fontSize: '18px' }} sx={{ marginLeft: '5px', cursor: 'help' }} />
            </Tooltip>
        ) : null;

        let placeholder = element.placeholder;
        if (placeholder?.conditionField) {
            const conditionFieldValue = watch(getNameForController(placeholder.conditionField));
            const conditionalPlaceholder = placeholder.values.find((value: any) => value[conditionFieldValue]);
            placeholder = conditionalPlaceholder?.[conditionFieldValue];
        }

        let keyType = element.keyType;
        if (keyType?.conditionField) {
            const conditionFieldValue = watch(getNameForController(keyType.conditionField));
            const conditionalKeyType = keyType.values.find((value: any) => value[conditionFieldValue]);
            keyType = conditionalKeyType?.[conditionFieldValue];
        }

        switch (element.inputType) {
            case 'string':
                if (element.name === 'connectionName') {
                    return null;
                }
                return (
                    <TextField {...field}
                        label={element.displayName}
                        labelAdornment={helpTipElement}
                        size={50}
                        placeholder={placeholder}
                        required={isRequired}
                        errorMsg={errorMsg}
                    />
                );
            case 'textArea':
                return (
                    <TextArea {...field}
                        label={element.displayName}
                        labelAdornment={helpTipElement}
                        rows={5}
                        placeholder={placeholder}
                        required={isRequired}
                        errorMsg={errorMsg}
                    />
                );
            case 'boolean':
            case 'checkbox':
                return (
                    <CheckBox
                        {...field}
                        label={element.displayName}
                        labelAdornment={helpTipElement}
                        checked={typeof field.value === 'boolean' ? field.value : field.value === 'true' ? true : false}
                    />
                );
            case 'stringOrExpression':
            case 'stringOrExpresion':
            case 'textOrExpression':
            case 'textAreaOrExpression':
            case 'integerOrExpression':
            case 'expression':
                const isValueLegacyExpression = isLegacyExpression(element.expressionType, isLegacyExpressionEnabled, field);
                if (isValueLegacyExpression) {
                    return ExpressionFieldComponent({
                        element,
                        canChange: element.inputType !== 'expression',
                        field,
                        helpTipElement,
                        placeholder,
                        isRequired
                    });
                }
                return FormExpressionFieldComponent(element, field, helpTipElement, isRequired, errorMsg);
            case 'booleanOrExpression':
            case 'comboOrExpression':
            case 'combo':
                const items = element.inputType === 'booleanOrExpression' ? ["true", "false"] : element.comboValues;
                const allowItemCreate = element.inputType === 'comboOrExpression';
                return (
                    <AutoComplete
                        name={name}
                        label={element.displayName}
                        labelAdornment={helpTipElement}
                        errorMsg={errorMsg}
                        items={items}
                        value={field.value}
                        onValueChange={(e: any) => {
                            field.onChange(e);
                        }}
                        required={isRequired}
                        allowItemCreate={allowItemCreate}
                    />
                );
            case 'key':
            case 'keyOrExpression':
            case 'comboOrKey': {
                let onCreateButtonClick;
                if (!Array.isArray(keyType)) {
                    onCreateButtonClick = (fetchItems: any, handleValueChange: any) => {
                        openPopup(rpcClient, element.keyType, fetchItems, handleValueChange, undefined, {type: keyType}, sidePanelContext);
                    }
                }

                return (<Keylookup
                    value={field.value}
                    filterType={(keyType as any) ?? "resource"}
                    label={element.displayName}
                    labelAdornment={helpTipElement}
                    allowItemCreate={element.canAddNew !== false || (element.canAddNew as any) !== 'false'}
                    onValueChange={field.onChange}
                    required={isRequired}
                    errorMsg={errorMsg}
                    additionalItems={element.comboValues}
                    {...element.inputType.endsWith('OrExpression') && { canChangeEx: true }}
                    {...element.inputType.endsWith('OrExpression') && { exprToggleEnabled: true }}
                    openExpressionEditor={(value: ExpressionFieldValue, setValue: any) => handleOpenExprEditor(value, setValue, handleOnCancelExprEditorRef, sidePanelContext)}
                    onCreateButtonClick={onCreateButtonClick}
                />)
            }
            case 'registry':
            case 'resource':
            case 'resourceOrExpression': {
                const onCreateButtonClick = (fetchItems: any, handleValueChange: any) => {
                    openPopup(rpcClient, "addResource", fetchItems, handleValueChange, undefined, { type: Array.isArray(keyType) ? keyType : [keyType] });
                }

                return (<Keylookup
                    value={field.value}
                    filterType={(keyType as any) ?? "resource"}
                    label={element.displayName}
                    labelAdornment={helpTipElement}
                    allowItemCreate={element.canAddNew !== false || (element.canAddNew as any) !== 'false'}
                    onValueChange={field.onChange}
                    required={isRequired}
                    errorMsg={errorMsg}
                    additionalItems={element.comboValues}
                    {...element.inputType.endsWith('OrExpression') && { canChangeEx: true }}
                    {...element.inputType.endsWith('OrExpression') && { exprToggleEnabled: true }}
                    openExpressionEditor={(value: ExpressionFieldValue, setValue: any) => handleOpenExprEditor(value, setValue, handleOnCancelExprEditorRef, sidePanelContext)}
                    onCreateButtonClick={onCreateButtonClick}
                />)
            }
            case 'stringWithParamManager': {
                return (
                    <StringWithParamManagerComponent
                        element={element}
                        isRequired={isRequired}
                        helpTipElement={helpTipElement}
                        field={field}
                        errorMsg={errorMsg}
                        nodeRange={range}
                    />
                )
            }
            case 'ParamManager': {
                return (
                    ParamManagerComponent(element, isRequired, helpTipElement, field)
                );
            }
            case 'codeTextArea':
                return (
                    <CodeTextArea
                        {...field}
                        label={element.displayName}
                        labelAdornment={helpTipElement}
                        placeholder={placeholder}
                        required={isRequired}
                        resize="vertical"
                        growRange={{ start: 5, offset: 10 }}
                        errorMsg={errorMsg}
                    />
                );
            case 'configurable': {
                const onCreateButtonClick = async (fetchItems: any, handleValueChange: any) => {
                    await rpcClient.getMiVisualizerRpcClient().addConfigurable({
                        projectUri: '',
                        configurableName: field.value.value,
                        configurableType: element.configurableType
                    });
                    handleValueChange(field.value.value);
                }
                return (
                    <div>
                        <Keylookup
                            name={getNameForController(element.name)}
                            label={element.displayName}
                            errorMsg={errors[getNameForController(element.name)] && errors[getNameForController(element.name)].message.toString()}
                            filter={(configurableType) => configurableType === element.configurableType}
                            filterType='configurable'
                            value={field.value.value ? field.value.value : ""}
                            onValueChange={(e: any) => {
                                field.onChange({ isConfigurable: true, value: e });
                            }}
                            required={false}
                            allowItemCreate={true}
                            onCreateButtonClick={onCreateButtonClick}
                        />
                    </div>
                );
            }
            case 'connection':
                return (
                    <>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: '100%', gap: '10px' }}>
                            <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
                                <label>{element.displayName}{element.required === 'true' && '*'}</label>
                            </div>
                            <LinkButton onClick={() => addNewConnection(name, element.allowedConnectionTypes)}>
                                <Codicon name="plus" />Add new connection
                            </LinkButton>
                        </div>
                        <AutoComplete
                            name={name}
                            errorMsg={errors[getNameForController(name)] && errors[getNameForController(name)].message.toString()}
                            items={connectionNames[name] ?? []}
                            value={field.value}
                            onValueChange={(e: any) => {
                                field.onChange(e);
                            }}
                            required={element.required === 'true'}
                            allowItemCreate={false}
                        />
                    </>);
            case 'expressionTextArea':
                return (
                    <FormTokenEditor
                        nodeRange={range}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={placeholder}
                        label={element.displayName}
                        labelAdornment={helpTipElement}
                        required={isRequired}
                        errorMsg={errorMsg}
                    />
                );
            case 'popUp':
                return (
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: '100%', gap: '10px' }}>
                        <div style={{ display: "flex", alignItems: "center", gap: '10px' }}>
                            <span>{element.helpTip}</span>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderForm: any = (elements: any[]) => {
        return elements.map((element: { type: string; value: any; }) => {
            const name = getNameForController(element.value.groupName ?? element.value.name);
            if (element?.value?.enableCondition !== undefined) {
                const shouldRender = getConditions(element.value.enableCondition);
                if (!shouldRender) {
                    if (getValues(name) !== undefined) {
                        setValue(name, undefined)
                    }
                    return;
                }
            }

            if (element.type === 'attributeGroup') {
                return (
                    <>
                        {(element.value.groupName === "Generic" || (element.value.groupName === "General" && skipGeneralHeading)) ?
                            renderForm(element.value.elements) :
                            <Field>
                                <FormGroup
                                    key={element.value.groupName}
                                    title={element.value.groupName}
                                    isCollapsed={(element.value.groupName === "Advanced" || !!element.value.isCollapsed) ?
                                        true : false
                                    }
                                    sx={{ paddingBottom: '0px', gap: '0px' }}
                                >
                                    {renderForm(element.value.elements)}
                                </FormGroup>
                            </Field>
                        }
                    </>
                );
            } else {
                if (element.value.hidden) {
                    return;
                }

                if (ignoreFields?.includes(element.value.name)) {
                    return;
                }

                return (
                    renderController(element)
                );
            }
        });
    };

    const renderController = (element: any) => {
        const name = getNameForController(element.value.name);
        const isRequired = typeof element.value.required === 'boolean' ? element.value.required : element.value.required === 'true';
        const matchPattern = element.value.matchPattern;
        let validateType = element.value.validateType;
        const defaultValue = getDefaultValue(element);

        if (getValues(name) === undefined) {
            setValue(name, defaultValue);
        }

        if (element.type === 'table') {
            element.value.inputType = 'ParamManager';
        }

        return (
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                rules={
                    {
                        ...(isRequired) && {
                            validate: (value) => {
                                if (value.fromAI) {
                                    return true;
                                }
                                if (!value || (typeof value === 'object' && !value.value)) {
                                    return "This field is required";
                                }
                                if (typeof value === 'object' && 'isExpression' in value && value.isExpression && (!value.value || value.value.replace(/\s/g, '') === '${}')) {
                                    return "Expression is required";
                                }
                                return true;
                            },
                        },
                        ...(matchPattern) && {
                            pattern: {
                                value: new RegExp(matchPattern),
                                message: "Value does not match the pattern"
                            }
                        },
                        ...(validateType) && {
                            validate: (value) => {
                                if (typeof validateType === 'object' && 'conditionField' in validateType) {
                                    const conditionFieldValue = getValues(validateType.conditionField);
                                    validateType = validateType.mapping[conditionFieldValue];
                                }
                                if (validateType === 'number' && isNaN(value)) {
                                    return "Value should be a number";
                                }
                                if (validateType === 'boolean' && !['true', 'false'].includes(value)) {
                                    return "Value should be a boolean";
                                }
                                if (validateType === 'json' && typeof value !== 'object') {
                                    try {
                                        JSON.parse(value);
                                    } catch (e) {
                                        return "Value should be a valid JSON";
                                    }
                                }
                                if (validateType === 'xml' && typeof value !== 'object') {
                                    const parser = new DOMParser();
                                    const xmlDoc = parser.parseFromString(value, "application/xml");
                                    if (xmlDoc.getElementsByTagName("parsererror").length) {
                                        return "Value should be a valid XML";
                                    }
                                }
                                return true;
                            }
                        }
                    }
                }
                render={({ field }) => (
                    <Field>
                        {renderFormElement(element.value, field)}
                    </Field>
                )}
            />
        );
    }

    function getConditions(conditions: any): boolean {
        const evaluateCondition = (condition: any) => {
            const [conditionKey] = Object.keys(condition);
            const expectedValue = condition[conditionKey];
            const currentVal = watch(getNameForController(conditionKey));

            if (conditionKey.includes('.')) {
                const [key, subKey] = conditionKey.split('.');
                const parentValue = watch(getNameForController(key));
                const subKeyValue = parentValue?.[subKey] || currentVal;
                return subKeyValue === expectedValue;
            }
            return currentVal === condition[conditionKey] || (typeof condition[conditionKey] === 'string' && String(currentVal) === condition[conditionKey]);
        };

        if (Array.isArray(conditions)) {
            const firstElement = conditions[0];
            const restConditions = conditions.slice(1);

            if (firstElement === "AND") {
                return restConditions.every(condition => Array.isArray(condition) ? getConditions(condition) : evaluateCondition(condition));
            } else if (firstElement === "OR") {
                return restConditions.some(condition => Array.isArray(condition) ? getConditions(condition) : evaluateCondition(condition));
            } else if (firstElement === "NOT") {
                const condition = conditions[1];
                return Array.isArray(condition) ? !getConditions(condition) : !evaluateCondition(condition);
            } else {
                return evaluateCondition(conditions[0]);
            }
        }
        return conditions; // Default case if conditions are not met
    }

    return (
        formData && formData.elements && formData.elements.length > 0 && !isLoading && (
            <>
                {formData.help && !ignoreFields?.includes('connectionName') && (
                    <div style={{
                        padding: "10px",
                        marginBottom: "20px",
                        borderBottom: "1px solid var(--vscode-editorWidget-border)",
                        display: "flex",
                        flexDirection: 'row'
                    }}>
                        {typeof formData.help === 'string' && formData.help.includes('<') ?
                            // <div dangerouslySetInnerHTML={{ __html: formData.help }} /> Enable when forms are fixed
                            null
                            : <Typography variant="body3">{formData.help}</Typography>
                        }
                        {formData.doc && <a href={formData.doc}><Icon name="question" isCodicon iconSx={{ fontSize: '18px' }} sx={{ marginLeft: '5px', cursor: 'help' }} /></a>}
                    </div>
                )}
                {formData.banner &&
                    <WarningBanner>
                        <ReactMarkdown>{formData.banner}</ReactMarkdown>
                    </WarningBanner>
                }
                {renderForm(formData.elements)}
            </>
        )
    );
};

export default FormGenerator;
