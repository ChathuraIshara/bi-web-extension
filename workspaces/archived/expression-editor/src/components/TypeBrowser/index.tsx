// tslint:disable: jsx-no-lambda jsx-no-multiline-js jsx-wrap-multiline
import React, { useEffect, useState } from "react";

import styled from "@emotion/styled";
import { FormHelperText, LinearProgress, TextField } from "@material-ui/core";
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'
import {
    SecondaryButton,
    TooltipCodeSnippet
} from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { CodeAction, Diagnostic } from "vscode-languageserver-protocol";

import { useStyles as useFormStyles } from "../../themes";
import { DIAGNOSTIC_MAX_LENGTH } from "../ExpressionEditor/constants";
import { truncateDiagnosticMsg } from "../ExpressionEditor/utils";
import { SuggestionItem } from "../LiteExpressionEditor";


interface StatementSyntaxDiagnostics {
    message: string;
    isPlaceHolderDiag?: boolean;
    diagnostic?: Diagnostic;
    codeActions?: CodeAction[];
}

export interface TypeBrowserProps {
    type?: string;
    onChange: (newType: string) => void;
    isLoading: boolean;
    recordCompletions: CompletionResponseWithModule[];
    createNew: (newType: string) => void;
    diagnostics: StatementSyntaxDiagnostics[];
    isGraphqlForm?: boolean;
    isParameterType?: boolean;
}

export interface CompletionResponseWithModule extends SuggestionItem {
    module?: string;
}

function TypeBrowserC(props: TypeBrowserProps) {
    const { type, diagnostics, onChange, isLoading, recordCompletions, createNew, isGraphqlForm, isParameterType } = props;
    const [selectedTypeStr, setSelectedTypeStr] = useState(type ? type : '');
    const [inputValue, setInputValue] = useState(type ? type : '');

    const [expressionDiagnosticMsg, setExpressionDiagnosticMsg] = useState("");

    // Create new record and add it to the list
    const handleCreateNew = () => {
        const validName = inputValue.replace(/[\])}[{(]/g, '');
        const completion: CompletionResponseWithModule = {
            detail: "Record",
            insertText: validName,
            insertTextFormat: 2,
            kind: "Record",
            label: validName,
            sortText: "CA",
            suggestionType: 22,
            value: validName,
        }
        recordCompletions.push(completion);
        createNew(validName);
        setSelectedTypeStr(validName);
        setExpressionDiagnosticMsg("");
    }

    const handleCreatingNewConstruct = (nodeType: ConstructType) => {
        const typeName = expressionDiagnosticMsg.match(/'(.*)'/)[1];
        let codeSnippet: string = "";
        if (nodeType === ConstructType.RECORD_CONSTRUCT) {
            codeSnippet = `type ${typeName} record {};`;
        } else if (nodeType === ConstructType.CLASS_CONSTRUCT) {
            codeSnippet = `service class ${typeName} {}`
        }
        createNew(codeSnippet);
        setSelectedTypeStr(selectedTypeStr);
        setExpressionDiagnosticMsg("");
    }

    // When diagnostics are hit push the error message
    useEffect(() => {
        if (diagnostics) {
            if (diagnostics.length > 0) {
                setExpressionDiagnosticMsg(diagnostics[0].message);
            } else {
                setExpressionDiagnosticMsg("");
            }
        } else {
            setExpressionDiagnosticMsg("");
        }
    }, [diagnostics]);

    const filterOptions = createFilterOptions({
        matchFrom: 'start',
        stringify: (option: any) => option.insertText,
    });

    const handleOnChange = (_: any, value: CompletionResponseWithModule) => {
        onChange(value?.module ? `${value.module}:${value.insertText}` : value?.insertText)
    }

    return (
        <>
            <Autocomplete
                freeSolo={true}
                data-testid='type-select-dropdown'
                options={recordCompletions}
                defaultValue={selectedTypeStr}
                inputValue={inputValue}
                onChange={handleOnChange}
                getOptionLabel={(option) => option?.insertText || selectedTypeStr}
                renderInput={(params) => <TextFieldStyled {...params} autoFocus={!isLoading && !selectedTypeStr} />}
                onInputChange={(_, value) => {
                    if (!isLoading) {
                        setInputValue(value);
                        onChange(value);
                    }
                }}
                filterOptions={filterOptions}
                blurOnSelect={true}
            />
            {isLoading && <LinearProgress />}
            {expressionDiagnosticMsg && (
                <>
                    {<DiagnosticView
                        handleCreateNew={handleCreateNew}
                        message={expressionDiagnosticMsg}
                        isGraphqlForm={isGraphqlForm ? isGraphqlForm : false}
                        createNewConstruct={handleCreatingNewConstruct}
                        isParameterType={isParameterType}
                    />}
                </>
            )
            }
        </>
    );
}

enum ConstructType {
    RECORD_CONSTRUCT = "Create Record",
    CLASS_CONSTRUCT = "Create Service Class"
}

function DiagnosticView(props: { handleCreateNew: () => void, message: string, isGraphqlForm?: boolean, isParameterType?: boolean, createNewConstruct?: (constructType: ConstructType) => void }) {
    const { message, handleCreateNew, isGraphqlForm, isParameterType, createNewConstruct } = props;
    const formClasses = useFormStyles();


    const handleConstructOption = async (mode: ConstructType) => {
        createNewConstruct(mode);
    }

    return (
        <>
            {isGraphqlRelated(isGraphqlForm, message) ?
                (
                    <TooltipCodeSnippet disabled={message.length <= DIAGNOSTIC_MAX_LENGTH} content={message} placement="right" arrow={true}>
                        <>
                            <FormHelperText className={formClasses.invalidCode} data-testid="expr-diagnostics">
                                {truncateDiagnosticMsg(message + ". Do you want to create a new construct?")}
                            </FormHelperText>
                            {!isParameterType &&
                                <SecondaryButton text={"Create Service Class"} fullWidth={false} onClick={() => handleConstructOption(ConstructType.CLASS_CONSTRUCT)} />
                            }
                            <SecondaryButton text={"Create Record"} fullWidth={false} onClick={() => handleConstructOption(ConstructType.RECORD_CONSTRUCT)} />
                        </>
                    </TooltipCodeSnippet>
                ) : (
                    <TooltipCodeSnippet disabled={message.length <= DIAGNOSTIC_MAX_LENGTH} content={message} placement="right" arrow={true}>
                        <FormHelperText className={formClasses.invalidCode} data-testid="expr-diagnostics">
                            {truncateDiagnosticMsg(message)}
                            {handleCreateNew && <span className={formClasses.recordCreate} onClick={handleCreateNew} >Create Record</span>}
                        </FormHelperText>
                    </TooltipCodeSnippet>
                )
            }
        </>
    );
}

const isGraphqlRelated = (isGraphqlForm: boolean, message: string): boolean => {
    return isGraphqlForm && (message !== "unknown type 'undefined'") && message.includes("unknown type");
}

export const TypeBrowser = React.memo(TypeBrowserC);

const TextFieldStyled = styled(TextField)`
    width: 100%;
    border: 1px solid #DEE0E7;
    border-radius: 5px;
    padding: 2px 6px;
    background-color: #ffffff;
    height: 36.44px;
`;
