/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { ArrowBackRounded } from "@material-ui/icons";

import { ButtonWithIcon } from "../../../buttons/ButtonWithIcon";

interface BackButtonProps {
    onBack: () => void;
}

export function BackButton(props: BackButtonProps) {
    const { onBack } = props;
    return (
        <div className="close-btn-wrap">
            <ButtonWithIcon
                className="panel-back-button"
                onClick={onBack}
                icon={<ArrowBackRounded />}
            />
        </div>
    );
}
