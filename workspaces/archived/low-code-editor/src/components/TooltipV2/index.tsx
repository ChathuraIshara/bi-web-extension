/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';

import Divider from '@material-ui/core/Divider';
import { withStyles } from "@material-ui/core/styles";
import TooltipBase, { TooltipProps } from '@material-ui/core/Tooltip';
import * as MonacoEditor from 'monaco-editor';

import { ErrorIcon, InfoIcon, WarningIcon } from '../../assets/icons';

import useStyles, { tooltipBaseStyles } from "./style";

interface TooltipPropsExtended extends TooltipProps {
    type: string,
    text?: { heading?: string, content?: string, example?: string, code?: string },
    diagnostic?: { diagnosticMsgs?: string, code?: string, severity?: string },
    action?: { link: string, text: string },
    disabled?: boolean;
    onClick?: () => void;
}

const TooltipComponent = withStyles(tooltipBaseStyles)(TooltipBase);
const codeRef = (ref: HTMLPreElement) => {
    if (ref) {
        MonacoEditor.editor.colorizeElement(ref, { theme: 'choreoLightTheme' });
    }
}

export default function Tooltip(props: Partial<TooltipPropsExtended>) {
    const { children, title, text, action, disabled, onClick, type, diagnostic, ...restProps } = props;
    const classes = useStyles();

    let tooltipComp = diagnostic && diagnostic.diagnosticMsgs ?
        (
            <div>
                <h4 className={classes.heading}>{diagnostic.diagnosticMsgs}</h4>
            </div>
        )
        : (text && text.heading) ?
            (
                <div>
                    <h4 className={classes.heading}>{text.heading}</h4>
                </div>
            )
            : (
                <div>
                    <h4 className={classes.heading} />
                </div>
            );

    if (text) {
        switch (type) {
            // this type is used for tooltips which have code snippet and open with code view link
            case "diagram-code":
                tooltipComp = DiagramCodeTooltip(props)
                break;
            // this type is used when there are examples to displayed in the tooltip
            case "example":
                tooltipComp = ExampleTooltip(props)
                break;
            // this type is used when there is only heading or a title in the tooltip
            case "heading":
                tooltipComp = HeadingTooltip(props)
                break;
            // this type is used when there is a heading/title with a paragraph/content in the tooltip
            case "heading-content":
                tooltipComp = HeadingContentTooltip(props)
                break;
            // this type is similar to diagram-code[1] but this is used when there is no open in code view button and
            // for short code snippets
            case "truncate-code":
                tooltipComp = CodeTruncateTooltip(props)
                break;
            // this type is used when there is an action link in the tooltip
            case "info":
                tooltipComp = ActionTooltip(props)
                break;
            // this type is used when we need to add the tooltip icon
            case "icon":
                tooltipComp = TooltipIcon(props)
                break;
            // this type is similar to example[2] but this type can have code snippets as well as examples
            case "example-code":
                tooltipComp = ExampleCodeTooltip(props)
                break;
            // this type is similar to example-code[3] but we have have code snippet, example as well as action link
            case "example-code-info":
                tooltipComp = ExampleCodeInfoTooltip(props)
                break;
            case "diagram-diagnostic":
                tooltipComp = DiagramDiagnosticTooltip(props)
                break;
        }
    }
    if (disabled) return (<>{children}</>);

    return <TooltipComponent interactive={true} {...restProps} title={tooltipComp}>{children}</TooltipComponent>
}

function TooltipIcon(props: Partial<TooltipPropsExtended>) {
    const classes = useStyles();
    const { children } = props;
    let iconComponent = <InfoIcon />;
    if (children) {
        iconComponent = <><div>{children}</div> <div className={classes.iconWrapper}>{iconComponent}</div></>;
    }

    return (
        <div className={classes.componentWrapper}>
            {iconComponent}
        </div>
    );
}

function DiagramCodeTooltip(props: Partial<TooltipPropsExtended>) {
    const { text, onClick } = props;
    const classes = useStyles();
    const Code = () => (
        <code
            ref={codeRef}
            data-lang="ballerina"
            className={classes.code}
        >
            {text?.code.trim()}
        </code>
    );
    const OpenInCodeLink = () => (
        <React.Fragment>
            <Divider className={classes.divider} light={true} />
            <div className={classes.editorLink} onClick={onClick}>View in Code Editor</div>
        </React.Fragment>
    )
    return (
        <pre className={classes.pre}>
            {text && text.code && <Code />}
            {onClick && <OpenInCodeLink />}
        </pre>
    );
}

