// tslint:disable: jsx-no-lambda jsx-no-multiline-js
import React, { useEffect, useState } from "react";

import { FormHelperText, TextField } from "@material-ui/core";
import { TooltipCodeSnippet } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { CodeAction, Diagnostic } from "vscode-languageserver-protocol";

import { useStyles as useFormStyles } from "../../themes";
import { DIAGNOSTIC_MAX_LENGTH } from "../ExpressionEditor/constants";
import { truncateDiagnosticMsg } from "../ExpressionEditor/utils";


interface StatementSyntaxDiagnostics {
    message: string;
    isPlaceHolderDiag?: boolean;
    diagnostic?: Diagnostic;
    codeActions?: CodeAction[];
}

export interface LiteTextFieldProps {
    value?: string;
    onChange: (newType: string) => void;
    isLoading: boolean;
    diagnostics: StatementSyntaxDiagnostics[];
    onFocus?: () => void;
}

function LiteTextFieldC(props: LiteTextFieldProps) {
    const { value, diagnostics, onChange, isLoading, onFocus } = props;

    const [expressionDiagnosticMsg, setExpressionDiagnosticMsg] = useState("");
    const [expressionDiagnosticMsgSecond, setExpressionDiagnosticMsgSecond] = useState("");

    const handleValueChange = (input: string) => {
        onChange(input);
    }

    const handleOnFocus = (e?: any) => {
        if (onFocus) {
            e.target.select();
            onFocus();
        }
    }

    // When diagnostics are hit push the error message
    useEffect(() => {
        if (diagnostics) {
            if (diagnostics.length > 0) {
                setExpressionDiagnosticMsg(diagnostics[0].message);
                if (diagnostics.length > 1) {
                    setExpressionDiagnosticMsgSecond(diagnostics[1].message);
                }
            } else {
                setExpressionDiagnosticMsg("");
                setExpressionDiagnosticMsgSecond("");
            }
        } else {
            setExpressionDiagnosticMsg("");
            setExpressionDiagnosticMsgSecond("");
        }
    }, [diagnostics]);

    return (
        <>
            <TextField
                variant="outlined"
                fullWidth={true}
                value={value}
                margin="none"
                size="small"
                onChange={(e) => { handleValueChange(e.target.value) }}
                InputLabelProps={{ shrink: false }}
                disabled={isLoading}
                onFocus={handleOnFocus}
            />
            {expressionDiagnosticMsg && (
                <>
                    {<DiagnosticView message={expressionDiagnosticMsg} />}
                </>
            )
            }
            {expressionDiagnosticMsgSecond && (
                <>
                    {<DiagnosticView message={expressionDiagnosticMsgSecond} />}
                </>
            )
            }
        </>
    );
}

function DiagnosticView(props: { message: string }) {
    const { message } = props;
    const formClasses = useFormStyles();

    return (
        <TooltipCodeSnippet disabled={message.length <= DIAGNOSTIC_MAX_LENGTH} content={message} placement="right" arrow={true}>
            <FormHelperText className={formClasses.invalidCode} data-testid="expr-diagnostics">
                {truncateDiagnosticMsg(message)}
            </FormHelperText>
        </TooltipCodeSnippet>
    );
}

export const LiteTextField = React.memo(LiteTextFieldC);
