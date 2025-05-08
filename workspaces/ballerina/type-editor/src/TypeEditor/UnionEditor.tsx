/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useRef, useState, useEffect } from "react";
import { Button, Codicon } from "@wso2-enterprise/ui-toolkit";
import styled from "@emotion/styled";
import { Type, Member, Imports } from "@wso2-enterprise/ballerina-core";
import { BallerinaRpcClient } from "@wso2-enterprise/ballerina-rpc-client";
import { TypeField } from "./TypeField";

namespace S {
    export const Container = styled.div`
        display: flex;
        flex-direction: column;
    `;

    export const MemberRow = styled.div`
        display: flex;
        gap: 8px;
        justify-content: space-between;
        margin-bottom: 8px;
    `;

    export const Header = styled.div`
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 8px 0px;
        margin-bottom: 8px;

    `;

    export const SectionTitle = styled.div`
        font-size: 13px;
        font-weight: 500;
        color: var(--vscode-editor-foreground);
        margin-bottom: 4px;
    `;

    export const AddButton = styled(Button)`
        margin-top: 8px;
    `;

    export const DeleteButton = styled(Button)`
        min-width: 32px;
        height: 32px;
        padding: 0;
    `;

    export const ValidationMessage = styled.div`
        color: var(--vscode-errorForeground);
        font-size: 12px;
        margin-top: 8px;
    `;
}

interface UnionEditorProps {
    type: Type;
    onChange: (type: Type) => void;
    rpcClient: BallerinaRpcClient;
    onValidationError: (isError: boolean) => void;
}

export function UnionEditor({ type, onChange, rpcClient, onValidationError }: UnionEditorProps) {

    // Add state to track validation errors for each field
    const [validationErrors, setValidationErrors] = useState<boolean[]>([]);
    const [notEnoughMembers, setNotEnoughMembers] = useState<boolean>(false);
    const currentImports = useRef<Imports | undefined>();

    // Initialize with two default members if none exist
    useEffect(() => {
        let shouldUpdateType = false;
        let updatedMembers: Member[] = [...(type.members || [])];

        if (!type.members || type.members.length < 2) {
            shouldUpdateType = true;

            // Keep any existing member
            if (type.members && type.members.length === 1) {
                // Keep the existing member
            } else if (!type.members || type.members.length === 0) {
                // Add first default member
                updatedMembers.push({
                    kind: "TYPE",
                    type: "",
                    refs: [],
                    name: ""
                });
            }

            // Add second default member if needed
            if (updatedMembers.length < 2) {
                updatedMembers.push({
                    kind: "TYPE",
                    type: "",
                    refs: [],
                    name: ""
                });
            }
        }

        // Update the validation state
        const hasFieldErrors = validationErrors.some(error => error);
        setNotEnoughMembers(updatedMembers.length < 2);
        onValidationError(updatedMembers.length < 2 || hasFieldErrors);

        // Only update the type if we made changes
        if (shouldUpdateType) {
            onChange({
                ...type,
                members: updatedMembers
            });
        }
    }, [type.members?.length]);

    // Validate that there are at least two members
    const validateMemberCount = (count: number) => {
        const notEnough = count < 2;
        setNotEnoughMembers(notEnough);

        // Combine field validation errors with member count validation
        const hasAnyError = notEnough || validationErrors.some(error => error);
        onValidationError?.(hasAnyError);
    };

    const handleValidationError = (index: number, hasError: boolean) => {
        setValidationErrors(prev => {
            const newErrors = [...prev];
            newErrors[index] = hasError;

            // Combine field validation with member count validation
            const hasAnyError = notEnoughMembers || newErrors.some(error => error);
            onValidationError?.(hasAnyError);

            return newErrors;
        });
    };

    const addMember = () => {
        const newMember: Member = {
            kind: "TYPE",
            type: "",
            refs: [],
            name: ""
        };

        const updatedMembers = [...type.members, newMember];
        onChange({
            ...type,
            members: updatedMembers
        });

        validateMemberCount(updatedMembers.length);
    };

    const updateMember = (index: number, name: string) => {
        const updatedMembers = [...type.members];
        updatedMembers[index] = {
            ...updatedMembers[index],
            type: name,
            name: name,
            refs: [],
            imports: currentImports.current
        };

        onChange({
            ...type,
            members: updatedMembers
        });
        currentImports.current = undefined;
    };

    const handleUpdateImports = (index: number, imports: Imports) => {
        const newImportKey = Object.keys(imports)[0];
        const currentMember = type.members[index];
        if (!currentMember.imports || !Object.keys(currentMember.imports)?.includes(newImportKey)) {
            // Updated the existing imports with the new imports
            const updatedImports = { ...currentMember.imports, ...imports };
            currentImports.current = updatedImports;
        }
    }

    const deleteMember = (index: number) => {
        const updatedMembers = type.members.filter((_, i) => i !== index);
        onChange({
            ...type,
            members: updatedMembers
        });

        validateMemberCount(updatedMembers.length);
    };


    return (
        <S.Container>
            <S.Header>
                <S.SectionTitle>Members</S.SectionTitle>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button appearance="icon" onClick={addMember}><Codicon name="add" /></Button>
                </div>
            </S.Header>
            {type.members.map((member, index) => (
                <S.MemberRow key={index}>
                    <TypeField
                        type={member.type}
                        memberName={typeof member.type === 'string' ? member.type : member.name}
                        onChange={(newType) => updateMember(index, newType)}
                        onUpdateImports={(imports) => handleUpdateImports(index, imports)}
                        placeholder="Enter type"
                        sx={{ flexGrow: 1 }}
                        rootType={type}
                        autoFocus={index === 0}
                        onValidationError={(hasError) => handleValidationError(index, hasError)}
                    />
                    <Button
                        appearance="icon"
                        onClick={() => deleteMember(index)}
                        disabled={type.members.length <= 2}
                        tooltip={type.members.length <= 2 ? "Union must have at least two members" : "Remove member"}
                    >
                        <Codicon
                            name="trash"
                            sx={{
                                cursor: type.members.length <= 2 ? "not-allowed" : "pointer"
                            }}
                        />
                    </Button>
                </S.MemberRow>
            ))}
            {notEnoughMembers && type.members.length < 2 && (
                <S.ValidationMessage>
                    Union type must have at least two members
                </S.ValidationMessage>
            )}
        </S.Container>
    );
} 
