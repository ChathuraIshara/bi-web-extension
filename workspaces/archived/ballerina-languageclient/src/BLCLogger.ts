import { Logger } from 'vscode-languageserver-protocol'

export class BLCLogger implements Logger {

    error(_message: string): void {
        // do nothing;
    }
    warn(_message: string): void {
        // do nothing
    }
    info(_message: string): void {
        // do nothing
    }
    log(_message: string): void {
        // do nothing
    }
}
