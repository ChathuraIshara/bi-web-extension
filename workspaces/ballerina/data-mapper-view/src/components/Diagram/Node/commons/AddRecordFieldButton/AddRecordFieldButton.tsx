/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-lambda jsx-no-multiline-js
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { Button, Codicon, Icon, Tooltip } from "@wso2-enterprise/ui-toolkit";

import { getBalRecFieldName } from "../../../utils/dm-utils";
import { useStyles } from "./styles";

interface Props {
    indentation: number;
    addNewField: (fieldName: string) => void;
    existingFieldNames: string[];
    fieldId?: string;
}

export const AddRecordFieldButton: FC<Props> = ({
    indentation,
    addNewField,
    existingFieldNames,
    fieldId
}) => {
    const [newFieldName, setNewFieldName] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const classes = useStyles();

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                inputRef.current && 
                !inputRef.current.contains(event.target as Node) && 
                !(event.target instanceof Element && event.target.closest('.codicon-pass'))
            ) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClose = () => {
        setNewFieldName("");
        setIsEditing(false);
    };

    const onNewFieldNameKeyUp = async (key: string) => {
        if (key === "Escape") {
            handleClose();
        }
        if (key === "Enter" && isValid) {
            addField(newFieldName);
        }
    };

    const addField = (fieldName: string) => {
        if (newFieldName) {
            addNewField(getBalRecFieldName(fieldName));
        }
        handleClose();
    };

    const handleClick = () => {
        setIsEditing(true);
    };

    const validationMessage = useMemo(() => {
        if (existingFieldNames.includes(getBalRecFieldName(newFieldName))) {
            return "Field name already exists";
        } else if (newFieldName.trim() === "") {
            return "Field name cannot be empty";
        } else if (/\s/.test(newFieldName)) {
            return "Field name cannot contain spaces";
        } else if (/^[0-9]/.test(newFieldName)) {
            return "Field name cannot start with a number";
        } else if (/[^a-zA-Z0-9_]/.test(newFieldName)) {
            return "Field name can only contain letters, numbers, and underscores";
        }
        return "";
    }, [newFieldName, existingFieldNames]);

    const isValid = useMemo(() => {
        return validationMessage === "";
    }, [validationMessage]);

    return (
        <div className={classes.addFieldWrap} style={{ paddingLeft: indentation }}>
            {!isEditing && (
                <Button
                    appearance="icon"
                    data-testid={`add-new-field-${fieldId}`}
                    aria-label="add"
                    onClick={handleClick}
                    className={classes.addFieldButton}
                >
                    <Codicon name="add" sx={{ marginRight: "4px" }} />
                    Add Field
                </Button>
            )}
            {isEditing && (
                <div className={classes.fieldEditor}>
                    <input
                        ref={inputRef}
                        spellCheck={false}
                        className={classes.input}
                        autoFocus={true}
                        value={newFieldName}
                        onChange={(event) => setNewFieldName(event.target.value)}
                        onKeyUp={(event) => onNewFieldNameKeyUp(event.key)}
                        placeholder="New field name (eg. outputField)"
                        data-testid={`new-field-name`}
                    />
                    {newFieldName && (
                        <>
                            {!isValid && (
                                <Tooltip
                                    content={validationMessage}
                                    position="bottom"
                                >
                                    <Codicon name="warning" iconSx={{ color: "var(--vscode-charts-red)"}} />
                                </Tooltip>
                            )}
                            {isValid && (
                                <Button
                                    appearance="icon"
                                    onClick={() => addField(newFieldName)}
                                >
                                    <Codicon name="pass" iconSx={{ color: "var(--vscode-charts-green)"}} />
                                </Button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
