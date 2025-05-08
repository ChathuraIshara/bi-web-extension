import React from "react";
import { Story, Meta } from "@storybook/react";
import SidePanelList, { SidePanelListProps } from "../components/sidePanel";

export default {
    title: "SidePanel/Main",
    component: SidePanelList,
} as Meta;

const Template: Story<SidePanelListProps> = (args: React.JSX.IntrinsicAttributes & SidePanelListProps) => <SidePanelList {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    nodePosition: {},
    documentUri: ""
};
