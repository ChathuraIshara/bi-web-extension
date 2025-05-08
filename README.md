# Running the Web Extension

To run the web extension, follow these steps:

1. **Install Dependencies**:
   Make sure you have all the dependencies installed. Run the following command in the root of the workspace:
   ```bash
   rush install
   ```

2. **Build All Packages**:
   After installing dependencies, build all packages by running the following command:
   ```bash
   rush build
   ```

3. **Start the Web Extension**:
   Use the following command in the ballerina-extension directory to start the web extension in a browser-compatible environment:
   ```bash
   pnpm run start-web
   ```

6. **Access the Web Extension Locally**:
   After starting the web extension, it will run on `http://localhost:3000`. Open this URL in your browser to access the extension.

