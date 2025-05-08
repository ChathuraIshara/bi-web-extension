/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useState } from "react";

import { FormControl, Input, InputAdornment, InputLabel, OutlinedInput, Select, TextField, Typography } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import { BallerinaProjectComponents, FileListEntry } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

import { ComponentCollection, ComponentViewInfo, genFilePath } from "../../../util";
import { TopLevelActionButton } from "../../TopLevelActionButton";
import { ComponentView } from "../ComponentView";

import useStyles from "./style";
import './style.scss'

interface CategoryViewProps {
    projectComponents: BallerinaProjectComponents;
    updateSelection: (info: ComponentViewInfo) => void;
    currentFile: string;
    currentFileName: string;
    fileList: FileListEntry[];
    updateCurrentFile: (filePath: string) => void;
}

const ALL_FILES: string = 'All';

export function CategoryView(props: CategoryViewProps) {
    const { projectComponents, updateSelection, currentFile, fileList, updateCurrentFile, currentFileName } = props;
    const classes = useStyles();
    const currentComponents: ComponentCollection = {
        functions: [],
        services: [],
        records: [],
        objects: [],
        classes: [],
        types: [],
        constants: [],
        enums: [],
        listeners: [],
        moduleVariables: []
    };

    const [searchQuery, setSearchQuery] = useState<string>();


    // TODO: Handle the processing of response json in a better way
    if (projectComponents) {
        projectComponents.packages.forEach(packageInfo => {
            packageInfo.modules.forEach(module => {
                Object.keys(module).forEach(key => {
                    if (key !== 'name') {
                        module[key].forEach((element: any) => {
                            const filePath = genFilePath(packageInfo, module, element);
                            if (currentFile && currentFile !== filePath) return;
                            currentComponents[key].push({
                                filePath,
                                position: {
                                    startLine: element.startLine,
                                    startColumn: element.startColumn,
                                    endLine: element.endLine,
                                    endColumn: element.endColumn
                                },
                                fileName: element.filePath,
                                moduleName: module.name ? module.name : '',
                                name: element.name
                            })
                        });
                    }
                })
            });
        });
    }

    const renderFileFilterBar = () => {
        const handleFileChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
            if (evt.target.value === ALL_FILES) {
                updateCurrentFile(undefined);
            } else {
                const selectedFile = fileList.find((file) => file.fileName === evt.target.value);
                updateCurrentFile(selectedFile.uri.path);
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
        return (
            <div className="title-bar">
                <FormControl variant="outlined" className={classes.selectorComponent}>
                    <InputLabel htmlFor="outlined-age-native-simple">File</InputLabel>
                    <Select
                        native={true}
                        value={currentFileName ? currentFileName : ALL_FILES}
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
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon color="disabled" fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
                <TopLevelActionButton fileList={[]} />
            </div>
        );
    };

    const categories: React.ReactElement[] = [];

    Object.keys(currentComponents)
        .filter((key) => currentComponents[key].length)
        .forEach((key, categoryIndex) => {
            const flitteredComponents = currentComponents[key].filter(
                (comp: ComponentViewInfo) =>
                    comp.name.toLowerCase().includes(searchQuery?.toLowerCase().trim() || "") ||
                    key.toLowerCase().includes(searchQuery?.toLowerCase().trim() || "")
            );
            const components = flitteredComponents.map((comp: ComponentViewInfo, compIndex: number) => (
                <ComponentView key={key + compIndex} info={comp} updateSelection={updateSelection} type={key} />
            ));

            if (components.length === 0) return;

            categories.push(
                <div className={classes.categoryContainer} key={key + categoryIndex}>
                    <Typography variant="h3" className={classes.categoryTitle}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Typography>
                    <div className={classes.componentContainer}>{components}</div>
                </div>
            );
        });

    return (
        <>
            {renderFileFilterBar()}
            {categories}
            {categories.length === 0 && searchQuery?.trim() && <div className={classes.noComponents}>No components were found for the search query.</div>}
        </>
    );
}

