/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AutoComplete, Codicon, ProgressRing, TextField, Typography } from '@wso2-enterprise/ui-toolkit';
import React, { useEffect } from 'react';
import SidePanelContext from '../SidePanelContexProvider';
import { FirstCharToUpperCase } from '../../../utils/commons';
import { sidepanelAddPage } from '..';
import { useVisualizerContext } from '@wso2-enterprise/mi-rpc-client';
import { ConnectorOperation } from '@wso2-enterprise/mi-core';
import { ButtonGroup } from '../commons/ButtonGroup';
import { APIS, ERROR_MESSAGES } from '../../../resources/constants';
import { OperationsWrapper } from '../mediators/ModuleSuggestions';
import { DownloadPage } from '../mediators/DownloadPage';
import { debounce } from 'lodash';
import styled from '@emotion/styled';
import { VSCodeLink } from '@vscode/webview-ui-toolkit/react';
import { OperationsList } from './OperationsList';

const SearchStyle = {
    width: 'auto',

    '& > vscode-text-field': {
        width: '100%',
        height: '50px',
        borderRadius: '5px',
    },
};

const LoaderWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 15px;
    height: 100px;
    width: 100%;
`;

const searchIcon = (<Codicon name="search" sx={{ cursor: "auto" }} />);

interface ModuleProps {
    nodePosition: any;
    trailingSpace: string;
    documentUri: string;
    localConnectors: any;
    reloadMediatorPalette: (connectorName: string) => void;
}
export function Modules(props: ModuleProps) {
    const sidePanelContext = React.useContext(SidePanelContext);
    const { rpcClient } = useVisualizerContext();
    const { localConnectors } = props;
    const [allModules, setAllModules] = React.useState([] as any);
    const [searchedModules, setSearchedModules] = React.useState<[]>(undefined);
    const [searchValue, setSearchValue] = React.useState<string>('');
    const [isFetchingModules, setIsFetchingModules] = React.useState<Boolean>(false);
    const [selectedVersion, setSelectedVersion] = React.useState([]);

    useEffect(() => {
        fetchModules();
    }, [props.documentUri, props.nodePosition, rpcClient]);

    const fetchModules = async () => {
        try {
            setIsFetchingModules(true);
            if (navigator.onLine) {
                const response = await rpcClient.getMiDiagramRpcClient().getStoreConnectorJSON();
                const data = response.connectors;
                setAllModules(data);
            } else {
                console.error('No internet connection. Unable to fetch modules.');
                setAllModules(undefined);
            }
            setIsFetchingModules(false);
        } catch (error) {
            console.error('Error fetching mediators:', error);
            setAllModules(undefined);
        }
    };

    const debouncedSearchModules = React.useMemo(
        () => debounce(async (value: string) => {
            if (value) {
                try {
                    const runtimeVersion = await rpcClient.getMiDiagramRpcClient().getMIVersionFromPom();
                    const response = await fetch(`${APIS.CONNECTOR_SEARCH.replace('${searchValue}', value).replace('${version}', runtimeVersion.version)}`);
                    const data = await response.json();
                    setSearchedModules(data);
                } catch (e) {
                    console.error("Error fetching modules", e);
                    setSearchedModules(undefined);
                }
            } else {
                setSearchedModules(undefined);
            }
        }, 300),
        []
    );

    React.useEffect(() => {
        debouncedSearchModules(searchValue);

        return () => {
            debouncedSearchModules.cancel();
        };
    }, [searchValue, debouncedSearchModules]);

    const handleSearch = (e: string) => {
        setSearchedModules(undefined);
        setSearchValue(e);
    }

    const downloadModule = (module: any) => {
        const downloadPage = <DownloadPage
            module={module}
            selectedVersion={selectedVersion[module.connectorName] ?? module.version.tagName}
            onDownloadSuccess={props.reloadMediatorPalette}
            documentUri={props.documentUri} />;

        sidepanelAddPage(sidePanelContext, downloadPage, FirstCharToUpperCase(module.connectorName), module.iconUrl);
    };

    const setVersion = async (connectorName: any, version: string) => {
        selectedVersion[connectorName] = version;
        setSelectedVersion(selectedVersion);
    }

    const getFilteredStoreModules = (modules: any[]) => {
        return Object.entries(modules)
            .filter(([_, values]: [string, any]) =>
                !localConnectors ||
                !localConnectors.some((c: any) =>
                    ((c.displayName ? c.displayName === values.connectorName : c.name.toLowerCase() === values.connectorName.toLowerCase())) &&
                    (c.version === values.version.tagName)
                )
            )
            .sort(([, a], [, b]) => a.connectorRank - b.connectorRank);
    }

    const isSearching = searchValue && !searchedModules;



    const ModuleList = () => {
        let modules: any[];
        if (searchValue) {
            modules = searchedModules;
        } else {
            modules = allModules;
        }

        if (!modules || !Array.isArray(modules)) {
            return (
                <LoaderWrapper>
                    <span>Failed to fetch store modules. Please <VSCodeLink onClick={fetchModules}>retry</VSCodeLink></span>
                </LoaderWrapper>
            );
        }

        const filteredModules = modules && getFilteredStoreModules(modules);


        return Object.keys(modules).length === 0 ? <h3 style={{ textAlign: "center", paddingTop: "30px" }}>No modules found</h3> :
            <>
                {filteredModules.length === 0 ? (
                    <h3 style={{ textAlign: "center", paddingTop: "30px" }}>No more modules available</h3>
                ) : (
                    filteredModules.map(([key, values]: [string, any]) => (
                        <div key={key}>
                            <ButtonGroup
                                key={key}
                                title={FirstCharToUpperCase(values.connectorName)}
                                isCollapsed={true}
                                iconUri={values.iconUrl}
                                onDownload={() => downloadModule(values)}
                                disableGrid={true} >
                                <OperationsList connector={values} allowVersionChange={true} setVersionForDownload={setVersion} />
                            </ButtonGroup >
                        </div >
                    )))
                }
            </>
    }

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ padding: "10px", marginBottom: "20px", borderBottom: "1px solid var(--vscode-editorWidget-border)" }}>
                <Typography variant="body3">A collection of reusable modules for efficient software development.</Typography>
            </div>
            {/* Search bar */}
            {allModules && getFilteredStoreModules(allModules).length > 0 &&
                <TextField
                    sx={SearchStyle}
                    placeholder="Search"
                    value={searchValue}
                    onTextChange={handleSearch}
                    icon={{
                        iconComponent: searchIcon,
                        position: 'start',
                    }}
                    autoFocus={true}
                />}
            {

                isSearching || isFetchingModules ? (
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
                        <ProgressRing />
                    </div>
                ) : (
                    <ModuleList />
                )
            }
        </div >
    );
}
