/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";
import { storiesOf } from "@storybook/react";

import { ContextMenu } from "./ContextMenu";
import styled from "@emotion/styled";

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ComponentStory = () => {

    return (
        <ContextMenu menuItems={[{id: "", label: <>Test Item</>, onClick: () => {console.log("Item Selected")}}]}/>
    );
};

storiesOf("Context Menu").add("Horizontal Menu", () => <ComponentStory />);

const verticalIconStyles = {
    transform: "rotate(90deg)",
    ":hover": {
        backgroundColor: "var(--vscode-welcomePage-tileHoverBackground)",
    }
}

const VericleMenu = () => {

    return (
        <ContextMenu iconSx={verticalIconStyles} menuItems={[{id: "", label: <>Test Item</>, onClick: () => {console.log("Item Selected")}}]}/>
    );
};

storiesOf("Context Menu").add("Verticle Menu", () => <VericleMenu />);

const rounderIconStyles = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    transform: "rotate(90deg)",
    border: "1px solid var(--vscode-dropdown-border)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
}
const VericleMenuWithCircularBorder = () => {

    return (
        <ContextMenu iconSx={rounderIconStyles} menuItems={[{id: "", label: <>Test Item</>, onClick: () => {console.log("Item Selected")}}]}/>
    );
};

storiesOf("Context Menu").add("Vericle Menu With Circular Border", () => <VericleMenuWithCircularBorder />);

const ContextMenuPosition = () => {

    return (
        <Container>
            <ContextMenu iconSx={verticalIconStyles} position="bottom-left" menuItems={[{id: "1", label: <>Test Item 1</>, onClick: () => {console.log("Item 1 Selected")}}, {id: "2", label: <>Test Item 2</>, onClick: () => {console.log("Item 2 Selected")}}]}/>
        </Container>
    );
};

storiesOf("Context Menu").add("Context Menu Position", () => <ContextMenuPosition />);

const VericleSubMenu = () => {
    return (
        <ContextMenu 
            iconSx={verticalIconStyles}
            menuItems={[{
                id: "",
                label: <>Test Item 1</>,
                onClick: () => {}, // Add this line
                sunMenuItems: [{
                    id: "",
                    label: <>Sub Menu Item 1</>,
                    onClick: () => {console.log("Sub Menu Item 1 Selected")}
                }, {
                    id: "",
                    label: <>Sub Menu Item 2</>,
                    onClick: () => {console.log("Sub Menu Item 2 Selected")}
                }
                ]
            },
            {id: "", label: <>Test Item 2</>, onClick: () => {console.log("Item Selected")}},
            {id: "", label: <>Test Item 3</>, onClick: () => {console.log("Item Selected")}}
            ]}
        />
    );
};

storiesOf("Context Menu").add("Verticle Sub Menu", () => <VericleSubMenu />);
