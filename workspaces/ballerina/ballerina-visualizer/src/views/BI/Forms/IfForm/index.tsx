/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Codicon, FormExpressionEditorRef, LinkButton, ThemeColors } from "@wso2-enterprise/ui-toolkit";

import {
    FlowNode,
    Branch,
    LineRange,
    SubPanel,
    SubPanelView,
    FormDiagnostics,
    Diagnostic,
    ExpressionProperty
} from "@wso2-enterprise/ballerina-core";
import {
    FormValues,
    ExpressionEditor,
    ExpressionFormField,
    FormExpressionEditorProps
} from "@wso2-enterprise/ballerina-side-panel";
import { FormStyles } from "../styles";
import { convertNodePropertyToFormField, removeDuplicateDiagnostics } from "../../../../utils/bi";
import { cloneDeep, debounce } from "lodash";
import { RemoveEmptyNodesVisitor, traverseNode } from "@wso2-enterprise/bi-diagram";
import { useRpcContext } from "@wso2-enterprise/ballerina-rpc-client";

interface IfFormProps {
    fileName: string;
    node: FlowNode;
    targetLineRange: LineRange;
    expressionEditor: FormExpressionEditorProps;
    onSubmit: (node?: FlowNode) => void;
    openSubPanel: (subPanel: SubPanel) => void;
    updatedExpressionField?: ExpressionFormField;
    resetUpdatedExpressionField?: () => void;
    subPanelView?: SubPanelView;
}

