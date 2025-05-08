/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import styled from "@emotion/styled";
import {
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    codeBlockPlugin, CodeToggle,
    CreateLink,
    headingsPlugin,
    InsertTable,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    ListsToggle,
    MDXEditor,
    quotePlugin,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
    UndoRedo
} from '@mdxeditor/editor';

interface MakrDownEditorProps {
    key: string;
    value: string;
    onChange: (value: string) => void;
    sx?: any;
}

function Separator() {
    return (
      <div
        data-orientation="vertical"
        aria-orientation="vertical"
        role="separator"
      />
    );
}

const StyledMDXEditor = styled(MDXEditor)<{ sx?: any }>`
    --baseBg: var(--vscode-badge-background);
    --basePageBg: var(--vscode-editorRuler-foreground);
    --baseBorderHover: var(--vscode-editor-inactiveSelectionBackground);
    --baseTextContrast: var(--vscode-editor-foreground);
    --baseBgActive: var(--vscode-breadcrumbPicker-background);
    --radius-medium: 0;
    --baseBorder: var(--vscode-list-hoverBackground);
    --baseBase: var(--vscode-editorWidget-foreground);
    --baseText: var(--vscode-editor-background);
    --spacing-1_5: 2px;
    --spacing-3: 0 15px;
    --radius-medium: none;
    color: var(--vscode-editor-foreground);
    background-color: var(--vscode-editor-background);
    border: 1px solid var(--vscode-list-hoverBackground);
    ${(props: MakrDownEditorProps) => props.sx};
`;
const ToolbarUR = styled(UndoRedo)`
    display: flex;
`;

export function MarkDownEditor(props: MakrDownEditorProps) {
    const { key, value, sx, onChange } = props;

    return (
        <StyledMDXEditor
            key={key}
            sx={sx}
            markdown={value || ""}
            onChange={onChange}
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                linkPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                codeBlockPlugin(),
                tablePlugin(),
                quotePlugin(),
                // diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
                linkDialogPlugin({}),
                tablePlugin(),
                toolbarPlugin({
                    toolbarContents: () => (
                        <>
                            <ToolbarUR />
                            <Separator />
                            <BoldItalicUnderlineToggles />
                            <CodeToggle />
                            <Separator />
                            <ListsToggle />
                            <Separator />
                            <BlockTypeSelect />
                            <Separator />
                            <CreateLink />
                            <InsertTable />
                        </>
                    )
                })
            ]}
        />
    );
}
