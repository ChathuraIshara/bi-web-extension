/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext, useMemo } from "react";

import { ClickAwayListener, Popover } from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { Apps, ArrowBack, ArrowDropDown, HomeOutlined } from "@material-ui/icons";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { FunctionDefinition, STKindChecker } from "@wso2-enterprise/syntax-tree";

import { PackageIcon } from "../../assets/icons";
import { Context } from "../../Contexts/Diagram";
import { WorkspaceFolder } from "../../DiagramGenerator/vscode/Diagram";
import { useHistoryContext } from "../context/history";

import useStyles from './style';
import './style.scss';

interface NavigationBarProps {
    workspaceName: string;
    projectList: WorkspaceFolder[];
    currentProject: WorkspaceFolder;
    updateCurrentProject: (project: WorkspaceFolder) => void;
}

export function NavigationBar(props: NavigationBarProps) {
    const {
        workspaceName,
        projectList,
        currentProject,
        updateCurrentProject,
    } = props;
    const classes = useStyles();
    const { history, historyPop, historySelect, historyReset } = useHistoryContext();
    const { props: { syntaxTree } } = useContext(Context);

    const [isProjectSelectorOpen, setIsProjectSelectorOpen] = React.useState(false);
    const popoverRef = React.useRef<HTMLDivElement>(null);

    const isWorkspace = projectList && projectList.length > 1;

    const isRootDataMapper = syntaxTree && STKindChecker.isFunctionDefinition(syntaxTree)
        && STKindChecker.isExpressionFunctionBody(syntaxTree.functionBody);

    const handleProjectChange = (selectedProject: WorkspaceFolder) => {
        updateCurrentProject(selectedProject);
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
            if (projectList && currentProject) {
                historyReset();
            }
        }

        return (
            <div className="btn-container" onClick={handleOnClick} >
                {isWorkspace ? <Apps className={'workspace-icon'} /> : <PackageIcon className={'icon'} />}
                <Typography variant="h4">{`${projectList ? workspaceName : '.'}`}</Typography>
            </div>
        )
    };


    const renderNavigationButtons = () => {
        const buttonsDisabled = !projectList || !currentProject || history.length === 0;

        const handleBackButtonClick = () => {
            if (!buttonsDisabled) {
                historyPop();
            }
        }

        const handleHomeButtonClick = () => {
            if (!buttonsDisabled) {
                historyReset();
            }
        }

        return (
            <>
                <div
                    className="btn-container"
                    aria-disabled={buttonsDisabled}
                    onClick={handleBackButtonClick}
                >
                    <ArrowBack className={buttonsDisabled ? 'is-disabled' : ''} />
                </div>
                <div
                    className="btn-container"
                    aria-disabled={buttonsDisabled}
                    onClick={handleHomeButtonClick}
                >
                    <HomeOutlined className={buttonsDisabled ? 'is-disabled' : ''} />
                </div>
            </>
        );
    };

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        const index: number = +event.currentTarget.getAttribute('data-index');
        historySelect(index);
    };

    const [activeLink, links] = useMemo(() => {
        if (isRootDataMapper && history.length > 0) {
            if (history.length === 1) {
                history[0].name = (syntaxTree as FunctionDefinition).functionName.value;
            }
            let label = history[history.length - 1]?.name;
            const selectedLink = (
                <Typography className={classes.active}>
                    {label}
                </Typography>
            );

            const restLinks = history.length > 1 && (
                history.slice(0, -1).map((node, index) => {
                    label = node?.name;
                    return (
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
            );

            return [selectedLink, restLinks];
        }
        return [undefined, undefined];
    }, [history, syntaxTree, isRootDataMapper]);

    // {renderWorkspaceNameComponent(isWorkspace)}
    return (
        <div id="nav-bar-main" className="header-bar">
            {renderNavigationButtons()}
            {renderWorkspaceNameComponent()}
            {isWorkspace && <div style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }} >/</div>}
            {isWorkspace && renderProjectSelectorComponent()}
            {isRootDataMapper ? (
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

