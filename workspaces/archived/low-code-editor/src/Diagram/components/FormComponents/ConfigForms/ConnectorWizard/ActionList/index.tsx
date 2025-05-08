/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-wrap-multiline
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { Box, FormControl, Input, InputAdornment, List, ListItem, Typography } from "@material-ui/core";
import { FunctionDefinitionInfo } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";

import SearchIcon from "../../../../../../assets/icons/SearchIcon";
import { TextPreLoader } from "../../../../../../PreLoader/TextPreLoader";
import { FormGeneratorProps } from "../../../FormGenerator";
import { wizardStyles as useFormStyles } from "../../style";
import useStyles from "../style";

import { ActionCard } from "./ActionCard";

interface ActionListProps {
    actions: FunctionDefinitionInfo[];
    onSelect: (action: FunctionDefinitionInfo) => void;
    isHttp: boolean;
}

export function ActionList(props: FormGeneratorProps) {
    const classes = useStyles();
    const formClasses = useFormStyles();

    const { onCancel, onBack, configOverlayFormStatus } = props;
    const { isLoading, formArgs } = configOverlayFormStatus;
    const { actions, isHttp, onSelect } = formArgs as ActionListProps;

    const [keyword, setKeyword] = useState("");
    const [filteredActions, setFilteredActions] = useState<FunctionDefinitionInfo[]>([]);

    useEffect(() => {
        const searchKeyword = keyword.toLowerCase().trim();
        if (searchKeyword.length > 1 && searchKeyword !== "") {
            const filter = actions.filter((action) => {
                if (
                    action.name.toLowerCase().indexOf(searchKeyword) > -1 ||
                    action.displayAnnotation?.label?.toLowerCase().toLowerCase().indexOf(searchKeyword) > -1
                ) {
                    return action;
                }
            });
            setFilteredActions(filter);
        } else {
            setFilteredActions(actions);
        }
    }, [actions, keyword]);

    const supportedActions = filteredActions?.filter((action) => {
        if (action.name === "init") {
            return false;
        }
        if (!(action.isRemote || action.qualifiers?.includes("remote") || action.qualifiers?.includes("resource"))) {
            return false; // Skip non-remote actions and non-resource actions
        }
        if (isHttp && action.qualifiers?.includes("resource")) {
            return false; // Skip resource actions from http connector to avoid listing duplicate actions
        }
        return true;
    });

    const actionElementList = supportedActions?.map((action) => {
        return <ActionCard key={action.name} action={action} onSelect={onSelect} />;
    });

    const handleActionSearch = (e: any) => {
        setKeyword(e.target.value);
    };

    const handleOnBack = () => {
        onBack();
    };

    return (
        <FormControl data-testid="action-list-form" className={formClasses.wizardFormControl}>
            <FormHeaderSection
                onCancel={onCancel}
                onBack={handleOnBack}
                formTitle={"lowcode.develop.configForms.actionList.title"}
                defaultMessage={"Action"}
            />
            <div className={formClasses.formWrapper}>
                <div className={formClasses.formFeilds}>
                    <div className={classes.container}>
                        {isLoading && (
                            <Box data-testid="action-list-loader" display="flex" justifyContent="center">
                                <TextPreLoader position="absolute" text="Fetching actions..." />
                            </Box>
                        )}
                        {!isLoading && (
                            <FormControl style={{ width: "inherit" }}>
                                <Input
                                    className={classes.searchBox}
                                    value={keyword}
                                    autoFocus={true}
                                    placeholder={`Search actions`}
                                    onChange={handleActionSearch}
                                    endAdornment={
                                        <InputAdornment position={"end"} style={{ padding: "8.5px" }}>
                                            <SearchIcon />
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        )}
                        {!isLoading && supportedActions?.length > 0 && (
                            <>
                                <Typography>
                                    <FormattedMessage id="lowcode.develop.configForms.actionList.subtitle" defaultMessage="Select an action" />
                                </Typography>
                                <div data-testid="action-list" className={classes.actionList}>
                                    <List>{actionElementList}</List>
                                </div>
                            </>
                        )}
                        {!isLoading && supportedActions?.length === 0 && (
                            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                                <Typography className={classes.hint}>
                                    <FormattedMessage
                                        id="lowcode.develop.configForms.actionList.notSupported"
                                        defaultMessage="Sorry. We currently support `remote` and `resource` actions only."
                                    />
                                </Typography>
                            </Box>
                        )}
                        {!isLoading && (filteredActions?.length === 0 || !actions) && (
                            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                                <Typography className={classes.hint}>
                                    <FormattedMessage id="lowcode.develop.configForms.actionList.empty" defaultMessage="No actions found" />
                                </Typography>
                            </Box>
                        )}
                    </div>
                </div>
            </div>
        </FormControl>
    );
}
