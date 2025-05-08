/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import * as React from "react";

import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { StatementEditorButton } from "../buttons/StatementEditorButton";

import { useStyles } from "./style";

export interface FormActionButtonsProps {
    cancelBtnText?: string;
    saveBtnText?: string;
    isMutationInProgress?: boolean;
    validForm?: boolean;
    onSave?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onCancel?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    cancelBtn?: boolean;
    statementEditor?: boolean;
    toggleChecked?: boolean;
    experimentalEnabled?: boolean;
}

export function FormActionButtons(props: FormActionButtonsProps) {
    const classes = useStyles();
    const { cancelBtnText, saveBtnText, isMutationInProgress, validForm, onSave, onCancel, cancelBtn, statementEditor,
            toggleChecked, experimentalEnabled } = props;

    const [isClicked, setIsClicked] = React.useState<boolean>(isMutationInProgress);

    const handleSave = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!isClicked) {
            onSave(event);
            setIsClicked(true);
        }
    };

    return (
        <div className={classes.footer}>
            <div className={classes.stmtEditorToggle}>
                {experimentalEnabled && statementEditor && (
                    <StatementEditorButton checked={toggleChecked} />
                )}
            </div>
            <div className={classes.buttonWrapper}>
                <div className={classes.spaceBetween}>
                    {cancelBtn && <SecondaryButton text={cancelBtnText} fullWidth={false} onClick={onCancel} />}
                </div>
                <div className={classes.spaceBetween}>
                    <PrimaryButton
                        dataTestId="save-btn"
                        text={saveBtnText}
                        disabled={isClicked || !validForm}
                        fullWidth={false}
                        onClick={handleSave}
                    />
                </div>
            </div>
        </div>
    );
}
