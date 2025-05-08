/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { exec } from "child_process";
import * as fs from "fs";
import { downloadCLI, getChoreoExecPath, getCliVersion } from "./cli-install";
import { RPCClient } from "./client";

function isChoreoCliInstalled(): Promise<boolean> {
	return new Promise((resolve) => {
		const rpcPath = getChoreoExecPath();
		if (fs.existsSync(rpcPath)) {
			exec(`"${rpcPath}" --version`, (error) => {
				console.log("error", error);
				if (error) {
					resolve(false);
				} else {
					resolve(true);
				}
			});
		} else {
			resolve(false);
		}
	});
}

export async function initRPCServer() {
	const installed = await isChoreoCliInstalled();
	if (!installed) {
		console.log(`Choreo RPC version ${getCliVersion()} not installed`);
		await downloadCLI();
	}

	await RPCClient.getInstance();
}
