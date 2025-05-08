/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';
import { useIntl } from 'react-intl';

import { Typography } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import TooltipBase, { TooltipProps } from '@material-ui/core/Tooltip';
import { ErrorIcon, InfoIcon, WarningIcon } from '@wso2-enterprise/ballerina-low-code-edtior-commons';
import { STNode } from '@wso2-enterprise/syntax-tree';

import useStyles, { toolbarHintStyles, tooltipInvertedStyles, tooltipStyles } from "./style";
import { getDiagnosticsFromST, getSourceFromST } from './utils';

export { TooltipProps } from '@material-ui/core/Tooltip';

interface TooltipPropsExtended extends TooltipProps {
    actionText?: string;
    actionLink?: string;
    inverted?: boolean;
    codeSnippet?: boolean;
    content?: string; // Only when Code Snippet prop available
    example?: boolean; // Only when Code Snippet prop available
    disabled?: boolean;
    openInCodeView?: () => void;
    heading?: string;
    typeExamples?: string;
    componentModel?: STNode;
    onClick: () => void;
    toolTipContent?: string;
    stmtEditorHint?: boolean;
    contentType?: string;
};

const TooltipComponent = withStyles(tooltipStyles)(TooltipBase);
const TooltipBaseInverted = withStyles(tooltipInvertedStyles)(TooltipBase);
const ToolbarHint = withStyles(toolbarHintStyles)(TooltipBase);

export function Tooltip(props: Partial<TooltipPropsExtended>) {
    const styles = useStyles();
    const intl = useIntl();

    const tooltipHintText = intl.formatMessage({
        id: "lowcode.develop.elements.tooltip.hintText",
        defaultMessage: "Hints:"
    });

    const tooltipHintSuggestionText = intl.formatMessage({
        id: "lowcode.develop.elements.tooltip.suggestionText",
        defaultMessage: "Press Ctrl/Cmd+Spacebar for suggestions"
    });
    const tooltipHintVarScopeText = intl.formatMessage({
        id: "lowcode.develop.elements.tooltip.varScopeText",
        defaultMessage: "You can use variables within the scope"
    });

    const {
        children,
        heading,
        title,
        content,
        example,
        actionText,
        actionLink,
        inverted,
        disabled,
        codeSnippet,
        openInCodeView,
        typeExamples,
        componentModel,
        onClick,
        toolTipContent,
        stmtEditorHint,
        contentType,
        ...restProps
    } = props;

    // Skip Tooltip rendering if disabled prop provided.
    if (disabled) return (<>{children}</>);

    let TooltipComponentRef = TooltipComponent;

    // Always invert background color if interactive prop set to `true`
    if (props.interactive) {
        TooltipComponentRef = TooltipBaseInverted;
    }

    if (stmtEditorHint) {
        TooltipComponentRef = ToolbarHint;
    }

    const GenericExamples = () => (
        <pre className={styles.exampleCodeWrap}>
            <span>E.g.</span><code data-lang="ballerina" className={styles.codeExample}>{typeExamples}</code>
        </pre>
    );
    const GenericCodeHints = () => (
        <div className={styles.codeHintWrap}>
            <div className={styles.codeHint}><b>{tooltipHintText}</b></div>
            <ul className={styles.tooltipHints}>
                <li className={styles.codeHint}>{tooltipHintSuggestionText}</li>
                <li className={styles.codeHint}>{tooltipHintVarScopeText}</li>
            </ul>
        </ div>
    );

    let tooltipTitle = (
        <div>
            {heading && (<h4 className={styles.heading}>{heading}</h4>)}
            <div>{title}</div>
            {typeExamples && <><GenericExamples /><GenericCodeHints /></>}
            {actionText && (<a className={styles.buttonLink} href={actionLink} target="_blank">{actionText}</a>)}
        </div>
    );

    if (codeSnippet && componentModel) {
        const source = getSourceFromST(componentModel);
        const diagnosticMsgs = getDiagnosticsFromST(componentModel);
        const icon = diagnosticMsgs ? diagnosticMsgs?.severity === "ERROR" ? <ErrorIcon /> : <WarningIcon /> : null;
        const diagnosticStyles = diagnosticMsgs?.severity === "ERROR" ? styles.diagnosticErrorWrapper : styles.diagnosticWarningWrapper;

        const Diagnostic = () => (
            <div className={styles.codeHintWrap}>
                <div className={styles.iconWrapper}>{icon}</div>
                <div className={diagnosticStyles}><b>{diagnosticMsgs?.message}</b></div>
                <Divider className={styles.divider} light={true} />
            </ div>
        );

        const Code = () => (
            <code
                data-lang="ballerina"
                className={example ? styles.codeExample : styles.code}
            >
                {source}
            </code>
        );

        const OpenInCodeLink = () => (
            <React.Fragment>
                <Divider className={styles.divider} light={true} />
                <span className={styles.editorLink} onClick={openInCodeView}>View in Code Editor</span>
            </React.Fragment>
        )

        const CodeSnippet = () => (
            <pre className={styles.pre}>
                <Code />
                {openInCodeView && <OpenInCodeLink />}
            </pre>
        );
        tooltipTitle = (
            diagnosticMsgs ?
                (
                    <>
                        <Diagnostic />
                        <CodeSnippet />
                    </>
                )
                :
                <CodeSnippet />
        );
    }

    if (toolTipContent) {

        const ToolTipContent = () => (
            contentType ? (
                <>
                    <Typography className={styles.stmtEditorTooltipContent}>{toolTipContent}</Typography>
                    <Typography className={styles.suggestionDataType}> {contentType}</Typography>
                </>
            ) :
                <div>{toolTipContent}</div>
        );

        tooltipTitle = (
            <ToolTipContent />
        );

    }
    // @ts-ignore
    return <TooltipComponentRef {...restProps} title={tooltipTitle}>{children}</TooltipComponentRef>
}

