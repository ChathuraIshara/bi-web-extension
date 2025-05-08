/*
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
		console.log("RPC path: ", rpcPath);

		if (!fs.existsSync(rpcPath)) {
			return resolve(false);
		}

		const process = exec(`"${rpcPath}" --version`, (error) => {
			if (error) {
				console.error("error", error);
				fs.rmSync(rpcPath);
				resolve(false);
			} else {
				resolve(true);
			}
		});

		const timeout = setTimeout(() => {
			process.kill(); // Kill the process if it exceeds 5 seconds
			console.error("Timeout: Process took too long");
			fs.rmSync(rpcPath);
			console.error("Delete RPC path and try again", rpcPath);
			resolve(false);
		}, 5000);

		process.on("exit", () => clearTimeout(timeout));
	});
}

export async function initRPCServer() {
	const installed = await isChoreoCliInstalled();
	if (!installed) {
		console.log(`WSO2 Platform RPC version ${getCliVersion()} not installed`);
		await downloadCLI();
	}

	await RPCClient.getInstance();
}
