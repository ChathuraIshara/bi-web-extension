/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Tabs, Typography, ViewItem } from '@wso2-enterprise/ui-toolkit';
import { Responses as Rs, Response as R } from '../../../Definitions/ServiceDefinitions';
import { useState } from 'react';
import { ReadOnlyResponse } from '../Response/ReadOnlyResponse';

interface ResponsesProps {
    responses: Rs;
}

const isRefereceObject = (value: Rs | R): value is R => {
    return value.hasOwnProperty('$ref');
};

export function ReadOnlyResponses(props: ResponsesProps) {
    const { responses } = props;
    const [selectedStatusCode, setSelectedStatusCode] = useState<string | undefined>(responses && Object.keys(responses)[0]);

    const statusCodes = responses && Object.keys(responses);
    const statusTabViewItems: ViewItem[] = statusCodes && statusCodes.map(statusCode => ({ id: statusCode, name: statusCode }));

    return (
        <>
            <Typography sx={{ margin: 0 }} variant='h2'> Responses </Typography>
            {statusTabViewItems?.length > 0 && (
                <Tabs views={statusTabViewItems} childrenSx={{paddingTop: 10}} currentViewId={selectedStatusCode} onViewChange={setSelectedStatusCode}>
                    {responses && Object.keys(responses)?.map((status) => (
                        <div id={status} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {isRefereceObject(responses[status]) ? (
                                <>
                                    <ReadOnlyResponse response={responses[status] as R} />
                                </>
                            ) : (
                                <ReadOnlyResponse
                                    response={responses[status] as R}
                                />
                            )}
                        </div>
                    ))}
                </Tabs>
            )}
        </>
    );
}
