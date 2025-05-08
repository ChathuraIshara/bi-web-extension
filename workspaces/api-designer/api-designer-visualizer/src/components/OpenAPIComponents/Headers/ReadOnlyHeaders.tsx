/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Typography } from '@wso2-enterprise/ui-toolkit';
import { Headers as Hs, HeaderDefinition as H, ReferenceObject as R } from '../../../Definitions/ServiceDefinitions';
import { ReadOnlyHeader } from '../Header/ReadOnlyHeader';

interface HeadersProps {
    headers : Hs;
}

const isReferenceObject = (obj: H | R): obj is R => {
    return obj && typeof obj === 'object' && '$ref' in obj;
}

export function ReadOnlyHeaders(props: HeadersProps) {
    const { headers } = props;

    return (
        <>
            <Typography sx={{ margin: 0 }} variant='h4'> Headers </Typography>
            {headers && Object.entries(headers).map(([headerName, header], index) => (
                <div key={index} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {isReferenceObject(header) ? (
                        <>
                            {/* TODO: Implement ReferenceObject */}
                        </>
                    ) : (
                        <ReadOnlyHeader
                            id={index}
                            header={header as H}
                            name={headerName}
                        />
                    )}
                </div>
            ))}
        </>
    )
}
