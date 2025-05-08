import React, { useEffect } from 'react';

import { DiagramGeneratorWrapper } from './DiagramGeneratorWrapper';
import { getDiagramGeneratorProps } from './story-utils';


export function StandaloneDiagramApp() {

    const [filePath, setFilePath] = React.useState<string>(undefined);
    const [enableSave, setEnableSave] = React.useState<boolean>(false);

    useEffect(() => {
        const params = new URLSearchParams(document.location.search);
        const path = params.get("filePath");
        if (path) {
            const pathDecoded = decodeURIComponent(path);
            setFilePath(pathDecoded);
        }
    }, [])

    if (!filePath) {
        return <>Please provide a valid file path via filePath query param...</>
    }

    const diagramProps = getDiagramGeneratorProps(filePath, enableSave);


    return <DiagramGeneratorWrapper {...diagramProps} />;

}
