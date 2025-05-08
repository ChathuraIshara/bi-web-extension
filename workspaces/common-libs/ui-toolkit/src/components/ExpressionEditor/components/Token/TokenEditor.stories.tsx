/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState } from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { TokenEditor } from ".";

import { HELPER_PANE_HEIGHT } from "../../constants";
import styled from "@emotion/styled";
import { Button } from "../../../Button/Button";

/* Styles */
const HelperPane = styled.div`
    height: ${HELPER_PANE_HEIGHT}px;
    width: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--vscode-dropdown-border);
`;

const TokenEditorContainer = styled.div`
    width: 300px;
`;

/* Components */
const SampleHelperPane = ({ onChange }: { onChange: (value: string) => void }) => {
    return (
        <HelperPane>
            Helper Pane
            <Button appearance="secondary" onClick={() => onChange('Hello')}>
                Add token
            </Button>
        </HelperPane>
    );
}

export default {
    title: "Token Editor",
    component: TokenEditor,
} as ComponentMeta<typeof TokenEditor>;

export const Default: ComponentStory<typeof TokenEditor> = () => {
    const [value, setValue] = useState<string>('Hello ${world}');
    const [isHelperPaneOpen, setIsHelperPaneOpen] = useState<boolean>(false);

    const handleChange = (value: string) => {
        setValue(value);
        console.log(value);
    }

    return (
        <TokenEditorContainer>
            <TokenEditor
                value={value}
                onChange={handleChange}
                isHelperPaneOpen={isHelperPaneOpen}
                changeHelperPaneState={setIsHelperPaneOpen}
                getHelperPane={onChange => <SampleHelperPane onChange={onChange} />}
                helperPaneOrigin="right"
            />
        </TokenEditorContainer>
    );
};
