/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";

import { Tooltip, Typography } from "@wso2-enterprise/ui-toolkit";

import { acceptedCompletionKindForTypes } from "../../../../constants";
import { SuggestionItem } from "../../../../models/definitions";
import { getSuggestionIconStyle } from "../../../../utils";
import { useStmtEditorHelperPanelStyles } from "../../../styles";

export interface SuggestionListItemProps {
    key: number;
    suggestion: SuggestionItem;
    isReference: boolean
}

export function SuggestionListItem(props: SuggestionListItemProps) {
    const { key, suggestion, isReference } = props;
    const stmtEditorHelperClasses = useStmtEditorHelperPanelStyles();
    const { SuggestIcon, color } = getSuggestionIconStyle(suggestion.completionKind, isReference);

    const simplifyValue = (text: string) => {
        const splittedText = text.split(".");
        const prefix = splittedText[0].length > 3 ? splittedText[0].slice(0, 3) : splittedText[0];
        if (splittedText.length === 2) {
            return prefix + "." + splittedText[1];
        } else if (splittedText.length > 2) {
            return prefix + "..." + splittedText[splittedText.length - 1];
        } else {
            return text;
        }
    }

    return (
        <Tooltip
            content={suggestion.value}
            position="bottom-end"
        >
            <div className={stmtEditorHelperClasses.suggestionListItem}>
                <SuggestIcon style={{ color, margin: '2px 2px 0 0' }} />
                <div className={stmtEditorHelperClasses.listItem}>
                    <Typography
                        variant="body3"
                        className={stmtEditorHelperClasses.suggestionValue}
                        data-testid="suggestion-value"
                    >
                        {isReference ? simplifyValue(suggestion.value) : suggestion.value}
                    </Typography>
                    {!acceptedCompletionKindForTypes.includes(suggestion.completionKind) && (
                        <Typography
                            variant="body3"
                            sx={{ marginLeft: '4px' }}
                            className={stmtEditorHelperClasses.suggestionDataType}
                        >
                            {suggestion.kind}
                        </Typography>
                    )}
                </div>
            </div>
        </Tooltip>
    );
}
