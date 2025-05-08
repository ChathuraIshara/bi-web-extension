const { spawn, execSync } = require("child_process");
var glob = require( 'glob' );  
const { cp, writeFile, existsSync, writeFileSync } = require("fs");
const path = require("path");

module.exports.copyBBEJson =  function copyBBEJson() {
    const storyDataDir = path.join(__dirname, "..", "src", "stories", "data");
    const balHome = execSync("bal home").toString().trim();
    const projectPath = path.join(__dirname, "..", "..");
    cp(
        path.join(balHome, "examples", "index.json"),
        path.join(storyDataDir, "bbes.json"),
        { force: true },
        (err) => err ? console.log("BBE copy error: " + err ) : console.log("BBE copy successful")
    );
    writeFile(path.join(storyDataDir, "baldist.json"),
`
{
    "balHome": "${balHome}",
    "projectRoot": "${projectPath}"
}
`    ,
    (err) => err ? console.log("dist json make error: " + err ) : console.log("dist json make successful")
    )
}


module.exports.setupDevBalProject = function setupDevBalProject() {
    const storyDataDir = path.join(__dirname, "..", "src", "stories", "data");
    let devProjectFolder = path.join(storyDataDir, "project");
    if (process.env.LOW_CODE_DEV_PROJECT_PATH) {
        devProjectFolder = process.env.LOW_CODE_DEV_PROJECT_PATH;
        console.log("Dev Project Path is set via env var LOW_CODE_DEV_PROJECT_PATH. Path: " + devProjectFolder)
    } else {
        console.log("Using default dev project path. Override using LOW_CODE_DEV_PROJECT_PATH env var.")
    }
    if (existsSync(devProjectFolder)) {
        console.log("Development project alreay exists at " + devProjectFolder)
    } else {
        const projectName = path.parse(devProjectFolder).name;
        const cwd = path.resolve(path.parse(devProjectFolder).dir);
        console.log(cwd)
        const balNewOutput = execSync("bal new " + projectName, { cwd }).toString().trim();
        if (balNewOutput.startsWith("Created new")) {
            console.log("Initialized new Ballerina Project at " + devProjectFolder)
        } else {
            console.log("Unable to initialize new Ballerina project at " + devProjectFolder)
        }
    }

    glob(path.join(devProjectFolder, '**/*.bal'), function( err, files ) {
        if (err) {
            console.log("Error while analyzing development project. ", err)
            return
        }
        writeFile(path.join(storyDataDir, "devproject.json"),
`
{
    "projectPath": "${devProjectFolder}/",
    "balFiles": ${JSON.stringify(files)}
}
`    ,
    (err) => err ? console.log("dev project json make error: " + err ) : console.log("dev project json make successful")
    )
    });
    
}


module.exports.setupTestBalProject = function setupTestBalProject() {
    const testProjectFolder = path.join(__dirname, "..", "..", "low-code-integration-tests", "bal-project");
    const storyDataDir = path.join(__dirname, "..", "src", "stories", "data");

    if (existsSync(testProjectFolder)) {
        console.log("Integration Test project found at " + testProjectFolder)
    } else {
        console.error("Cannot find integration test project at " + testProjectFolder)
        return
    }


    glob(path.join(testProjectFolder, '**/*.bal'), function( err, files ) {
        if (err) {
            console.log("Error while analyzing integration test project. ", err)
            return
        }
        writeFile(path.join(storyDataDir, "testproject.json"),
`
{
    "projectPath": "${testProjectFolder}/",
    "balFiles": ${JSON.stringify(files)}
}
`    ,
    (err) => err ? console.log("test project json make error: " + err ) : console.log("test project json make successful")
    )
    });
    
}


module.exports.startLS = function startLS() {
    const ls = spawn('npx', ['start-ws-lang-server']);

    ls.stdout.on('data', (data) => {
        console.log(`lang-server:stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
        console.error(`lang-server:stderr: ${data}`);
    });

    ls.on('close', (code) => {
     console.log(`lang-server:process exited with code ${code}`);
    });
}


module.exports.startVSCodeMockServer = function startVSCodeMockServer() {
    const vs = spawn('node', ['../low-code-integration-tests/tools/vscode-mock-server.js']);

    vs.stdout.on('data', (data) => {
        console.log(`vs-mock-server:stdout: ${data}`);
    });

    vs.stderr.on('data', (data) => {
        console.error(`vs-mock-server:stderr: ${data}`);
    });

    vs.on('close', (code) => {
     console.log(`vs-mock-server:process exited with code ${code}`);
    });
}


module.exports.startStoryBook = function startStoryBook() {
    const sb = spawn('npx', ['start-storybook', '-p', '6006']);

    sb.stdout.on('data', (data) => {
        console.log(`storybook: ${data}`);
    });

    sb.stderr.on('data', (data) => {
        if (!data.includes("webpack.Progress") && !data.includes("webpack-dev-middleware")) {
            console.log(`storybook: ${data}`);
        }
    });

    sb.on('close', (code) => {
        console.log(`storybook:process exited with code ${code}`);
    });
}
