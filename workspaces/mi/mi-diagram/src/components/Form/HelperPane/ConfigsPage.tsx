/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Position } from 'vscode-languageserver-types';
import * as yup from 'yup';

import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Codicon, COMPLETION_ITEM_KIND, Divider, Dropdown, getIcon, HelperPane, TextField, Typography } from '@wso2-enterprise/ui-toolkit';
import { useVisualizerContext } from '@wso2-enterprise/mi-rpc-client';
import { HelperPaneCompletionItem } from '@wso2-enterprise/mi-core';

import { filterHelperPaneCompletionItems, getHelperPaneCompletionItem } from '../FormExpressionField/utils';

const Form = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 8px;
`;

const Title = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const ButtonPanel = styled.div`
    display: flex;
    margin-top: 20px;
    margin-left: auto;
    gap: 16px;
`;

type ConfigsPageProps = {
    position: Position;
    onChange: (value: string) => void;
};

/* Validation schema for the config form */
const schema = yup.object({
    configName: yup.string().required('Config Name is required'),
    configType: yup.string().oneOf(['string', 'cert'] as const).required('Config Type is required')
});

type ConfigFormData = yup.InferType<typeof schema>;

export const ConfigsPage = ({ position, onChange }: ConfigsPageProps) => {
    const { rpcClient } = useVisualizerContext();
    const firstRender = useRef<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [configInfo, setConfigInfo] = useState<HelperPaneCompletionItem[]>([]);
    const [filteredConfigInfo, setFilteredConfigInfo] = useState<HelperPaneCompletionItem[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            configName: '',
            configType: 'string'
        }
    });

    const getConfigInfo = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            rpcClient.getVisualizerState().then((machineView) => {
                rpcClient
                    .getMiDiagramRpcClient()
                    .getHelperPaneInfo({
                        documentUri: machineView.documentUri,
                        position: position,
                    })
                    .then((response) => {
                        if (response.configs?.length) {
                            setConfigInfo(response.configs);
                            setFilteredConfigInfo(response.configs);
                        }
                    })
                    .finally(() => setIsLoading(false));
            });
        }, 1100);
    }, [rpcClient, position]);
    
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            getConfigInfo();
        }
    }, []);

    const onSubmit = (data: ConfigFormData) => {
        // Handle form submission
        rpcClient.getMiDiagramRpcClient().saveConfig({
            configName: data.configName,
            configType: data.configType
        }).then(({ success }) => {
            if (success) {
                // Retrieve the updated config info
                clearForm();
                getConfigInfo();
            }
        });
    };

    const clearForm = () => {
        setIsFormOpen(false);
        reset();
    };

    const debounceFilterConfigs = useCallback(
        debounce((searchText: string) => {
            setFilteredConfigInfo(filterHelperPaneCompletionItems(configInfo, searchText));
            setIsLoading(false);
        }, 1100),
        [configInfo, setFilteredConfigInfo, setIsLoading, filterHelperPaneCompletionItems]
    );

    const handleSearch = (searchText: string) => {
        setSearchValue(searchText);
        setIsLoading(true);
        debounceFilterConfigs(searchText);
    };

    const getCompletionItemIcon = () => getIcon(COMPLETION_ITEM_KIND.Variable);

    return (
        <>
            {!isFormOpen ? (
                <>
                    <HelperPane.Header
                        searchValue={searchValue}
                        onSearch={handleSearch}
                    />
                    <HelperPane.Body loading={isLoading}>
                        {filteredConfigInfo?.map((config) => (
                            getHelperPaneCompletionItem(config, onChange, getCompletionItemIcon)
                        ))}
                    </HelperPane.Body>
                </>
            ) : (
                <Form>
                    <Title>
                        <Typography variant="h3" sx={{ margin: '0' }}>
                            Add configuration
                        </Typography>
                        <Divider sx={{ margin: '0' }} />
                    </Title>
                    <Alert
                        variant='primary'
                        title="Important!"
                        subTitle="After adding the configuration through the form, please add config name and the value to the .env file."
                        sx={{ marginBottom: '0' }}
                    />
                    <TextField
                        id="configName"
                        placeholder="Name of the configuration"
                        label="Name"
                        autoFocus
                        required
                        {...register('configName')}
                        errorMsg={errors.configName?.message}
                    />
                    <Dropdown
                        id="configType"
                        label="Type"
                        required
                        {...register('configType')}
                        errorMsg={errors.configType?.message}
                        items={[
                            { id: '1', content: 'string', value: 'string' },
                            { id: '2', content: 'cert', value: 'cert' }
                        ]}
                    />
                    <ButtonPanel>
                        <Button appearance="secondary" onClick={clearForm}>
                            Cancel
                        </Button>
                        <Button appearance="primary" onClick={handleSubmit(onSubmit)} disabled={!isValid}>
                            Save
                        </Button>
                    </ButtonPanel>
                </Form>
            )}
            {!isFormOpen && (
                <HelperPane.Footer>
                    <HelperPane.IconButton
                        title="Create New Configurable Variable"
                        getIcon={() => <Codicon name="add" />}
                        onClick={() => setIsFormOpen(true)}
                    />
                </HelperPane.Footer>
            )}
        </>
    );
};
