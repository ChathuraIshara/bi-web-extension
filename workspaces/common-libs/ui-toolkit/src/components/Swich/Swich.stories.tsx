/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { Switch } from "./Swich";
import { Codicon } from "../Codicon/Codicon";

const checkedIcon = <Codicon name="star-full"/>;
const unCheckedIcon = <Codicon name="star-empty"/>;

const SwichWithIcon = () => {
    const [checked, unChecked] = useState(false);
    const toggleSelection = () => {
        unChecked(!checked);
    };
    return (
        <>
            <Switch leftLabel="OFF" rightLabel="ON" checked={checked} checkedIcon={checkedIcon} uncheckedIcon={unCheckedIcon} onChange={toggleSelection}/>
        </>
    );
};
storiesOf("Swich").add("Swich With Icon", () => <SwichWithIcon />);

const TransitionEnabledSwichWithIcon = () => {
    const [checked, unChecked] = useState(false);
    const toggleSelection = () => {
        unChecked(!checked);
    };
    return (
        <>
            <Switch leftLabel="OFF" rightLabel="ON" checked={checked} checkedIcon={checkedIcon} uncheckedIcon={unCheckedIcon} enableTransition onChange={toggleSelection}/>
        </>
    );
};
storiesOf("Swich").add("Transition Enabled Swich With Icon", () => <TransitionEnabledSwichWithIcon />);

const SwichWithoutIcon = () => {
    const [checked, unChecked] = useState(false);
    const toggleSelection = () => {
        unChecked(!checked);
    };
    return (
        <>
            <Switch leftLabel="OFF" rightLabel="ON" checked={checked} onChange={toggleSelection}/>
        </>
    );
};
storiesOf("Swich").add("Swich Without Icon", () => <SwichWithoutIcon />);

const SwichWithDifferentColor = () => {
    const [checked, unChecked] = useState(false);
    const toggleSelection = () => {
        unChecked(!checked);
    };
    return (
        <>
            <Switch leftLabel="OFF" rightLabel="ON" checked={checked} checkedColor="var(--vscode-button-background)" onChange={toggleSelection}/>
        </>
    );
};
storiesOf("Swich").add("Swich With Different Color", () => <SwichWithDifferentColor />);

const SwichWithDifferentColorWithIcon = () => {
    const [checked, unChecked] = useState(false);
    const toggleSelection = () => {
        unChecked(!checked);
    };
    return (
        <>
            <Switch leftLabel="OFF" rightLabel="ON" checked={checked} checkedColor="var(--vscode-button-background)" checkedIcon={checkedIcon} uncheckedIcon={unCheckedIcon} onChange={toggleSelection}/>
        </>
    );
};
storiesOf("Swich").add("Swich With Different Color With Icon", () => <SwichWithDifferentColorWithIcon />);
