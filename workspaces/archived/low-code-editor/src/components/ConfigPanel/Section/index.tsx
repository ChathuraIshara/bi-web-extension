/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import { Grid, Typography } from "@material-ui/core";
import { TooltipIcon } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";

import { useStyles } from "./styles";

export default function ConfigPanelSection(props: any) {
    const classes = useStyles();
    const { title, tooltip, children, tooltipWithExample, tooltipWithListView, button } = props;

    const switchBtn = (
        <div className={classes.switch}>
            {button}
        </div>
    )

    return (
        <div className={classes.sectionWrapper}>
            <Grid container={true} spacing={1}>
                    <Grid item={true} xs={12}>
                        {!!tooltipWithListView ? (
                            <TooltipIcon
                                title={tooltipWithListView.title}
                                placement="left"
                                arrow={true}
                            >
                                <div className={classes.titleContent}>
                                    <p className={classes.sectionTitle}>{title}</p>
                                    {button && switchBtn}
                                </div>
                            </TooltipIcon>

                        ) : (!!tooltipWithExample) ? (
                            <TooltipIcon
                                title={tooltipWithExample.title}
                                placement="left"
                                arrow={true}
                                codeSnippet={true}
                                example={true}
                                content={tooltipWithExample.content}
                            >
                                <div className={classes.titleContent}>
                                    <p className={classes.sectionTitle}>{title}</p>
                                    {button && switchBtn}
                                </div>
                            </TooltipIcon>

                        ) : (!!tooltip?.title || !!tooltip) ? (
                            <TooltipIcon
                                title={tooltip?.title || tooltip}
                                placement="left"
                                arrow={true}
                            >
                                <div className={classes.titleContent}>
                                    <p className={classes.sectionTitle}>{title}</p>
                                    {button && switchBtn}
                                </div>
                            </TooltipIcon>
                        ) : (
                            <div className={classes.titleContent}>
                                <p className={classes.sectionTitle}>{title}</p>
                                {button && switchBtn}
                            </div>
                        )
                        }
                    </Grid>
            </Grid>
            {children}
        </div>
    );
}
