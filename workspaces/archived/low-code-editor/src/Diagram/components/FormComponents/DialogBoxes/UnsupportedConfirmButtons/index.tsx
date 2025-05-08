/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import * as React from "react";

import { Button } from "@material-ui/core";

import { OverlayBackground } from "../../../OverlayBackground";
import { DiagramOverlayContainer } from "../../../Portals/Overlay";

import "./style.scss";

export interface UnsupportedConfirmButtonsProps {
    onConfirm?: () => void,
    onCancel?: () => void
}

export function UnsupportedConfirmButtons(props: UnsupportedConfirmButtonsProps) {
    const { onConfirm, onCancel } = props;

    const handleOnConfirm = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        onConfirm();
    }

    const handleOnCancel = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        onCancel();
    }

    return (
        <DiagramOverlayContainer>
            <div className="container-wrapper">
                <div className="confirm-container" >
                    <p>Diagram editing for this is unsupported. Move to code?</p>
                    <div className={'action-button-container'}>
                        <Button variant="contained" className="cancelbtn" onClick={handleOnCancel}>No</Button>
                        <Button variant="contained" className="confirmbtn" onClick={handleOnConfirm}>Yes</Button>
                    </div>
                </div>
            </div>
            <OverlayBackground />
        </DiagramOverlayContainer>
    );
}
