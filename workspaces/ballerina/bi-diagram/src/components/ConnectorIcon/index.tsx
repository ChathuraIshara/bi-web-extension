/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { CSSProperties } from "react";
import { ApiIcon, DatabaseIcon, HttpIcon } from "../../resources";
import { FlowNode } from "../../utils/types";
import { Icon } from "@wso2-enterprise/ui-toolkit";

interface ConnectorIconProps {
    node?: FlowNode;
    url?: string;
    fallbackIcon?: React.ReactNode;
    style?: CSSProperties; // Custom style for images
    iconStyle?: CSSProperties; // Custom style for icons
    className?: string;
}

export function ConnectorIcon(props: ConnectorIconProps): React.ReactElement {
    const { node, url, fallbackIcon, style, iconStyle, className } = props;
    const [imageError, setImageError] = React.useState(false);

    // Default styles for images
    const defaultImageStyle: CSSProperties = {
        width: "24px"
    };

    // Merge default styles with custom styles
    const mergedImageStyle: CSSProperties = {
        ...defaultImageStyle,
        ...style
    };

    // Default styles for icons
    const defaultIconStyle: CSSProperties = {};

    // Merge default icon styles with custom icon styles
    const mergedIconStyle: CSSProperties = {
        ...defaultIconStyle,
        ...iconStyle
    };

    if (url && isValidUrl(url) && !imageError) {
        return (
            <img 
                src={url} 
                style={mergedImageStyle} 
                className={className}
                onError={() => setImageError(true)} 
            />
        );
    } else if (url && fallbackIcon) {
        return <div style={mergedIconStyle} className={className}>{fallbackIcon}</div>;
    }

     // use custom icon for http
     if (node?.metadata?.icon && node?.metadata?.icon.includes("ballerina_http_")) {
        return <div style={mergedIconStyle} className={className}><Icon name="bi-globe" sx={{ width: 24, height: 24, fontSize: 24 }} /></div>;
    }

    const databaseClients = ["mysql", "postgres", "sqlite", "mssql", "oracle", "redis", "cassandra", "mongodb"];
    if (node?.metadata?.icon && isValidUrl(node.metadata.icon) && !imageError) {
        return (
            <img
                src={node.metadata.icon}
                alt={node.codedata.module}
                style={mergedImageStyle}
                className={className}
                onError={() => setImageError(true)}
            />
        );
    }

    if (fallbackIcon && imageError) {
        return <div style={mergedIconStyle} className={className}>{fallbackIcon}</div>;
    }

    if (node?.codedata?.module && databaseClients.includes(node.codedata.module)) {
        return <div style={mergedIconStyle} className={className}><DatabaseIcon /></div>;
    }
    if (node?.codedata?.module === "http") {
        return <div style={mergedIconStyle} className={className}><HttpIcon /></div>;
    }

    return <div style={mergedIconStyle} className={className}><ApiIcon /></div>;
}

export default ConnectorIcon;

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}
