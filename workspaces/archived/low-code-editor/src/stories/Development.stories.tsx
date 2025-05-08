import React from 'react';

import { storiesOf } from '@storybook/react';


import devProject from "./data/devproject.json";
import { DiagramGeneratorWrapper } from './DiagramGeneratorWrapper';
import { getDiagramGeneratorProps } from './story-utils';

const stories = storiesOf('Low Code Editor/Development/project', module);

devProject.balFiles.forEach((balFile: string) => {
  const relativePath = balFile.substring(devProject.projectPath.length);
  stories.add(
    relativePath,
    () => {
      const diagramProps = getDiagramGeneratorProps(balFile);
      return <DiagramGeneratorWrapper {...diagramProps} />
    }
  )
});
