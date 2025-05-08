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

import { ParamEditButton } from '@wso2-enterprise/ballerina-low-code-edtior-commons';
import { CheckBoxGroup } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";

import { recordStyles } from "../style";
import { RecordItemModel } from "../types";

interface ParamItemProps {
    record: RecordItemModel;
    onEditClick: (param: string) => void;
    handleOnCheck: () => void;
}

export function RecordItem(props: ParamItemProps) {
    const { record, onEditClick, handleOnCheck } = props;
    const recordClasses = recordStyles();

    const handleEdit = () => {
        onEditClick(record.name);
    };

    const handleCheckboxClick = (list: string[]) => {
        record.checked = list.length > 0;
        handleOnCheck();
    };

    return (
        <div className={recordClasses.headerWrapper} data-testid={`${record.name}-item`}>
            <div className={recordClasses.contentSection} >
                <CheckBoxGroup
                    values={[record.name]}
                    defaultValues={record.checked ? [record.name] : []}
                    onChange={handleCheckboxClick}
                />
            </div>
            <div className={recordClasses.iconSection}>
                <div className={recordClasses.editIconWrapper}>
                    <ParamEditButton onClick={handleEdit} />
                </div>
            </div>
        </div>
    );
}
