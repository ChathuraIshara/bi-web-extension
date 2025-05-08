import React from 'react';

import { storiesOf } from '@storybook/react';

import balDist from "./data/baldist.json";
import bbesList from "./data/bbes.json";
import { DiagramGeneratorWrapper } from './DiagramGeneratorWrapper';
import { getDiagramGeneratorProps } from './story-utils';

function getBBEFilePath(bbeID: string) {
  return balDist.balHome + "/examples/"  + bbeID + "/" + bbeID.replaceAll('-', '_') + ".bal";
}

export interface BBESample {
  name: string;
  url: string;
}

export interface BBE {
  title: string;
  samples: BBESample[];
}

bbesList.forEach((bbe: BBE)  => {
  const stories = storiesOf('Low Code Editor/Testing/BBEs/' + bbe.title, module);
  bbe.samples.forEach((bbeItem) => {
    stories.add(
      bbeItem.name,
      () => {
        const diagramProps = getDiagramGeneratorProps(getBBEFilePath(bbeItem.url));
        return <DiagramGeneratorWrapper {...diagramProps} />
      }
    )
  });
});

