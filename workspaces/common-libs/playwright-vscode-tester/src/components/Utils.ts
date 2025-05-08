/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Frame, Locator, Page, expect } from "@playwright/test";

export async function switchToIFrame(
    frameName: string,
    page: Page,
    timeout: number = 150000
): Promise<Frame | null> {
    await page.waitForTimeout(5000); // To fix intermittent issues in CI
    const webviewFrame = await page.waitForSelector('iframe.webview.ready', { timeout });
    const frame = await webviewFrame.contentFrame();
    if (!frame) {
        throw new Error(`IFrame of ${frameName} not found`);
    }
    await frame.waitForLoadState();
    const targetFrame = await frame.waitForSelector(`iframe[title="${frameName}"]`, { timeout });
    if (!targetFrame) {
        throw new Error(`IFrame of ${frameName} not found`);
    }
    const childFrame = await targetFrame.contentFrame();
    await childFrame?.waitForLoadState();
    return childFrame;
}

export async function getVsCodeButton(container: Locator, text: string, type: 'primary' | 'secondary'): Promise<Locator> {
    const btn = container.locator(`vscode-button:has-text("${text}")`);
    await btn.waitFor();
    expect(await btn.getAttribute('appearance')).toBe(type);
    return btn;
}

export async function getWebviewInput(container: Locator, label: string): Promise<Locator> {
    const input = container.locator(`input[aria-label="${label}"]`);
    await input.waitFor();
    return input;
}
