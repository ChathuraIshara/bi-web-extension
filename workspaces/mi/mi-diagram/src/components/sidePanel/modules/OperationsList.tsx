/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AutoComplete, Divider, ProgressRing, Tooltip } from '@wso2-enterprise/ui-toolkit';
import React, { useEffect, useState } from 'react';
import { FirstCharToUpperCase } from '../../../utils/commons';
import { ConnectorOperation } from '@wso2-enterprise/mi-core';
import { OperationsWrapper } from '../mediators/ModuleSuggestions';
import { APIS } from '../../../resources/constants';

interface OperationsListProps {
    connector: any;
    allowVersionChange?: boolean;
    setVersionForDownload?: (connectorName: string, version: string) => void;
}

export function OperationsList(props: OperationsListProps) {
    const { connector, allowVersionChange, setVersionForDownload } = props;
    const [operations, setOperations] = useState<[]>(undefined);
    const [selectedVersion, setSelectedVersion] = useState<string>("");
    const [isFetchingOperations, setIsFetchingOperations] = useState<boolean>(false);

    useEffect(() => {
        setSelectedVersion(connector.version.tagName);
        setOperations(connector.version.operations);
    }, []);

    const setVersion = async (version: string) => {
        try {
            setIsFetchingOperations(true);
            if (navigator.onLine) {
                const isLatestVersion = connector.version.tagName === version;

                let operations;
                if (isLatestVersion) {
                    operations = connector.version.operations;
                } else {
                    const response = await fetch(`${APIS.CONNECTOR_VERSION.replace('${repoName}', connector.repoName).replace('${versionId}', connector.otherVersions[version])}`);
                    const data = await response.json();
                    operations = data.version.operations;
                }
                setSelectedVersion(version);
                setOperations(operations);
                setVersionForDownload && setVersionForDownload(connector.connectorName, version);
            } else {
                console.error('No internet connection. Unable to fetch operations.');
            }
            setIsFetchingOperations(false);
        } catch (error) {
            console.error('Error fetching operations:', error);
        }
    }

    return (
        <OperationsWrapper>
            {isFetchingOperations ? (
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
                    <ProgressRing />
                </div>
            ) : (
                <>
                    {allowVersionChange && (
                        <div style={{ height: '30px', width: '100%' }}>
                            <AutoComplete
                                name={`${connector.connectorName}-version`}
                                label={"Version"}
                                items={[
                                    connector.version.tagName,
                                    ...(Object.keys(connector.otherVersions || {}).map(version => (version)))
                                ]}
                                value={selectedVersion}
                                onValueChange={(e) => setVersion(e)}
                                allowItemCreate={false}
                            />
                        </div>
                    )}
                    {operations?.length && (
                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '30px' }} >
                            Available Operations
                            <Divider sx={{ margin: '5px 0' }} />
                            {operations.map((operation: ConnectorOperation) => (
                                !operation.isHidden && (
                                    <Tooltip
                                        key={operation.name}
                                        content={operation.description}
                                        position='bottom'
                                        sx={{ zIndex: 2010 }}
                                        containerSx={{ cursor: "default" }}>
                                        {FirstCharToUpperCase(operation.name)}
                                    </Tooltip>
                                )
                            ))}
                        </div>
                    )}
                </>
            )}
        </OperationsWrapper>
    );
}
