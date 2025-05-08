/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect } from "react";

import { Checkbox, ClickAwayListener, FormControlLabel } from "@material-ui/core";

interface FilterProps {
    filterMap: any;
    updateFilterMap: (map: any) => void;
    handleFilterClose: () => void;
}

export function Filter(props: FilterProps) {
    const { filterMap, updateFilterMap, handleFilterClose } = props;
    const selectors: React.ReactElement[] = [];

    Object.keys(filterMap).forEach(key => {
        const handleOnToggle = (evt: any) => {
            evt.stopPropagation();
            filterMap[key] = !filterMap[key];
            updateFilterMap({ ...filterMap });
        }
        selectors.push(
            <FormControlLabel
                control={<Checkbox checked={filterMap[key]} onChange={handleOnToggle} />}
                label={key}
            />
        );
    })
    // filterMap.forEach(filter => {
    //     selectors.push(
    //         <input type="checkbox" id="vehicle1" name="vehicle1" value={filter.name} />
    //     );
    // })

    return (
        <ClickAwayListener
            mouseEvent="onMouseDown"
            touchEvent="onTouchStart"
            onClickAway={handleFilterClose}
        >
            <div>
                {selectors}
            </div>
        </ClickAwayListener>
    )
}

