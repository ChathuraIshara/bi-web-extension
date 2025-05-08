/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';
import styled from '@emotion/styled';
import { Typography } from '../../Typography/Typography';
import { VSCodeRadioGroup, VSCodeRadio, VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';
import { Button, FormContainer, TextField } from '../../..';
import { Header } from '../Header/Header';
import { VerticleIcons } from '../VerticleIcons/VerticleIcons';

export interface WebAppCreationProps {
    id?: string;
    className?: string;
    sx?: any;
}

const TopMarginTextWrapper = styled.div`
    font-size: 13px;
    margin-top: 10px;
`;

const BottomMarginTextWrapper = styled.div`
    font-size: 13px;
    margin-bottom: 10px;
`;

const ButtonWrapper = styled.div`
    margin-top: 20px;
    width: 50px;
`;

export const WebAppCreation = (props: WebAppCreationProps) => {
    const { id, className, sx } = props;

    const handleRadioButtonChange = (e: any) => {
        console.log(e.target.value);
    };

    const handleCheckboxChange = () => {
        console.log("checkbox changed");
    };

    return (
        <FormContainer id={id} className={className} sx={sx}>
            <Header/>
            <Typography variant="h1">New Web App</Typography>
            <Typography variant="h4" sx={{ marginTop: 0 }}>Build a web app using simple HTML/JS/CSS or the framework of your choice</Typography>
            <BottomMarginTextWrapper>Choose a tramework</BottomMarginTextWrapper>
            <VerticleIcons sx={{width: `100%`}} />
            <TopMarginTextWrapper>Language</TopMarginTextWrapper>
            <VSCodeRadioGroup value="typescript">
                <VSCodeRadio value="javascript" onClick={handleRadioButtonChange}>Javascript</VSCodeRadio>
                <VSCodeRadio value="typescript" onClick={handleRadioButtonChange}>Typescript</VSCodeRadio>
            </VSCodeRadioGroup>
            <TextField sx={{ marginTop: 10 }} value='' label="Project Name" placeholder="Enter a project name" />
            <TopMarginTextWrapper>Experiments</TopMarginTextWrapper>
            <VSCodeCheckbox checked={false} onChange={handleCheckboxChange}>
                Enable Nix for this workspace Learn
            </VSCodeCheckbox>
            <ButtonWrapper>
                <Button appearance="primary">Create</Button>
            </ButtonWrapper>
        </FormContainer>
    );
};
