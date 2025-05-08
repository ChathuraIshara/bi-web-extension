/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { FormControl, Typography } from "@material-ui/core";
import { BallerinaTriggerRequest, BallerinaTriggerResponse, DiagramEditorLangClientInterface } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";

import { AddIcon } from "../../../../../../assets/icons";
import DeleteButton from "../../../../../../assets/icons/DeleteButton";
import { useDiagramContext } from "../../../../../../Contexts/Diagram";
import { TextPreloaderVertical } from "../../../../../../PreLoader/TextPreloaderVertical";
import { createImportStatement, createTrigger } from "../../../../../utils/modification-util";
import { FormAutocomplete } from "../../../FormFieldComponents/Autocomplete";
import { FormActionButtons } from "../../../FormFieldComponents/FormActionButtons";
import { FormGeneratorProps } from "../../../FormGenerator";
import { wizardStyles as useFormStyles } from "../../style";
import "../style.scss";

export function TriggerForm(props: FormGeneratorProps) {
    const { onCancel, onSave, targetPosition, configOverlayFormStatus } = props
    const { formArgs, isLastMember } = configOverlayFormStatus;
    const { id, moduleName, displayAnnotation: { label } } = formArgs;
    const formClasses = useFormStyles();
    const intl = useIntl();

    const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
    const [addNewChannel, setNewChannel] = useState(false);
    const [channelList, setChannelList] = useState<string[]>([]);
    const [isTriggersLoading, setIsTriggersLoading] = useState(true);
    const [triggerInfo, setTriggerInfo] = useState<BallerinaTriggerResponse>();
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const unSelectedChannels = channelList === undefined ? [] : channelList.filter((channel) => !selectedChannels.includes(channel));

    useEffect(() => {
        handleFetchTrigger(id);
    }, []);

    const {
        api: {
            ls: { getDiagramEditorLangClient },
            code: { modifyDiagram }
        }
    } = useDiagramContext()

    const addnewChannelView = () => setNewChannel(true);

    const handleFetchTrigger = async (triggerId: string) => {
        const langClient: DiagramEditorLangClientInterface = await getDiagramEditorLangClient();
        const request: BallerinaTriggerRequest = {
            id: triggerId,
        };
        const triggerData = await langClient.getTrigger(request);
        setTriggerInfo(triggerData);
        if (triggerData.serviceTypes) {
            setChannelList(triggerData.serviceTypes.map(channel => channel.name));
            setIsTriggersLoading(false);
        }
    }

    const handleOnChannelSelect = (event: object, value: string, reason: string) => {
        setSelectedChannels([...selectedChannels, value]);
        setNewChannel(false);
    }

    const createTriggerCode = () => {
        let httpBased: boolean = true;
        const triggerId = triggerInfo.moduleName.split(".");
        const triggerAlias = triggerId[triggerId.length - 1];
        const serviceTypes = triggerInfo.serviceTypes.filter((sTypes) => selectedChannels.includes(sTypes.name))
        // TODO: This is a temporary fix till the central API supports the httpBased parameter
        if (triggerAlias === 'asb' || triggerAlias === 'salesforce') {
            httpBased = false;
        }
        const newTriggerInfo = {
            ...triggerInfo,
            serviceTypes,
            triggerType: triggerAlias,
            httpBased
        };
        // This is for initial imports only. Initially stModification import for nonHttpBased triggers
        const stModification = [
            createImportStatement("ballerinax", moduleName, targetPosition),
            createTrigger(newTriggerInfo, targetPosition, isLastMember)
        ];
        if (httpBased) {
            stModification.push(createImportStatement("ballerina", "http", targetPosition))
        }
        modifyDiagram(stModification);
        onSave();
    }

    const onDeleteChannel = (channelName: string) => {
        setSelectedChannels(selectedChannels.filter((currentChannel) => currentChannel !== channelName));
    }

    const handleDropDownOpen = () => {
        setIsDropDownOpen(!isDropDownOpen)
    }

    const selectedTriggerItem = (channelName: string, key: number) => {
        return (
            <div className={formClasses.headerWrapper} key={key}>
                <div className={formClasses.headerLabel}>
                    {channelName}
                </div>
                <div data-testid={`delete-${channelName}`}>
                    <DeleteButton
                        onClick={onDeleteChannel.bind(this, channelName)}
                    />
                </div>
            </div>
        )
    }

    const preLoader = (
        <div className={formClasses.loaderWrapper}>
            <TextPreloaderVertical position="relative" />
        </div>
    )

    const dropDownForm = () => {
        const operationDropdownPlaceholder = intl.formatMessage({
            id: "lowcode.develop.triggerConfigForm.placeholder",
            defaultMessage: "Select Channel"
        });
        return (
            isTriggersLoading ? preLoader : (
                <div className={formClasses.triggerDropDownList}>
                    <FormAutocomplete
                        itemList={unSelectedChannels}
                        onChange={handleOnChannelSelect}
                        placeholder={operationDropdownPlaceholder}
                        handleDropDownOpen={handleDropDownOpen}
                    />
                </div>
            )
        )
    }

    const addNewChannelButton = (
        <span onClick={addnewChannelView} className={formClasses.addPropertyBtn} data-testid={"add-channel"}>
            <AddIcon />
            <p><FormattedMessage id="lowcode.develop.triggerConfigForm.trigger.addChannel.title" defaultMessage="Add Channel" /></p>
        </span>
    );
    const formActionButtons = (
        (!isTriggersLoading && !isDropDownOpen) ? (
            <div className={formClasses.formActionButton}>
                <FormActionButtons
                    cancelBtnText="Cancel"
                    saveBtnText={"Create"}
                    isMutationInProgress={selectedChannels.length === 0}
                    validForm={true}
                    onSave={createTriggerCode}
                    onCancel={onCancel}
                />
            </div>

        ) : null
    )

    return (
        <>
            <FormControl data-testid="trigger-form" className={formClasses.wizardFormControl}>
                <FormHeaderSection
                    onCancel={onCancel}
                    formTitle={"lowcode.develop.triggerConfigForm.trigger.header.title"}
                    defaultMessage={`${label} Trigger`}
                />
                <div className={formClasses.formWrapper}>
                    <div>
                        <Typography>
                            <FormattedMessage id="lowcode.develop.triggerConfigForm.configTitle" defaultMessage=" Service Config" />
                        </Typography>
                    </div>
                    <div>
                        {selectedChannels.map((channel, index) => (selectedTriggerItem(channel, index)))}
                        {addNewChannel || selectedChannels.length === 0 ? dropDownForm() : ((selectedChannels.length !== channelList.length) ? addNewChannelButton : (null))}
                    </div>
                    {formActionButtons}
                </div>
            </FormControl>
        </>
    );
}
