/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */
// tslint:disable: jsx-no-multiline-js
import React, { useMemo } from "react";

import { ClickAwayListener, Popover } from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { Apps, ArrowDropDown, Description } from "@material-ui/icons";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { BallerinaProjectComponents } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

import { PackageIcon } from "../../../assets/icons";
import { WorkspaceFolder } from "../../../DiagramGenerator/vscode/Diagram";
import { useHistoryContext } from "../../context/history";
import { extractFilePath, getFileNameFromPath, isPathEqual } from "../../utils";

import { NavButtonGroup } from "./NavButtonGroup";
import useStyles from './style';
import './style.scss';

interface NavigationBarProps {
    workspaceName: string;
    projectList: WorkspaceFolder[];
    projectInfo: BallerinaProjectComponents;
}

export function NavigationBar(props: NavigationBarProps) {
    const {
        workspaceName,
        projectList,
        projectInfo
    } = props;
    const classes = useStyles();
    const { history, historySelect, historyPush, historyClearAndPopulateWith } = useHistoryContext();
    const currentHistoryEntry = history.length > 0 ? history[history.length - 1] : undefined;
    const currentProject = projectList && projectList.length > 0
        && projectList.find(project => currentHistoryEntry?.file.includes(extractFilePath(project.uri.fsPath))) || undefined;

    const [isProjectSelectorOpen, setIsProjectSelectorOpen] = React.useState(false);
    const popoverRef = React.useRef<HTMLDivElement>(null);

    const treatAsWorkspace = projectList && projectList.length > 1 && currentProject;

    const fromDataMapper = history.length > 0
        && history[history.length - 1].fromDataMapper

    const handleProjectChange = (selectedProject: WorkspaceFolder) => {
        if (currentProject && isPathEqual(selectedProject.uri.fsPath, currentProject.uri.fsPath)) return;
        historyPush({ file: extractFilePath(selectedProject.uri.fsPath) });
    }

    const renderProjectSelectorComponent = () => {
        const projectSelectorOptions: React.ReactElement[] = [];
        const handlePojectSelectorClose = () => {
            setIsProjectSelectorOpen(false);
        }

        const handlePojectSelectorOpen = () => {
            setIsProjectSelectorOpen(true);
        }

        const handleOptionSelect = (project: WorkspaceFolder) => {
            handlePojectSelectorClose();
            handleProjectChange(project);
        }

        if (projectList && projectList.length > 0) {
            projectList.forEach(project => {
                const handleOptionClick = () => {
                    handleOptionSelect(project);
                }

                projectSelectorOptions.push(
                    <div className={classes.projectSelectorOption} onClick={handleOptionClick}>
                        <span>{project.name}</span>
                    </div>
                );
            });
        }


        return (
            <div className="btn-container" ref={popoverRef} onClick={handlePojectSelectorOpen} >
                <PackageIcon className={'icon'} />
                <Typography variant="h4">{currentProject?.name || ''}</Typography>
                <ArrowDropDown />
                <Popover
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left', }}
                    title={'Filter'}
                    open={isProjectSelectorOpen}
                    anchorEl={popoverRef ? popoverRef.current : undefined}
                    onClose={handlePojectSelectorClose}
                >
                    <ClickAwayListener
                        mouseEvent="onMouseDown"
                        touchEvent="onTouchStart"
                        onClickAway={handlePojectSelectorClose}
                    >
                        <div className="project-selector-container">
                            {projectSelectorOptions}
                        </div>
                    </ClickAwayListener>
                </Popover>
            </div>
        )
    }

    const renderWorkspaceNameComponent = () => {
        const handleOnClick = () => {
            if (projectInfo?.packages && projectInfo?.packages.length > 0) {
                historyClearAndPopulateWith({ file: extractFilePath(projectInfo?.packages[0]?.filePath) });
            }
        }

        let nameContent: string = workspaceName;
        let icon: React.ReactElement = <Apps className={'workspace-icon'} />;

        if (!treatAsWorkspace) {
            icon = <PackageIcon className={'icon'} />;
            const packageInformation = projectInfo?.packages[0];
            const packageName = packageInformation?.name;
            const packagePath = packageInformation?.filePath;
            if (packageName === '.' && packagePath.endsWith('.bal')) {
                nameContent = getFileNameFromPath(packagePath);
                icon = <Description className={'icon'} />;
            } else if (packageName) {
                nameContent = packageName;
            }
        }

        return (
            <div className="btn-container" onClick={handleOnClick} >
                {icon}
                <Typography variant="h4">
                    {nameContent}
                </Typography>
            </div>
        )
    };

    const [activeLink, links] = useMemo(() => {
        if (fromDataMapper && history.length > 0
            && history[history.length - 1].dataMapperDepth < history.length) {

            const currentEntry = history[history.length - 1];
            const startIndex = history.length - 1 - currentEntry.dataMapperDepth;
            let label = currentEntry?.name;
            const selectedLink = (
                <Typography className={classes.active}>
                    {label}
                </Typography>
            );
            const restLinks: JSX.Element[] = [];

            if (currentEntry.dataMapperDepth > 0) {
                history.slice(startIndex, history.length - 1).forEach((node, index) => {
                    const handleClick = () => {
                        historySelect(startIndex + index);
                    }
                    label = node?.name;
                    restLinks.push(
                        <Link
                            data-index={index}
                            key={index}
                            underline="hover"
                            onClick={handleClick}
                            className={classes.link}
                            data-testid={`dm-header-breadcrumb-${index}`}
                        >
                            {label}
                        </Link>
                    );
                })
            }

            return [selectedLink, restLinks];
        }
        return [undefined, undefined];
    }, [history, fromDataMapper]);

    return (
        <div id="nav-bar-main" className="header-bar">
            {<NavButtonGroup currentProjectPath={projectInfo?.packages[0]?.filePath} />}
            {renderWorkspaceNameComponent()}
            {treatAsWorkspace && <div style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }} >/</div>}
            {treatAsWorkspace && renderProjectSelectorComponent()}
            {fromDataMapper ? (
                <Breadcrumbs
                    maxItems={3}
                    separator={<NavigateNextIcon fontSize="small" />}
                    className={classes.breadcrumb}
                >
                    {links}
                    {activeLink}
                </Breadcrumbs>
            ) :
                (
                    <div className="component-details" />
                )
            }
        </div>
    );

}

