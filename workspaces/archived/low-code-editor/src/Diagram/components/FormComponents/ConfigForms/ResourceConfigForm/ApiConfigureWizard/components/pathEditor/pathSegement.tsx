/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { CloseRounded } from "@material-ui/icons";
import { ButtonWithIcon } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";

import { PathSegment } from "../../types";

import { useStyles } from './style';

interface PathSegmentProps {
    segment: PathSegment;
    addInProgress: boolean;
    onDelete?: (segment: PathSegment) => void;
    onEditClick?: (segment: PathSegment) => void;
}

export function PathSegmentItem(props: PathSegmentProps) {
    const { segment, onDelete,  onEditClick, addInProgress } = props;
    const classes = useStyles();

    const segmentLabel = segment.isParam ? "[" + segment.type + " " + segment.name + "]" : segment.name;
    const handleDelete = () => {
        onDelete(segment);
    };
    const handleEdit = () => {
        onEditClick(segment);
    };

    return (
        <div className={classes.headerWrapper} data-testid={`${segmentLabel}-item`}>
            <div className={addInProgress ? classes.headerLabel : classes.headerLabelWithCursor} onClick={handleEdit}>
                {segmentLabel}
                <ButtonWithIcon
                    onClick={handleDelete}
                    icon={<CloseRounded data-testid={`${segmentLabel}-close-btn`} fontSize="small" />}
                    className={classes.iconBtn}
                />
            </div>
        </div>
    );
}