export function IfForm(props: IfFormProps) {
    const {
        fileName,
        node,
        targetLineRange,
        expressionEditor,
        onSubmit,
        openSubPanel,
        updatedExpressionField,
        resetUpdatedExpressionField,
        subPanelView
    } = props;
    const { 
        watch,
        control, 
        getValues, 
        setValue, 
        handleSubmit,
        setError,
        clearErrors,
        formState: { isValidating },
    } = useForm<FormValues>();

    const { rpcClient } = useRpcContext();
    const [activeEditor, setActiveEditor] = useState<number>(0);
    const [branches, setBranches] = useState<Branch[]>(cloneDeep(node.branches));
    const [diagnosticsInfo, setDiagnosticsInfo] = useState<FormDiagnostics[] | undefined>(undefined);

    const exprRef = useRef<FormExpressionEditorRef>(null);

    const handleFormOpen = () => {
        rpcClient
            .getBIDiagramRpcClient()
            .formDidOpen({ filePath: fileName })
            .then(() => {
                console.log(">>> If form opened");
            });
    };

    const handleFormClose = () => {
        rpcClient
            .getBIDiagramRpcClient()
            .formDidClose({ filePath: fileName })
            .then(() => {
                console.log(">>> If form closed");
            });
    };

    const hasElseBranch = branches.find(
        (branch) =>
            branch.label === "Else" &&
            ((branch.children?.length > 0 &&
                !(branch.children[0].codedata.node === "EMPTY" && branch.children[0].metadata.draft)) ||
                branch.children?.length === 0)
    );

    useEffect(() => {
        if (updatedExpressionField) {
            const currentValue = getValues(updatedExpressionField.key);

            if (currentValue !== undefined) {
                const cursorPosition =
                    exprRef.current?.shadowRoot?.querySelector("textarea")?.selectionStart ?? currentValue.length;
                const newValue =
                    currentValue.slice(0, cursorPosition) +
                    updatedExpressionField.value +
                    currentValue.slice(cursorPosition);

                setValue(updatedExpressionField.key, newValue);
                resetUpdatedExpressionField && resetUpdatedExpressionField();
            }
        }
    }, [updatedExpressionField]);

    useEffect(() => {
        handleFormOpen();
        branches.forEach((branch, index) => {
            if (branch.properties?.condition) {
                const conditionValue = branch.properties.condition.value;
                setValue(`branch-${index}`, conditionValue || "");
            }
        });

        return () => {
            handleFormClose();
        }
    }, []);

    const handleSetDiagnosticsInfo = (diagnostics: FormDiagnostics) => {
        const otherDiagnostics = diagnosticsInfo?.filter((item) => item.key !== diagnostics.key) || [];
        setDiagnosticsInfo([...otherDiagnostics, diagnostics]);
    }

    const handleOnSave = (data: FormValues) => {
        if (node && targetLineRange) {
            let updatedNode = cloneDeep(node);

            if (!updatedNode.codedata.lineRange) {
                updatedNode.codedata.lineRange = {
                    ...node.codedata.lineRange,
                    startLine: targetLineRange.startLine,
                    endLine: targetLineRange.endLine,
                };
            }

            // loop data and update branches (properties.condition.value)
            branches.forEach((branch, index) => {
                if (branch.label === "Else") {
                    return;
                }
                const conditionValue = data[`branch-${index}`]?.trim();
                if (conditionValue) {
                    branch.properties.condition.value = conditionValue;
                    if (branch.label !== "Then") {
                        branch.label = "";
                    }
                }
            });

            updatedNode.branches = branches;

            // check all nodes and remove empty nodes
            const removeEmptyNodeVisitor = new RemoveEmptyNodesVisitor(updatedNode);
            traverseNode(updatedNode, removeEmptyNodeVisitor);
            const updatedNodeWithoutEmptyNodes = removeEmptyNodeVisitor.getNode();

            onSubmit(updatedNodeWithoutEmptyNodes);
        }
    };

    const addNewCondition = () => {
        // create new branch obj
        const newBranch: Branch = {
            label: "branch-" + branches.length,
            kind: "block",
            codedata: {
                node: "CONDITIONAL",
                lineRange: null,
            },
            repeatable: "ONE_OR_MORE",
            properties: {
                condition: {
                    metadata: {
                        label: "Else If Condition",
                        description: "Add condition to evaluate if the previous conditions are false",
                    },
                    valueType: "EXPRESSION",
                    value: "",
                    placeholder: "true",
                    optional: false,
                    editable: true,
                },
            },
            children: [],
        };

        setValue(`branch-${branches.length}`, "");
        // add new branch to end of the current branches
        setBranches([...branches, newBranch]);
    };

    const removeCondition = (index: number) => {
        // Don't remove if it's the first branch (Then) or last branch (Else)
        if (index === 0 || (hasElseBranch && index === branches.length - 1)) {
            return;
        }
        // Remove the branch at the specified index
        const updatedBranches = branches.filter((_, i) => i !== index);
        setBranches(updatedBranches);

        for (let i = index + 1; i < branches.length; i++) {
            const value = getValues(`branch-${i}`);
            setValue(`branch-${i - 1}`, value);
        }
    };

    const addElseBlock = () => {
        if (hasElseBranch) {
            return;
        }
        const elseBranch: Branch = {
            label: "Else",
            kind: "block",
            codedata: {
                node: "ELSE",
                lineRange: null,
            },
            repeatable: "ZERO_OR_ONE",
            properties: {
                condition: {
                    metadata: {
                        label: "Else",
                        description: "Add condition to evaluate if the previous conditions are false",
                    },
                    valueType: "EXPRESSION",
                    value: "",
                    placeholder: "true",
                    optional: false,
                    editable: true,
                },
            },
            children: [],
        };
        // add new branch to end of the current branches
        setBranches([...branches, elseBranch]);
    };

    const removeElseBlock = () => {
        if (!hasElseBranch) {
            return;
        }
        // remove the else branch
        const updatedBranches = branches.filter((branch) => branch.label !== "Else");
        setBranches(updatedBranches);
    };

    const handleExpressionEditorDiagnostics = useCallback(debounce(async (
        showDiagnostics: boolean,
        expression: string,
        key: string,
        property: ExpressionProperty
    ) => {
        if (!showDiagnostics) {
            handleSetDiagnosticsInfo({ key, diagnostics: [] });
            return;
        }
        
        const response = await rpcClient.getBIDiagramRpcClient().getExpressionDiagnostics({
            filePath: fileName,
            context: {
                expression: expression,
                startLine: targetLineRange.startLine,
                lineOffset: 0,
                offset: 0,
                codedata: undefined,
                property: property,
            }
        });

        const uniqueDiagnostics = removeDuplicateDiagnostics(response.diagnostics);
        handleSetDiagnosticsInfo({ key, diagnostics: uniqueDiagnostics });
    }, 250), [rpcClient, fileName, targetLineRange, node, handleSetDiagnosticsInfo]);

    const handleEditorFocus = (currentActive: number) => {
        const isActiveSubPanel = subPanelView !== SubPanelView.UNDEFINED;
        if (isActiveSubPanel && activeEditor !== currentActive) {
            openSubPanel && openSubPanel({ view: SubPanelView.UNDEFINED });
        }
        setActiveEditor(currentActive);
    };

    const isValid = useMemo(() => {
        if (!diagnosticsInfo) {
            return true;
        }

        let hasDiagnostics: boolean = true;
        for (const diagnosticsInfoItem of diagnosticsInfo) {
            const key = diagnosticsInfoItem.key;
            if (!key) {
                continue;
            }

            const diagnostics: Diagnostic[] = diagnosticsInfoItem.diagnostics || [];
            if (diagnostics.length === 0) {
                clearErrors(key);
                continue;
            } else {
                const diagnosticsMessage = diagnostics.map(d => d.message).join('\n');
                setError(key, { type: "validate", message: diagnosticsMessage });
    
                // If the severity is not ERROR, don't invalidate
                const hasErrorDiagnostics = diagnostics.some(d => d.severity === 1);
                if (hasErrorDiagnostics) {
                    hasDiagnostics = false;
                } else {
                    continue;
                }
            }
        }

        return hasDiagnostics;
    }, [diagnosticsInfo])

    const disableSaveButton = !isValid || isValidating;

    // TODO: support multiple type fields
    return (
        <FormStyles.Container>
            {branches.map((branch, index) => {
                if (branch.properties?.condition && branch.label !== "Else") {
                    const field = convertNodePropertyToFormField(`branch-${index}`, branch.properties.condition);
                    return (
                        <FormStyles.Row key={field.key}>
                            <ExpressionEditor
                                {...expressionEditor}
                                ref={exprRef}
                                control={control}
                                field={field}
                                watch={watch}
                                openSubPanel={openSubPanel}
                                targetLineRange={targetLineRange}
                                fileName={fileName}
                                onRemove={index !== 0 && !branch.label.includes("Else") ? () => removeCondition(index) : undefined}
                                completions={activeEditor === index ? expressionEditor.completions : []}
                                triggerCharacters={expressionEditor.triggerCharacters}
                                retrieveCompletions={expressionEditor.retrieveCompletions}
                                extractArgsFromFunction={expressionEditor.extractArgsFromFunction}
                                getExpressionEditorDiagnostics={handleExpressionEditorDiagnostics}
                                onFocus={() => handleEditorFocus(index)}
                                onCompletionItemSelect={expressionEditor.onCompletionItemSelect}
                                onCancel={expressionEditor.onCancel}
                                onBlur={expressionEditor.onBlur}
                            />
                        </FormStyles.Row>
                    );
                }
            })}

            <LinkButton onClick={addNewCondition} sx={{ fontSize: 12, padding: 8, color: ThemeColors.PRIMARY, gap: 4 }}>
                <Codicon name={"add"} iconSx={{ fontSize: 12 }} sx={{ height: 12 }} />
                Add Else IF Block
            </LinkButton>

            {!hasElseBranch && (
                <LinkButton onClick={addElseBlock} sx={{ fontSize: 12, padding: 8, color: ThemeColors.PRIMARY, gap: 4 }}>
                    <Codicon name={"add"} iconSx={{ fontSize: 12 }} sx={{ height: 12 }} />
                    Add Else Block
                </LinkButton>
            )}

            {hasElseBranch && (
                <LinkButton onClick={removeElseBlock} sx={{ fontSize: 12, padding: 8, color: ThemeColors.ERROR, gap: 4 }}>
                    <Codicon name={"chrome-minimize"} iconSx={{ fontSize: 12 }} sx={{ height: 12 }} />
                    Remove Else Block
                </LinkButton>
            )}

            {onSubmit && (
                <FormStyles.Footer>
                    <Button appearance="primary" onClick={handleSubmit(handleOnSave)} disabled={disableSaveButton}>
                        Save
                    </Button>
                </FormStyles.Footer>
            )}
        </FormStyles.Container>
    );
}

export default IfForm;
