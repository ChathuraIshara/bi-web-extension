/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Typography } from '@wso2-enterprise/ui-toolkit';
import styled from "@emotion/styled";
import { Info as I } from '../../../Definitions/ServiceDefinitions';
import ReactMarkdown from 'react-markdown';
import { ReadOnlyContact } from '../Contact/ReadOnlyContact';
import { ReadOnlyLicense } from '../License/ReadOnlyLisense';
import { css, cx } from '@emotion/css';

export const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const DescriptionWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Markdown = cx(css`
    /* add paragraph styles */
    p {
        margin: 0;
    }
`);


interface MarkdownRendererProps {
    markdownContent: string;
    className?: string;
}
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdownContent, className }) => {
    return <ReactMarkdown className={className ? className : Markdown}>{markdownContent}</ReactMarkdown>;
};

interface ReadOnlyInfoProps {
    info: I;
}

// Title, Vesrion are mandatory fields
export function ReadOnlyInfo(props: ReadOnlyInfoProps) {
    const { info } = props;

    return (
        <>
            {info?.title && (
                <>
                    <Typography sx={{ margin: 0 }} variant="h3">Title</Typography>
                    <Typography sx={{ margin: 0, fontWeight: "lighter" }} variant='body3'>{info?.title}</Typography>
                </>
            )}
            {info?.version && (
                <>
                    <Typography sx={{ margin: 0 }} variant="h3">Version</Typography>
                    <Typography sx={{ margin: 0, fontWeight: "lighter" }} variant='body3'>{info?.version}</Typography>
                </>
            )}
            {info?.summary && (
                <>
                    <Typography sx={{ margin: 0 }} variant="h3">Summary</Typography>
                    <Typography sx={{ margin: 0, fontWeight: "lighter" }} variant='body3'>{info?.summary}</Typography>
                </>
            )}
            {info?.description && (
                <DescriptionWrapper>
                    <Typography sx={{ margin: "0 0 10px 0" }} variant='h3'> Description </Typography>
                    <Typography sx={{ margin: 0, fontWeight: "lighter" }} variant='body3'>
                        <MarkdownRenderer key="description" markdownContent={info?.description} />
                    </Typography>
                </DescriptionWrapper>
            )}
            {info?.contact && (
                <ReadOnlyContact
                    contact={info.contact}
                />
            )}
            {info?.license && (
                <ReadOnlyLicense
                    license={info.license}
                />
            )}
        </>
    )
}
