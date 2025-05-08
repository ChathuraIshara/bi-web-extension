/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Member, Type } from '@wso2-enterprise/ballerina-core';
import { Codicon } from '@wso2-enterprise/ui-toolkit';
import { Button } from '@wso2-enterprise/ui-toolkit';
import { FieldEditor } from './FieldEditor';
import styled from '@emotion/styled';


const Header = styled.div`
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 8px 0px;
    `;

const SectionTitle = styled.div`
        font-size: 13px;
        font-weight: 500;
        color: var(--vscode-editor-foreground);
        margin-bottom: 4px;
    `;

interface RecordEditorProps {
    type: Type;
    isAnonymous: boolean;
    onChange: (type: Type) => void;
    onImportJson: () => void;
    onImportXml: () => void;
    isGraphql?: boolean;
    onValidationError: (isError: boolean) => void;
}

interface FieldValidationError {
    identifier: boolean;
    type: boolean;
}

export const RecordEditor = forwardRef<{ addMember: () => void }, RecordEditorProps>((props, ref) => {
    const { type, isAnonymous = false, onChange, onImportJson, onImportXml, isGraphql, onValidationError } = props;

    const [validationErrors, setValidationErrors] = useState<FieldValidationError[]>([{ identifier: false, type: false }]);
    const [hasRecordError, setHasRecordError] = useState(false);


    const handleFieldValidation = (functionIndex: number, isIdentifier: boolean, hasError: boolean) => {
        setValidationErrors(prev => {
            const newErrors = [...prev];
            if (!newErrors[functionIndex]) {
                newErrors[functionIndex] = { identifier: false, type: false };
            }
            if (isIdentifier) {
                newErrors[functionIndex] = { ...newErrors[functionIndex], identifier: hasError };
            } else {
                newErrors[functionIndex] = { ...newErrors[functionIndex], type: hasError };
            }

            return newErrors;
        });
    };

    // Handle nested record validation
    const handleNestedRecordError = (hasError: boolean) => {
        setHasRecordError(hasError);
    };

    useEffect(() => {
        // Check if any field has validation errors OR if there's a nested record error
        const hasAnyFieldError = validationErrors.some(error => error && (error.identifier || error.type));
        const hasAnyError = hasAnyFieldError || hasRecordError;
        onValidationError?.(hasAnyError);
    }, [validationErrors, hasRecordError, onValidationError]);

    const addMember = () => {
        const memberCount = Object.keys(type.members).length;
        const newMemberName = `name${memberCount + 1}`;
        const newMember: Member = {
            name: newMemberName,
            type: "string",
            kind: "FIELD",
            refs: [],
            docs: ""
        }
        onChange({ ...type, members: [...type.members, newMember] });
    }

    useImperativeHandle(ref, () => ({
        addMember
    }));

    const handleMemberChange = (index: number) => (member: Member) => {
        const newMembers = [...type.members];
        newMembers[index] = member;
        onChange({ ...type, members: newMembers });
    }

    const handleDeleteMember = (index: number) => () => {
        const newMembers = type.members.filter((_, i) => i !== index);
        onChange({ ...type, members: newMembers });
    }

    return (
        <div className="record-editor">
            {!isAnonymous &&
                <Header>
                    <SectionTitle>{isGraphql ? 'Input Object Fields' : 'Fields'}</SectionTitle>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button appearance="icon" onClick={onImportJson}>
                            <Codicon name="arrow-circle-up" />&nbsp;JSON
                        </Button>
                        <Button appearance="icon" onClick={onImportXml}>
                            <Codicon name="arrow-circle-up" />&nbsp;XML
                        </Button>
                        <Button appearance="icon" onClick={addMember}><Codicon name="add" /></Button>
                    </div>
                </Header>
            }
            {type.members.map((member, index) => (
                <>
                    <FieldEditor
                        key={index}
                        member={member}
                        onChange={handleMemberChange(index)}
                        onDelete={handleDeleteMember(index)}
                        type={type}
                        onValidationError={onValidationError}
                        onFieldValidation={(isIdentifier, hasError) => handleFieldValidation(index, isIdentifier, hasError)}
                        onRecordValidation={handleNestedRecordError}
                    />
                </>
            ))}
        </div >
    );
});
