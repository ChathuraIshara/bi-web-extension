import * as React from "react";

import ErrorScreen from "./Error";

export class DiagramErrorBoundaryC extends React.Component<{}, { hasError: boolean }> {
    state = { hasError: false }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
      // tslint:disable: no-console
      console.error(error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return <ErrorScreen />;
      }
      return this.props.children;
    }
}

export const DiagramErrorBoundary = DiagramErrorBoundaryC;
