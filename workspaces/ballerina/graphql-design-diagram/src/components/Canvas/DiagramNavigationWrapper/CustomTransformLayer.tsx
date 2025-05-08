/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { CSSProperties } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { LayerModel } from '@projectstorm/react-canvas-core'

export interface TransformLayerWidgetProps {
    layer: LayerModel;
    isNodeFocused?: boolean;
}

// tslint:disable-next-line:no-namespace
namespace S {
    const shared = css`
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      position: absolute;
      pointer-events: none;
      transform-origin: 0 0;
      width: 100%;
      height: 100%;
      overflow: visible;
    `;

    export const DivLayer = styled.div`
      ${shared}
    `;

    export const SvgLayer = styled.svg`
      ${shared}
    `;
}

export class CustomTransformLayerWidget extends React.Component<React.PropsWithChildren<TransformLayerWidgetProps>> {

    constructor(props: TransformLayerWidgetProps) {
        super(props);
        this.state = {};

    }


    getTransform() {
        const model = this.props.layer.getParent();
        return `
			translate(
				${model.getOffsetX()}px,
				${model.getOffsetY()}px)
			scale(
				${model.getZoomLevel() / 100.0}
			)
  	`;
    }

    getTransformStyle(): CSSProperties {
        if (this.props.layer.getOptions().transformed) {
            if (!this.props.isNodeFocused) {
                return {
                    transform: this.getTransform()
                };
            }
            return {
                transform: this.getTransform(),
                transition: 'transform 0.5s ease-in-out'
            };

        }
        return {};
    }

    render() {
        if (this.props.layer.getOptions().isSvg) {
            return <S.SvgLayer style={this.getTransformStyle()}>{this.props.children}</S.SvgLayer>;
        }
        return <S.DivLayer style={this.getTransformStyle()}>{this.props.children}</S.DivLayer>;
    }
}
