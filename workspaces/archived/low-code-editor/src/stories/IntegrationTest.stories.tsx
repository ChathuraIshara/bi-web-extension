import React from 'react';

import { storiesOf } from '@storybook/react';

import testProject from "./data/testproject.json";
import { DiagramGeneratorWrapper } from './DiagramGeneratorWrapper';
import { getDiagramGeneratorProps } from './story-utils';

const stories = storiesOf('Low Code Editor/IntegrationTest/project', module);

testProject.balFiles.forEach((balFile: string) => {
  const relativePath = balFile.substring(testProject.projectPath.length);
  stories.add(
    relativePath,
    () => {
      const diagramProps = getDiagramGeneratorProps(balFile);
      return <DiagramGeneratorWrapper {...diagramProps} />
    }
  )
});
