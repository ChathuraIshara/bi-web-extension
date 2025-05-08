/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import * as React from "react";

import ErrorScreen from "./Error";

export interface DataMapperErrorBoundaryProps {
    hasError: boolean;
    children?: React.ReactNode;
    onClose: () => void;
}

export class DataMapperErrorBoundaryC extends React.Component<DataMapperErrorBoundaryProps, { hasError: boolean }> {
    state = { hasError: false }

    static getDerivedStateFromProps(props: DataMapperErrorBoundaryProps, state: { hasError: boolean }) {
      // Only update from props if we're not in an error state
      if (!state.hasError) {
        return {
          hasError: props.hasError
        };
      }
      return null; // Don't update state if we're in an error state
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
      // tslint:disable: no-console
      console.error(error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return <ErrorScreen onClose={this.props.onClose} />;
      }
      return this.props?.children;
    }
}

export const DataMapperErrorBoundary = DataMapperErrorBoundaryC;
