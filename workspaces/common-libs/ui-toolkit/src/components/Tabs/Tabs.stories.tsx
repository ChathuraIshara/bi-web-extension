/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from 'react';
import { Tabs } from './Tabs';
import { useState } from 'react';
import { Button } from '../Button/Button';
import { Codicon } from '../Codicon/Codicon';
import { storiesOf } from '@storybook/react';

const ViewSelectorStory = () => {
    const [selectedId, setSelectedId] = useState<string | null>("1");
    const handleClick = (id: string) => {
        setSelectedId(id);
    };

    return (
        <Tabs
            views={[
                { id: '1', name: 'View 1' },
                { id: '2', name: 'View 2' },
                { id: '3', name: 'View 3' },
            ]}
            currentViewId={selectedId}
            onViewChange={handleClick}
        >
            <div id="1">Hello View 1</div>
            <div id="2">Hello View 2</div>
            <div id="3">Hello View 3</div>
        </Tabs>
    );
};
storiesOf("Tabs").add("View SelectorStory", () => <ViewSelectorStory />);
//     const handleClick = (id: string) => {
//         setSelectedId(id);
//     };

//     return (
//         <Tabs
//             views={[
//                 { id: '1', name: 'View 1' },
//                 { id: '2', name: 'View 2' },
//                 { id: '3', name: 'View 3' },
//             ]}
//             currentViewId={selectedId}
//             onViewChange={handleClick}
//         >
//             <div id="1">Hello View 1</div>
//             <div id="2">Hello View 2</div>
//             <div id="3">Hello View 3</div>
//         </Tabs>
//     );
// };

export const ViewSelectorStoryWithMoreOptions = () => {
    const [selectedId, setSelectedId] = useState<string | null>("1");
    const handleClick = (id: string) => {
        setSelectedId(id);
    };

    return (
        <Tabs
            views={[
                { id: '1', name: 'View 1', 
                    moreOptions: 
    <Button buttonSx={{height: 15, marginLeft: 4, color: "var(--vscode-focusBorder)"}} appearance='icon'> 
        <Codicon name='ellipsis'/>
    </Button>
                },
                { id: '2', name: 'View 2' },
                { id: '3', name: 'View 3' },
            ]}
            currentViewId={selectedId}
            onViewChange={handleClick}
        >
            <div id="1">Hello View 1</div>
            <div id="2">Hello View 2</div>
            <div id="3">Hello View 3</div>
        </Tabs>
    );
};

storiesOf("Tabs").add("View SelectorStory With MoreOptions", () => <ViewSelectorStory />);
