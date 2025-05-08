/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { useStyles } from "./style";

interface FormAccordionProps {
    title?: string;
    depth?: number;
    mandatoryFields?: React.ReactNode[];
    optionalFields?: React.ReactNode[];
    isMandatory?: boolean;
    expandOptionals?: boolean;
}

export default function FormAccordion(props: FormAccordionProps) {
    const { title, depth, mandatoryFields, optionalFields, expandOptionals } = props;
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState<string | false>(expandOptionals ? "optional" : "mandatory");

    const isMandatoryFieldsExist = mandatoryFields?.length > 0;
    const isOptionalFieldsExist = optionalFields?.length > 0;

    const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className={classes.accordionWrapper}>
            {isMandatoryFieldsExist && (
                <ExpansionPanel
                    TransitionProps={{ mountOnEnter: true }}
                    className={depth > 1 ? classes.accordionRoot : classes.accordionRootFirst}
                    defaultExpanded={true}
                    data-testid={title}
                >
                    {title && (
                        <ExpansionPanelSummary
                            className={depth > 1 ? classes.accordionSummary : classes.accordionSummaryFirst}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography className={classes.accordionHeading}>{title}</Typography>
                            <Typography className={classes.accordionSecondaryRedHeading}>*</Typography>
                        </ExpansionPanelSummary>
                    )}
                    <ExpansionPanelDetails
                        className={depth > 1 ? classes.accordionDetails : classes.accordionDetailsFirst}
                    >
                        <div className={classes.groupedForm}>{mandatoryFields}</div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )}
            {isOptionalFieldsExist && (
                <ExpansionPanel
                    TransitionProps={{ mountOnEnter: true }}
                    className={depth > 1 ? classes.accordionRoot : classes.accordionRootFirst}
                    expanded={expanded === "optional"}
                    onChange={handleChange("optional")}
                    data-testid={title}
                >
                    <ExpansionPanelSummary
                        className={depth > 1 ? classes.accordionSummary : classes.accordionSummaryFirst}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        {(isMandatoryFieldsExist || !title) && (
                            <Typography className={classes.accordionSecondaryHeading}>Defaultable Parameters</Typography>
                        )}
                        {!isMandatoryFieldsExist && title && (
                            <Typography className={classes.accordionHeading}>{title}</Typography>
                        )}
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails
                        className={depth > 1 ? classes.accordionDetails : classes.accordionDetailsFirst}
                    >
                        <div className={classes.groupedForm}>{optionalFields}</div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )}
        </div>
    );
}
