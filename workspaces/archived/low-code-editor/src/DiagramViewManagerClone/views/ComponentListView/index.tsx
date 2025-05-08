/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import React from "react";

import { FormControl, InputAdornment, InputLabel, Select, TextField, Typography } from "@material-ui/core";
import { BallerinaProjectComponents, ComponentViewInfo, FileListEntry } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

import SearchIcon from "../../../assets/icons/SearchIcon";
import { TopLevelActionButton } from "../../../OverviewDiagram/components/TopLevelActionButton";
import { ComponentCollection } from "../../../OverviewDiagram/util";
import { useHistoryContext } from "../../context/history";
import { extractFilePath } from "../../utils";

import { ComponentView } from "./components/ComponentView";
import useStyles from "./style";
import './style.scss';
import { ProjectComponentProcessor } from "./util/project-component-processor";

interface ComponentListViewProps {
    lastUpdatedAt: string;
    projectComponents: BallerinaProjectComponents;
}

const ALL_FILES: string = 'All';

// shows a view that includes document/project symbols(functions, records, etc.)
// you can switch between files in the project and view the symbols in eachfile
// when you select a symbol, it will show the symbol's visualization in the diagram view
export function ComponentListView(props: ComponentListViewProps) {
    const { projectComponents } = props;
    const { history, historyPush } = useHistoryContext();
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    let currentComponents: ComponentCollection;
    let fileList: FileListEntry[];
    const classes = useStyles();

    if (projectComponents) {
        const projectComponentProcessor = new ProjectComponentProcessor(projectComponents);
        projectComponentProcessor.process();
        currentComponents = history.length > 0 && history[history.length - 1].file.endsWith('.bal') ?
            projectComponentProcessor.getComponentsFor(history[history.length - 1].file)
            : projectComponentProcessor.getComponents()
        fileList = Array.from(projectComponentProcessor.getFileMap().values());
    }


    const renderFileFilterBar = () => {
        const handleFileChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
            if (evt.target.value === ALL_FILES) {
                historyPush({ file: extractFilePath(projectComponents?.packages[0]?.filePath) })
            } else {
                const selectedFile = fileList.find((file) => file.fileName === evt.target.value);
                historyPush({ file: extractFilePath(selectedFile.uri.fsPath) })
            }
        };

        const handleSeachChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = evt.target;
            setSearchQuery(value);
        }

        const fileSelectorOptions: React.ReactElement[] = [];

        fileSelectorOptions.push(
            <option key={"all"} value={ALL_FILES}>
                {ALL_FILES}
            </option>
        );

        if (fileList && fileList.length > 0) {
            fileList.forEach((fileEntry, optionIndex) => [
                fileSelectorOptions.push(
                    <option key={optionIndex} value={fileEntry.fileName}>
                        {fileEntry.fileName}
                    </option>
                ),
            ]);
        }

        let currentFileName = ALL_FILES;

        if (history.length > 0) {
            currentFileName = fileList?.find((file) => file.uri.path === history[history.length - 1].file)?.fileName || ALL_FILES;
        }

        const textFieldInputProps = {
            endAdornment: (
                <InputAdornment position="end">
                    <SearchIcon color="disabled" fontSize="small" />
                </InputAdornment>
            ),
        };

        return (
            <div className="title-bar">
                <FormControl variant="outlined" className={classes.selectorComponent}>
                    <InputLabel htmlFor="outlined-age-native-simple">File</InputLabel>
                    <Select
                        native={true}
                        value={currentFileName}
                        label="File"
                        inputProps={{ name: "age", id: "outlined-age-native-simple" }}
                        onChange={handleFileChange}
                    >
                        {fileSelectorOptions}
                    </Select>
                </FormControl>
                <TextField
                    id="search-comp-input"
                    label="Search Component"
                    variant="outlined"
                    className={classes.inputComponent}
                    onChange={handleSeachChange}
                    InputProps={textFieldInputProps}
                />
                <TopLevelActionButton fileList={fileList} />
            </div>
        );
    };

    const handleComponentSelection = (info: ComponentViewInfo) => {
        historyPush({
            file: info.filePath,
            position: info.position
        })
    }

    const categories: React.ReactElement[] = [];

    if (currentComponents) {
        Object.keys(currentComponents)
            .filter((key) => currentComponents[key].length)
            .forEach((key, categoryIndex) => {
                const filteredComponents = currentComponents[key].filter(
                    (comp: ComponentViewInfo) =>
                        comp.name.toLowerCase().includes(searchQuery?.toLowerCase().trim() || "") ||
                        key.toLowerCase().includes(searchQuery?.toLowerCase().trim() || "")
                );

                const components = filteredComponents.map((comp: ComponentViewInfo, compIndex: number) => {
                    return (
                        <ComponentView
                            key={key + compIndex}
                            info={comp}
                            updateSelection={handleComponentSelection}
                            type={key}
                        />
                    )
                });

                if (components.length === 0) return;

                categories.push(
                    <div className={classes.categoryContainer} key={key + categoryIndex}>
                        <Typography variant="h3" className={classes.categoryTitle}>{key}</Typography>
                        <div className={classes.componentContainer}>{components}</div>
                    </div>
                );
            });
    }

    return (
        <div className={'view-container'}>
            {renderFileFilterBar()}
            {categories}
        </div>
    )
}
