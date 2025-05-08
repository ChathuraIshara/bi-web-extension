/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export function formatForConfigurable(value: string): string {
    return `$config:${value}`;
}
  
export function removeConfigurableFormat(formattedValue: string): string {
    const prefix = "$config:";
    if (formattedValue.startsWith(prefix)) {
        return formattedValue.slice(prefix.length);
    }
    return formattedValue;
}

export function isConfigurable(value: string): boolean {
    const pattern = /^\$config:/;
    return pattern.test(value);
}

export function isCertificateFileName(value: string): boolean {
    const certificateExtension = ".crt";
    return value.endsWith(certificateExtension);
}

export function isValueExpression(stringValue: string): any {
    return stringValue != null && stringValue.startsWith('${') && stringValue.endsWith('}');
}

/**
 * Check whether to use the legacy expression editor or not.
 *
 * @param expressionType - The expression type.
 * @param isLegacyExpressionEnabled - Whether the enable legacy expression editor setting is checked.
 * @param field - The field object.
 * @returns - Whether to use the legacy expression editor or not.
 */
export function isLegacyExpression(
    expressionType: 'xpath/jsonPath' | 'synapse',
    isLegacyExpressionEnabled: boolean,
    field: any
): boolean {
    /* Check if for the expressionType field
     * If the field value is 'xPath/jsonPath' -> enable the legacy expression editor
     */
    if (expressionType === 'xpath/jsonPath') {
        return true;
    }

    /* If the legacy expression editor is enabled, return true */
    if (isLegacyExpressionEnabled) {
        return true;
    }

    /* If the field is wrapped in ${...} */
    const isExpression = field.value?.isExpression;
    const value = typeof field.value === 'object' ? field.value.value : field.value;
    if (isExpression && value?.length > 0 && (!value?.startsWith('${') || !value?.endsWith('}'))) {
        return true;
    }

    /* If non of the conditions are met -> enable the new expression editor */
    return false;
}
