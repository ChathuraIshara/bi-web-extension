const { startLS, startVSCodeMockServer, startStoryBook } = require("./storybook-utils");

startLS();
startVSCodeMockServer();
setTimeout(() => startStoryBook(), 4000);
