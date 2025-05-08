import { BalleriaLanguageClient } from '../index';
import { file } from '../messages';
import { WSConnection } from '../WSConnection';
import { startBallerinaLS } from '../server';

describe('Test Websocket Ballerina Language Client Load', () => {
    let bls: BalleriaLanguageClient;
    let wsServer;
    const mainFile = __dirname + '/resources/myPackage/main.bal';

    beforeAll(() => {
        startBallerinaLS();
        return WSConnection.initialize("ws://localhost:9095").then((wsConnection: WSConnection) => {
            bls = new BalleriaLanguageClient(wsConnection);
        });
    });

    test('Open a file', () => {
        return bls.onReady().then(() => {
            return bls.didOpen(mainFile);
        });
    });

    test('Test Syntax Tree', () => {
        return bls.onReady().then(() => {
            return bls.getSyntaxTree({
                documentIdentifier: {
                    uri: file(mainFile)
                }
            })
        }).then((response) => {
            expect(response).toHaveProperty('syntaxTree');
        });
    });

    afterAll(() => {
        return bls.onReady().then(() => {
            return bls.stop();
        }).catch((e) => {
            console.log(e);
        });
    });


});
