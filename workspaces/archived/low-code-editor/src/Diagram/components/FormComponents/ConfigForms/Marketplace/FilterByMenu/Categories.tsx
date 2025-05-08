/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
// tslint:disable: jsx-no-lambda
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button, Typography } from '@material-ui/core';
import { ChevronRight, ExpandLess, ExpandMore } from '@material-ui/icons';
import { TreeItem, TreeView } from '@material-ui/lab';

import menuItems from './menuItems.json';
import useStyles from './style';

const { connectorCategories } = menuItems;

export interface CategoriesProps {
    selectedCategory: string;
    setCategory: (category: string) => void;
}

function Categories(props: CategoriesProps) {
    const classes = useStyles();
    const { selectedCategory, setCategory } = props;

    const [ noOfCategoriesDisplayed, setNoOfCategoriesDisplayed ] = useState(10);
    const defaultExpanded = [ "" ];

    const onSeeMoreClick = () => {
        setNoOfCategoriesDisplayed(noOfCategoriesDisplayed + 10);
    };

    const onSeeLessClick = () => {
        setNoOfCategoriesDisplayed(10);
    };

    const onLabelClick = (selectedNode: string) => {
        if (selectedCategory !== selectedNode) {
            setCategory(selectedNode);
        }
    };

    const getLabel = (text: string, styleClass?: any) => {
        return (
            <Typography
                variant="body1"
                classes={styleClass ? styleClass : { root: classes.expandaleFilterByLabel }}
            >
                {text}
            </Typography>
        );
    };

    return (
        <>
            <TreeItem
                nodeId={connectorCategories.name}
                classes={ {
                    content: classes.content,
                    selected: classes.selectedItem,
                    label: classes.labelItem,
                } }
                label={getLabel(connectorCategories.name)}
            >
                <TreeView
                    key={connectorCategories.name}
                    defaultCollapseIcon={<ExpandMore />}
                    defaultExpandIcon={<ChevronRight />}
                    className={classes.categoriesRoot}
                    selected={selectedCategory || ''}
                    defaultExpanded={defaultExpanded}
                >
                    { connectorCategories.categories
                        .slice(0, noOfCategoriesDisplayed)
                        .map((menuItem) => (
                            <TreeItem
                                key={menuItem.name}
                                nodeId={menuItem.name}
                                classes={ {
                                    content: classes.content,
                                    group: classes.groupItem,
                                    label: classes.labelItem,
                                } }
                                label={getLabel(menuItem.name)}
                                onLabelClick={() => onLabelClick(menuItem.name)}
                            >
                                { menuItem.children.map((subCategory) => (
                                    <TreeItem
                                        key={subCategory.name}
                                        nodeId={subCategory.value}
                                        classes={ {
                                            content: classes.content,
                                            group: classes.groupItem,
                                            selected: classes.selectedValue,
                                            label: classes.labelItem,
                                        } }
                                        label={getLabel(subCategory.name, classes.filterCategories)}
                                        onLabelClick={() => onLabelClick(subCategory.value)}
                                    />
                                )) }
                            </TreeItem>
                        )) }
                </TreeView>
                { connectorCategories.categories.length > noOfCategoriesDisplayed ? (
                    <Button
                        onClick={onSeeMoreClick}
                        className={classes.seeMoreButton}
                        color="primary"
                        size="small"
                        startIcon={<ExpandMore />}
                    >
                        <FormattedMessage
                            id="lowcode.develop.configForms.connectorList.FilterByMenu.FilterByMenu.Categories.SeeMore"
                            defaultMessage="See More"
                        />
                    </Button>
                ) : (
                    <Button
                        onClick={onSeeLessClick}
                        className={classes.seeMoreButton}
                        color="primary"
                        size="small"
                        startIcon={<ExpandLess />}
                    >
                        <FormattedMessage
                            id="lowcode.develop.configForms.connectorList.FilterByMenu.FilterByMenu.Categories.SeeLess"
                            defaultMessage="See Less"
                        />
                    </Button>
                ) }
            </TreeItem>
        </>
    );


}

export default Categories;
