/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
	ChoreoBuildPackNames,
	ChoreoImplementationType,
	ComponentDisplayType,
	type ComponentKind,
	getComponentKindRepoSource,
	getTypeForDisplayType,
} from "@wso2-enterprise/choreo-core";
import React, { type FC } from "react";
import { type IRightPanelSectionItem, RightPanelSection, RightPanelSectionItem } from "./RightPanelSection";

export const BuildConfigsSection: FC<{ component: ComponentKind }> = ({ component }) => {
	const buildConfigList = getBuildConfigViewList(component);

	return (
		<RightPanelSection title="Build Configurations">
			{buildConfigList.map((item) => (
				<RightPanelSectionItem key={item.label} {...item} />
			))}
		</RightPanelSection>
	);
};

const getBuildConfigViewList = (component: ComponentKind): IRightPanelSectionItem[] => {
	const buildConfigs: IRightPanelSectionItem[] = [];

	const componentBuildPack = getBuildpackForComponent(component);
	if (componentBuildPack) {
		buildConfigs.push({ label: "Build Pack", value: componentBuildPack });
	}

	const dirPath = getComponentKindRepoSource(component.spec.source)?.path;

	if (componentBuildPack !== ChoreoBuildPackNames.Docker && dirPath && dirPath !== ".") {
		buildConfigs.push({ label: "Subdirectory", value: dirPath });
	}

	if (
		[ChoreoBuildPackNames.Ballerina, ChoreoBuildPackNames.MicroIntegrator, ChoreoBuildPackNames.StaticFiles].includes(
			componentBuildPack as ChoreoBuildPackNames,
		)
	) {
		// do nothing
	} else if (componentBuildPack === ChoreoBuildPackNames.Docker) {
		buildConfigs.push({ label: "Docker Context", value: component.spec?.build?.docker?.dockerContextPath || "." });
		buildConfigs.push({ label: "Dockerfile path", value: component.spec?.build?.docker?.dockerFilePath });
		if (getTypeForDisplayType(component.spec.type) === "web-app") {
			buildConfigs.push({ label: "Port", value: component.spec?.build?.docker?.port });
		}
	} else if (component.spec?.type === ComponentDisplayType.ByocWebAppDockerLess) {
		buildConfigs.push({ label: "Build Command", value: component.spec?.build?.webapp?.buildCommand });
		buildConfigs.push({ label: "Node Version ", value: component.spec?.build?.webapp?.nodeVersion });
		buildConfigs.push({ label: "Output Directory", value: component.spec?.build?.webapp?.outputDir });
	} else {
		// Build pack type
		if (component.spec?.build?.buildpack?.version) {
			buildConfigs.push({ label: "Language Version", value: component.spec?.build?.buildpack?.version });
		}
		if (getTypeForDisplayType(component.spec.type) === "web-app" && component.spec?.build?.docker?.port) {
			buildConfigs.push({ label: "Port", value: component.spec?.build?.docker?.port });
		}
	}

	return buildConfigs;
};

const getBuildpackForComponent = (component: ComponentKind) => {
	let lang = "";
	if (component.spec.build?.buildpack?.language) {
		lang = component.spec.build?.buildpack?.language;
	} else if (component.spec.build?.docker?.dockerFilePath) {
		lang = ChoreoImplementationType.Docker;
	} else if (component.spec.build?.webapp?.type) {
		lang = component.spec.build?.webapp?.type;
	} else if (component.spec.build?.ballerina) {
		lang = ChoreoImplementationType.Ballerina;
	}
	// TODO: check mi and prism buildpacks as well

	return lang.toLowerCase();
};
