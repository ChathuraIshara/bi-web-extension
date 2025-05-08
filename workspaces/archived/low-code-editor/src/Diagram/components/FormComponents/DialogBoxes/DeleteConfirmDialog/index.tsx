/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from 'react';
import { useIntl } from 'react-intl';

import { Button, ClickAwayListener } from "@material-ui/core";

import { DiagramOverlay, DiagramOverlayContainer, DiagramOverlayPosition } from '../../../Portals/Overlay/index';

import "./style.scss";

export interface DeleteConfirmDialogProps {
    position: DiagramOverlayPosition;
    message?: string;
    removeText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    isFunctionMember?: boolean;
    overlayId?: string;
}

export function DeleteConfirmDialog(props: DeleteConfirmDialogProps) {
    const intl = useIntl();
    const { position, onConfirm, onCancel, isFunctionMember = true, overlayId } = props;
    const { message = "Remove this logic block?" } = props;
    const removeButtonText = intl.formatMessage({
        id: "lowcode.develop.elements.deleteConfirmationDialog.removeButton.text",
        defaultMessage: "Remove"
    });
    const cancelButtonText = intl.formatMessage({
        id: "lowcode.develop.elements.deleteConfirmationDialog.cancelButton.text",
        defaultMessage: "Cancel"
    });

    const handleOnConfirm = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        onConfirm();
    }

    const handleOnCancel = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        onCancel();
    }

    const handleDivClick = (evt: React.MouseEvent) => {
        evt.stopPropagation();
    }

    return (
        <ClickAwayListener
            mouseEvent="onMouseDown"
            touchEvent="onTouchStart"
            onClickAway={onCancel}
        >
            <div onClick={handleDivClick} >
                <DiagramOverlayContainer
                    divId={isFunctionMember ? overlayId : 'canvas-overlay'}
                >
                    <DiagramOverlay
                        className="delete-container"
                        position={position}
                    >
                        <p>{message}</p>
                        <div className={'action-button-container'}>
                            <Button
                                variant="contained"
                                className="cancelbtn"
                                onClick={handleOnCancel}
                            >
                                {cancelButtonText}
                            </Button>
                            <Button
                                data-testid="delete-logic-block-btn"
                                variant="contained"
                                className="deletebtn"
                                onClick={handleOnConfirm}
                            >
                                {removeButtonText}
                            </Button>
                        </div>
                    </DiagramOverlay>
                </DiagramOverlayContainer>
            </div>
        </ClickAwayListener>

    );
}
