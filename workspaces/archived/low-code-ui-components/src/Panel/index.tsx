/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useState } from "react";

import classnames from 'classnames';

import { OverlayBackground } from "../OverlayBackground";
import { DiagramOverlayContainer } from "../Portals/Overlay";

import "./style.scss";

interface PanelProps {
    children: JSX.Element,
    onClose: () => void;
}

export function Panel(props: PanelProps) {
    const { children, onClose } = props;
    const [isVisible, setIsVisible] = useState(true);

    const onCloseEvent = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        setIsVisible(false);
        setTimeout(onClose, 500)
    }

    const onDivClick = (evt: React.MouseEvent) => {
        evt.stopPropagation();
    }

    return (
        <div onClick={onDivClick} >
            <DiagramOverlayContainer forceRender={true}>
                <div className={classnames("panel", isVisible ? 'panel-slide-in' : 'panel-slide-out')}>
                    <div className="panel-form-wrapper">
                        {children}
                    </div>
                </div>
                <OverlayBackground />
            </DiagramOverlayContainer>
        </div>
    );
}
