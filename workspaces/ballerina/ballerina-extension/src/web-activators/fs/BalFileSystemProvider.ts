import * as vscode from 'vscode';
import { File } from "@wso2-enterprise/ballerina-core";
import { SERVER_BASE_URL } from '../constants/constants';

const FS_BASE_URL = `${SERVER_BASE_URL}/fs`;
const header = {
	"Content-Type": "application/json"
};

export class BalFileSystemProvider implements vscode.FileSystemProvider {

	private _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
	readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this._emitter.event;

	async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
		console.log("stat: ", uri.toString());
		const pathSegments = uri.path.split("/").filter(segment => segment.length > 0);

		if (pathSegments.length === 2) {
			console.log("Starting to clone repository...");
			const cloneResponse = await fetch(`${FS_BASE_URL}/clone${uri.path}`);
			if (!cloneResponse.ok) {
				vscode.window.showErrorMessage(`Failed to clone repository: ${uri.path}`);
				console.log(`Failed to clone repository: ${cloneResponse.statusText}`);
				throw new Error('Failed to fetch clone repository');
			}
			// vscode.window.showInformationMessage(`Repository cloned successfully: ${uri.path}`);
			console.log("Clone success:", cloneResponse.status);
		}

		const statInfo = await fetch(`${FS_BASE_URL}/stat?url=${uri.path}&scheme=${uri.scheme}`);
		console.log("sending request to: ", `${FS_BASE_URL}/stat?url=${uri.path}&scheme=${uri.scheme}`);
		if (statInfo.status === 404) {
			throw vscode.FileSystemError.FileNotFound(uri);
		} else if (!statInfo.ok) {
			console.log(`Failed to fetch repo stats: ${statInfo.statusText}`);
			throw new Error('Failed to fetch repo stats');
		}
		const data = await statInfo.json();
		console.log(data);
		return { type: data.isDirectory ? vscode.FileType.Directory : vscode.FileType.File, ctime: 0, mtime: 0, size: data.size };
	}

	async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
		console.log("read directory: ", uri.path);

		const directoryInfo = await fetch(`${FS_BASE_URL}/read?url=${uri.path}&scheme=${uri.scheme}`);
		console.log("sending request to: ", `${FS_BASE_URL}/read?url=${uri.path}&scheme=${uri.scheme}`);
		if (!directoryInfo.ok) {
			console.log(`Failed to fetch repo contents: ${directoryInfo.statusText}`);
			return [];
		}

		const files = await directoryInfo.json();
		console.log("Repo files:", files);
		const children = files.map((file: { name: string; isDirectory: boolean }) => {
			return [file.name, file.isDirectory ? vscode.FileType.Directory : vscode.FileType.File];
		});

		return children;
	}

	async readWorkspaceFiles(uri: vscode.Uri): Promise<File[]> {
		console.log("read workspace files: ", uri.path);

		const directoryInfo = await fetch(`${FS_BASE_URL}/readbal?url=${uri.path}&scheme=${uri.scheme}`);
		console.log("sending request to: ", `${FS_BASE_URL}/readbal?url=${uri.path}&scheme=${uri.scheme}`);
		if (!directoryInfo.ok) {
			console.log(`Failed to fetch work files: ${directoryInfo.statusText}`);
			return [];
		}

		const files = await directoryInfo.json();
		console.log("Workspace files:", files);
		return files;
	}

	async readFile(uri: vscode.Uri): Promise<Uint8Array> {
		console.log("readFile: ", uri.path);
		const fileContent = await fetch(`${FS_BASE_URL}/read?url=${uri.path}&scheme=${uri.scheme}`);
		console.log("sending request to: ", `${FS_BASE_URL}/read?url=${uri.path}&scheme=${uri.scheme}`);
		if (!fileContent.ok) {
			console.log(`Failed to fetch file content: ${fileContent.statusText}`);
			throw new Error('Failed to fetch file content');
		}
		const data = await fileContent.text();
		console.log(`${uri.path} read successfully!`);
		return new TextEncoder().encode(data);
	}

	async writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean }): Promise<void> {
		console.log("writeFile: ", uri.toString(), " ", options);

		const response = await fetch(`${FS_BASE_URL}/write?url=${uri.path}`, {
			method: "POST",
			headers: header,
			body: JSON.stringify({
				content: new TextDecoder().decode(content)   
			})
		});
		console.log("sending request to: ", `${FS_BASE_URL}/write?url=${uri.path}`);
		if (!response.ok) {
			console.log(`Failed to write to the file: ${response.statusText}`);
			throw new Error('Failed to write to the file');
		}
		const data = await response.text();
		console.log(data);
		this._emitter.fire([{ type: vscode.FileChangeType.Created, uri }]);
	}

	async delete(uri: vscode.Uri): Promise<void> {
		console.log("Attempting to delete: ", uri.path);

		const response = await fetch(`${FS_BASE_URL}/remove?url=${uri.path}`, {
			method: "DELETE",
			headers: header
		});
		console.log("sending request to: ", `${FS_BASE_URL}/remove?url=${uri.path}`);
		if (!response.ok) {
			console.log(`Failed to remove the file: ${response.statusText}`);
			throw new Error('Failed to remove the file');
		}
		const data = await response.text();
		console.log(data);
		this._emitter.fire([{ type: vscode.FileChangeType.Deleted, uri }]);
	}

	async createDirectory(uri: vscode.Uri): Promise<void> {
		console.log("creating directory: ", uri.path);
		const response = await fetch(`${FS_BASE_URL}/mkdir?url=${uri.path}`, {
			method: "POST",
			headers: header
		});
		console.log("sending request to: ", `${FS_BASE_URL}/mkdir?url=${uri.path}`);
		if (!response.ok) {
			console.log(`Failed to create file: ${response.statusText}`);
			throw new Error('Failed to create file');
		}
		const data = await response.text();
		console.log(data);
		this._emitter.fire([{ type: vscode.FileChangeType.Created, uri }]);
	}

	async rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): Promise<void> {
		console.log("creating directory: ", oldUri.path);
		const response = await fetch(`${FS_BASE_URL}/rename?oldUrl=${oldUri.path}&newUrl=${newUri.path}`, {
			method: "POST",
			headers: header
		});
		console.log("sending request to: ", `${FS_BASE_URL}/rename?oldUrl=${oldUri.path}&newUrl=${newUri.path}`);
		if (!response.ok) {
			console.log(`Failed to rename: ${response.statusText}`);
			throw new Error('Failed to rename');
		}
		const data = await response.text();
		console.log(data);
		this._emitter.fire([
			{ type: vscode.FileChangeType.Deleted, uri: oldUri },
			{ type: vscode.FileChangeType.Created, uri: newUri }
		]);
	}

	watch(uri: vscode.Uri, options: { recursive: boolean, excludes: string[] }): vscode.Disposable {
		return new vscode.Disposable(() => { });
	}

	async copy(source: vscode.Uri, destination: vscode.Uri, options: { overwrite: boolean }): Promise<void> {		console.log("copying: ", source, destination, options);

		const response = await fetch(`${FS_BASE_URL}/copy`, {
			method: "POST",
			headers: header,
			body: JSON.stringify({
				source: source.path,
				destination: destination.path,
				overwright: options.overwrite
			})
		});
		console.log("sending request to: ", `${FS_BASE_URL}/copy`);
		if (!response.ok) {
			console.log(`Failed to copy: ${response.statusText}`);
			throw new Error('Failed to copy');
		}
		const data = await response.text();
		console.log(data);
		this._emitter.fire([
			{ type: vscode.FileChangeType.Created, uri: destination },
			{ type: vscode.FileChangeType.Changed, uri: source }
		]);
	}

	// async isExists(uri: vscode.Uri): Promise<{ exists: boolean; isDirectory: boolean }> {
    //     console.log("isExists: ", uri.path);
    //     const response = await fetch(`${FS_BASE_URL}/exists?url=${uri.path}&scheme=${uri.scheme}`);
    //     console.log("Sending request to: ", `${FS_BASE_URL}/exists?url=${uri.path}&scheme=${uri.scheme}`);

    //     if (!response.ok) {
    //         console.log(`Failed to check file existence: ${response.statusText}`);
    //         throw new Error('Failed to check file existence');
    //     }

    //     const result = await response.json();
    //     console.log(`Existence check result for ${uri.path}: `, result);

    //     return result; 
    // }

}
