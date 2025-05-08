import * as React from 'react';
import ReactDOM from 'react-dom';

export const LinkOverayContainerID = "data-mapper-link-overlay-container";

export const LinkOveryPortal: React.FC<{}> = (props) => {
    const container = document.getElementById(LinkOverayContainerID);
    return container !== null ? ReactDOM.createPortal(props.children, container) : <></>;
}