function ExampleTooltip(props: Partial<TooltipPropsExtended>) {
    const { text } = props;
    const classes = useStyles();
    return (
        <div>
            {text.heading && <div className={classes.heading}>{text.heading}</div>}
            {text.content && <div className={classes.subHeading}>{text.content}</div>}
            {(text.heading || text.content) && <Divider className={classes.divider} light={true} />}
            {text.example && <div className={classes.exampleContent}><span className={classes.exampleTag}>Eg: </span>{text.example}</div>}
        </div>
    )
}

function ActionTooltip(props: Partial<TooltipPropsExtended>) {
    const { text, action } = props;
    const classes = useStyles();
    return (
        <div>
            {text.heading && (<div className={classes.heading}>{text.heading}</div>)}
            {text.content && (<div className={classes.subHeading}>{text.content}</div>)}
            {((text.heading || text.content) && (text.example || action?.text)) && <Divider className={classes.divider} light={true} />}
            {text.example && <div className={classes.exampleContent}><span className={classes.exampleTag}>Eg: </span>{text.example}</div>}
            {action?.text && (<div className={classes.buttonLink}> <a href={action.link} className={classes.buttonLink} target="_blank">{action.text}</a></div>)}
        </div>
    )
}

function HeadingTooltip(props: Partial<TooltipPropsExtended>) {
    const { text } = props;
    const classes = useStyles();
    return (
        <div>
            {text.heading && <div className={classes.heading}>{text.heading}</div>}
        </div>
    );
}

function HeadingContentTooltip(props: Partial<TooltipPropsExtended>) {
    const { text } = props;
    const classes = useStyles();
    return (
        <div>
            {text.heading && <div className={classes.heading}>{text.heading}</div>}
            {text.content && <div className={classes.subHeading}>{text.content}</div>}
        </div>
    );
}

function CodeTruncateTooltip(props: Partial<TooltipPropsExtended>) {
    const { text } = props;
    const classes = useStyles();
    return (
        <code
            ref={codeRef}
            data-lang="ballerina"
            className={classes.code}
        >
            {text.code.trim()}
        </code>
    );
}

function ExampleCodeTooltip(props: Partial<TooltipPropsExtended>) {
    const { text } = props;
    const classes = useStyles();
    return (
        <div>
            {text.heading && <div className={classes.heading}>{text.heading}</div>}
            {text.content && <div className={classes.exampleContent}>{text.content}</div>}
            {(text.heading || text.content) && <Divider className={classes.divider} light={true} />}
            {text.example && <div className={classes.exampleContent}><span>Eg: </span>{text.example}</div>}
            {text.code && <div className={`${classes.code} ${classes.codeWrapper}`}><code ref={codeRef} data-lang="ballerina">{text.code.trim()}</code></div>}
        </div>
    )
}

function ExampleCodeInfoTooltip(props: Partial<TooltipPropsExtended>) {
    const { text, action } = props;
    const classes = useStyles();
    return (
        <div>
            {text.heading && <div className={classes.heading}>{text.heading}</div>}
            {text.content && <div className={classes.exampleContent}>{text.content}</div>}
            {(text.heading || text.content) && <Divider className={classes.divider} light={true} />}
            {text.example && <div className={classes.exampleContent}><span>Eg: </span>{text.example}</div>}
            {text.code && <div className={`${classes.code} ${classes.codeWrapper}`}><code ref={codeRef} data-lang="ballerina">{text.code.trim()}</code></div>}
            {action.text && (<div className={classes.buttonLink}> <a href={action.link} className={classes.buttonLink} target="_blank">{action.text}</a></div>)}
        </div>
    )
}

function DiagramDiagnosticTooltip(props: Partial<TooltipPropsExtended>) {
    const { diagnostic, onClick } = props;
    const classes = useStyles();
    const iconComponent = diagnostic?.severity === "ERROR" ? <ErrorIcon /> : <WarningIcon />;

    const Code = () => (
        <React.Fragment>
            <Divider className={classes.divider} light={true} />
            <code
                ref={codeRef}
                data-lang="ballerina"
                className={classes.code}
            >
                {diagnostic.code.trim()}
            </code></React.Fragment>

    );
    const Diagnostic = () => (
        <div>
            <div className={classes.iconWrapper}>{iconComponent}</div>
            <div className={classes.diagnosticWrapper}>{diagnostic.diagnosticMsgs}</div>
        </div>

    );
    const OpenInCodeLink = () => (
        <React.Fragment>
            <Divider className={classes.divider} light={true} />
            <div className={classes.editorLink} onClick={onClick}>View in Code Editor</div>
        </React.Fragment>
    )
    return (
        <pre className={classes.pre}>
            {diagnostic.diagnosticMsgs && <Diagnostic />}
            {diagnostic.code && <Code />}
            {onClick && <OpenInCodeLink />}
        </pre>
    );
}