export function TooltipIcon(props: Partial<TooltipPropsExtended>) {
    const styles = useStyles();

    let iconComponent = <InfoIcon />;

    const { title, children, ...restProps } = props;

    if (children) {
        iconComponent = <><div className={styles.content}>{children}</div> <div className={styles.iconWrapper}>{iconComponent}</div></>;
    }

    return (
        <Tooltip {...restProps} title={title} interactive={true} placement="right-start">
            <div className={styles.componentWrapper}>
                {iconComponent}
            </div>
        </Tooltip>
    );
}

export function TooltipCodeSnippet(props: Partial<TooltipPropsExtended>) {
    const { content = "", openInCodeView, children, ...restProps } = props;

    return (
        <Tooltip
            {...restProps}
            openInCodeView={openInCodeView}
            content={content.trim()}
            title={null}
            codeSnippet={true}
            interactive={true}
        >
            {children}
        </Tooltip>
    );
}

export function DiagramTooltipCodeSnippet(props: Partial<TooltipPropsExtended>) {
    const { onClick, children, componentModel, content, ...restProps } = props;

    return (
        <Tooltip
            {...restProps}
            openInCodeView={onClick}
            codeSnippet={true}
            interactive={true}
            componentModel={componentModel}
            placement="right"
            arrow={true}
            toolTipContent={content}
        >
            {children}
        </Tooltip>
    );
}

export function StatementEditorHint(props: Partial<TooltipPropsExtended>) {
    const { onClick, children, componentModel, content, contentType, disabled, ...restProps } = props;

    return (
        <Tooltip
            {...restProps}
            interactive={false}
            componentModel={componentModel}
            placement="bottom-end"
            arrow={false}
            toolTipContent={content}
            stmtEditorHint={true}
            contentType={contentType}
            disabled={disabled}
        >
            {children}
        </Tooltip>
    );
}
