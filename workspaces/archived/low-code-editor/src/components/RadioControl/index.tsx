/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js no-empty jsx-curly-spacing
import React from "react";

import classNames from "classnames";

import "./style.scss"
import { useStyles } from "./styles";

export default function RadioControl(props: any) {
    const classes = useStyles();
    const { options, selectedValue, onSelect } = props;

    const renderCtrlItem = (opt: string) => {
        const handleOnSelect = () => onSelect(opt)

        return (
            <button
                key={opt}
                className={classNames(classes.radioBtn, selectedValue === opt ? classNames(classes.radioSelected, "selected" + opt) : "")}
                onClick={handleOnSelect}
            >
                {opt}
            </button>
        );
    }

    return (
        <div className={classes.radioBtnWrapper}>
            {options.map(renderCtrlItem)}
        </div>
    );
}
