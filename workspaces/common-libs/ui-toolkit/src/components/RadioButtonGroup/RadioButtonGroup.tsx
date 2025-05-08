/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { ReactNode, ComponentProps } from "react";
import "@wso2-enterprise/font-wso2-vscode/dist/wso2-vscode.css";

import styled from "@emotion/styled";

import { VSCodeRadioGroup, VSCodeRadio } from "@vscode/webview-ui-toolkit/react";

interface RadioButtonContainerProps {
    sx?: any;
}

interface OptionProps {
    id?: string;
    content?: string | ReactNode;
    value: any;
}

const RadioButtonContainer = styled.div<RadioButtonContainerProps>`
    ${(props: RadioButtonContainerProps) => props.sx};
`;

export interface RadioButtonGroupProps extends ComponentProps<"input"> {
    id?: string;
    className?: string;
	label?: string;
    sx?: any;
    options?: OptionProps[];
    orientation?: "vertical" | "horizontal";
}

export const RadioButtonGroup = React.forwardRef<HTMLInputElement, RadioButtonGroupProps>((props, ref) => {
    const { id, className, label, options, orientation, sx, ...rest } = props;

    return (
        <RadioButtonContainer id={id} className={className} sx={sx} {...rest} >
            <div style={{color: "var(--vscode-editor-foreground	)"}}>
                <label htmlFor={`${id}-label`}>{label}</label>
            </div>
            <VSCodeRadioGroup
                ref={ref}
                orientation={orientation}
                {...rest}
            >
                {options.map((option, index) => (
                    <VSCodeRadio
                        key={index}
                        id={option.id}
                        value={option.value}
                    >
                        {option.content}
                    </VSCodeRadio>
                ))}
            </VSCodeRadioGroup>
        </RadioButtonContainer>
    );
});
RadioButtonGroup.displayName = "RadioButtonGroup";
