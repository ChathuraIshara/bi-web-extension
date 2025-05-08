/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useState } from "react";
import { Meta, storiesOf } from "@storybook/react";
import { Drawer } from "./Drawer";
import { Button } from "../Button/Button";
import { SidePanel } from "../SidePanel/SidePanel";
import { SidePanelTitleContainer } from "../../styles";
import { Codicon } from "../Codicon/Codicon";
import { Breadcrumbs } from "../Breadcrumb/Breadcrumb";
import styled from "@emotion/styled";

export default {
    title: 'Components/Drawer',
    component: Drawer
} as Meta;

const DrawerContainer = styled.div`
    width: 300px;
`;

const drawersTitles = ["Drawer1", "Drawer2", "Drawer3"];

const DrawerDefault = () => {
    const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(true);
    const [openedIndex, setOpenedIndex] = useState<number>();

    const closeSidePanel = () => {
        setIsSidePanelOpen(false);
    }

    const openDrawer = (index: number) => {
        setOpenedIndex(index);
    }

    const closeDrawer = (index: number) => {
        if (index === 0) {
            setOpenedIndex(undefined);
        } else {
            setOpenedIndex(index - 1);
        }
    }

    return (
        <>
            <SidePanel
                isOpen={isSidePanelOpen}
                width={300}
            >
                {openedIndex !== undefined ? (
                    <Breadcrumbs>
                        {drawersTitles.slice(0, openedIndex + 1).map((element, index) => (
                            <div
                                key={element}
                                onClick={() => openDrawer(index)}
                            >
                                {element}
                            </div>
                        ))}
                    </Breadcrumbs>
                ) : null}
                <SidePanelTitleContainer>
                    <div>Side Panel Title</div>
                    <Button onClick={closeSidePanel} appearance="icon"><Codicon name="close" /></Button>
                </SidePanelTitleContainer>

                <Drawer
                    isOpen={openedIndex === 0}
                    id="drawer1"
                    width={300}
                    isSelected={true}
                    sx={{ width: 300 }}
                >
                    <DrawerContainer>
                        Drawer1 Content
                        <Button onClick={() => openDrawer(1)}>Add</Button>
                        <Button onClick={() => closeDrawer(0)}>Close</Button>
                    </DrawerContainer>
                </Drawer>
                <Drawer
                    isOpen={openedIndex === 1}
                    id="drawer2"
                    isSelected={true}
                >
                    <DrawerContainer>
                        Drawer2 Content
                        <Button onClick={() => openDrawer(2)}>Add</Button>
                        <Button onClick={() => closeDrawer(1)}>Close</Button>
                    </DrawerContainer>
                </Drawer>
                <Drawer
                    isOpen={openedIndex === 2}
                    id="drawer3"
                    isSelected={true}
                >
                    <DrawerContainer>
                        Drawer3 Content
                        <Button onClick={() => closeDrawer(2)}>Close</Button>
                    </DrawerContainer>
                </Drawer>
                <Button onClick={() => openDrawer(0)}>Add</Button>
            </SidePanel>
        </>
    );
};

storiesOf("Drawer").add("DrawerDefaullt", () => <DrawerDefault />, {
    layout: 'fullscreen'
});
