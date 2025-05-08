/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Icon } from "@wso2-enterprise/ui-toolkit";
import React from "react";

interface ConnectionIconProps {
    url: string;
    fallbackIcon: React.ReactNode;
    className?: string;
    alt?: string;
}

const ConnectionIcon = (props: ConnectionIconProps) => {
    const { url, fallbackIcon, className, alt } = props;
    const [imageError, setImageError] = React.useState(false);

    // use custom icon for http
    if (url.includes("ballerina_http_")) {
        return <Icon name="bi-globe" sx={{ width: 24, height: 24, fontSize: 24 }} />;
    }

    if (url && isValidUrl(url) && !imageError) {
        return (
            <img 
                src={url} 
                alt={alt} 
                className={className}
                onError={() => setImageError(true)} 
            />
        );
    }

    return <div className={className}>{fallbackIcon}</div>;
};

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

export default ConnectionIcon;
