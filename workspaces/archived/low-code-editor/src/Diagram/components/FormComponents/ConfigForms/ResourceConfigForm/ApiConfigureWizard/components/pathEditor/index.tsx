/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import { NodePosition, STNode } from "@wso2-enterprise/syntax-tree";

import { AddIcon } from "../../../../../../../../assets/icons";
import { keywords } from "../../../../../../Portals/utils/constants";
import { Path, PathSegment } from "../../types";
import { convertPathStringToSegments, genrateBallerinaResourcePath, recalculateItemIds } from "../../util";

import { PathSegmentItem } from "./pathSegement";
import { PathSegmentEditor } from "./segmentEditor";
import { useStyles } from './style';

interface PathEditorProps {
    pathString: string;
    defaultValue?: string;
    onChange?: (text: string) => void;
    targetPosition?: NodePosition;
}

export function PathEditor(props: PathEditorProps) {
    const { pathString, onChange, targetPosition } = props;
    const path: Path = convertPathStringToSegments(pathString);
    const classes = useStyles();

    const [pathState, setPathState] = useState<Path>(path);
    const [addingSegment, setAddingSegment] = useState<boolean>(false);
    // editingSegmentId > -1 when editing
    const [editingSegmentId, setEditingSegmentId] = useState<number>(-1);

    const onDelete = (segment: PathSegment) => {
        const id = segment.id;
        if (id > -1) {
            const pathClone: Path = {
                segments: pathState.segments
            };
            pathClone.segments.splice(id, 1);
            recalculateItemIds(pathClone.segments);
            setPathState(pathClone);
            if (onChange) {
                onChange(genrateBallerinaResourcePath(pathClone));
            }
        }
    };

    const onEdit = (segment: PathSegment) => {
        const id = pathState.segments.indexOf(segment);
        // Once edit is clicked
        if (id > -1) {
            setEditingSegmentId(id);
        }
        setAddingSegment(false);
    };

    const onSave = (pathSegment: PathSegment) => {
        if (keywords.includes(pathSegment.name)) {
            pathSegment.name = "'" + pathSegment.name;
        }
        pathState.segments.push(pathSegment);
        setPathState(pathState);
        setAddingSegment(false);
        setEditingSegmentId(-1);
        if (onChange) {
            onChange(genrateBallerinaResourcePath(pathState));
        }
    };

    const onUpdateSegment = (pathSegment: PathSegment) => {
        const id = pathSegment.id;
        if (id > -1) {
            pathState.segments[id] = pathSegment;
            setPathState(pathState);
        }
        setAddingSegment(false);
        setEditingSegmentId(-1);
        if (onChange) {
            onChange(genrateBallerinaResourcePath(pathState));
        }
    };

    const onCancel = () => {
        setAddingSegment(false);
        setEditingSegmentId(-1);
    };

    const pathSegments: React.ReactElement[] = [];
    pathState.segments.forEach((value, index) => {
        if (value.name) {
            if (editingSegmentId !== index) {
                pathSegments.push(
                    <PathSegmentItem
                        segment={value}
                        onDelete={onDelete}
                        onEditClick={onEdit}
                        addInProgress={addingSegment}
                    />
                );
            } else if (editingSegmentId === index) {
                pathSegments.push(
                    <PathSegmentEditor
                        id={editingSegmentId}
                        segment={value}
                        onCancel={onCancel}
                        onUpdate={onUpdateSegment}
                    />
                );

            }
        }
    });

    const addPathBtn = () => {
        setAddingSegment(true);
    }

    const pathSegmentEditor = (
        <div>
            <PathSegmentEditor
                id={pathState.segments.length}
                onCancel={onCancel}
                onSave={onSave}
                targetPosition={targetPosition}
            />
        </div>
    );

    const addPathBtnUI = (
        <div>
            <button
                onClick={addPathBtn}
                className={classes.addPathBtn}
            >
                <div className={classes.addPathBtnWrap}>
                    <AddIcon data-testid="add-path-param-button"/>
                    <p><FormattedMessage id="lowcode.develop.apiConfigWizard.addPathSegment.title" defaultMessage="Add Path Segment" /></p>
                </div>
            </button>
        </div>
    );

    return (
        <div>
            <div id="listOfPaths" >
                {pathSegments}
            </div>
            {addingSegment && pathSegmentEditor}
            {!addingSegment && (editingSegmentId === -1) && addPathBtnUI}
        </div>
    );
}
