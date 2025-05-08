/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as fs from "fs";
import * as path from "path";
import { Uri, extensions } from "vscode";
import { ext } from "./extensionVariables";
import { getLogger } from "./logger/logger";
import * as yaml from "js-yaml";

const SCHEMA = "choreo";

export async function registerYamlLanguageServer(): Promise<void> {
	try {
		const yamlExtension = extensions.getExtension("redhat.vscode-yaml");
		if (!yamlExtension) {
			return;
		}
		const yamlExtensionAPI = await yamlExtension.activate();
		const schemaBasePath = path.join(ext.context.extensionPath, "yaml-schemas");
		const schemas2 = {
			endpointsYaml: `${SCHEMA}://schema/endpoints`,
			componentConfigYaml: `${SCHEMA}://schema/component-config`,
			componentYamlInit: `${SCHEMA}://schema/component-init`,
			componentV1_0Yaml: `${SCHEMA}://schema/component-v1.0`,
			componentV1_1Yaml: `${SCHEMA}://schema/component-v1.1`,
			componentV1_2Yaml: `${SCHEMA}://schema/component-v1.2`
		}
		const schemasPaths = {
			[schemas2.endpointsYaml]: path.join(schemaBasePath, "endpoints-yaml-schema.json"),
			[schemas2.componentConfigYaml]: path.join(schemaBasePath, "component-config-yaml-schema.json"),
			[schemas2.componentYamlInit]: path.join(schemaBasePath, "component-yaml-schema-init.json"),
			[schemas2.componentV1_0Yaml]: path.join(schemaBasePath, "component-yaml-schema-1_0.json"),
			[schemas2.componentV1_1Yaml]: path.join(schemaBasePath, "component-yaml-schema-1_1.json"),
			[schemas2.componentV1_2Yaml]: path.join(schemaBasePath, "component-yaml-schema-1_2.json"),
		}

		function onRequestSchemaURI(resource: string): string | undefined {
			if(resource.endsWith(`.choreo/endpoints.yaml`)){
				return schemas2.endpointsYaml;
			}else if(resource.endsWith(`.choreo/component-config.yaml`)){
				return schemas2.componentConfigYaml;
			}else if(resource.endsWith(`.choreo/component.yaml`)){
				try{
					const filePath = Uri.parse(resource).fsPath;
					let parsedData: {schemaVersion?: number | string} = yaml.load(fs.readFileSync(filePath, "utf8")) as any;
					const schemaVersion = parsedData?.schemaVersion?.toString()
					if (schemaVersion === "1.0" || schemaVersion === "1"){
						return schemas2.componentV1_0Yaml
					}else if (schemaVersion === "1.1"){
						return schemas2.componentV1_1Yaml
					}else if (schemaVersion === "1.2"){
						return schemas2.componentV1_2Yaml
					}else{
						return schemas2.componentYamlInit
					}
				}catch{
					return schemas2.componentYamlInit
				}
			}
		}

		function onRequestSchemaContent(schemaUri: string): string | undefined {
			const parsedUri = Uri.parse(schemaUri);
			if (parsedUri.scheme === SCHEMA && schemasPaths[schemaUri]) {
				return fs.readFileSync(schemasPaths[schemaUri], "utf-8");
			}
		}

		yamlExtensionAPI.registerContributor(SCHEMA, onRequestSchemaURI, onRequestSchemaContent);
	} catch (err) {
		getLogger().error("Could not register YAML Language Server", err);
	}
}
