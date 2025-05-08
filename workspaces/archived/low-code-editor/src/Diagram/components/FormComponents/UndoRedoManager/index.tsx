/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
export class UndoRedoManager {
    path: string;
    content: string;
    undoStack: Map<string, string[]>;
    redoStack: Map<string, string[]>;

    constructor() {
        this.undoStack = new Map();
        this.redoStack = new Map();
    }

    public updateContent(filePath: string, fileContent: string) {
        this.path = filePath;
        this.content = fileContent;
    }

    public undo() {
        if (this.undoStack.get(this.path)?.length) {
            const redoSourceStack = this.redoStack.get(this.path);
            if (!redoSourceStack) {
                this.redoStack.set(this.path, [this.content]);
            } else {
                redoSourceStack.push(this.content);
                if (redoSourceStack.length >= 100) {
                    redoSourceStack.shift();
                }
                this.redoStack.set(this.path, redoSourceStack);
            }
            const lastsource = this.undoStack.get(this.path).pop();
            this.updateContent(this.path, lastsource)
            return lastsource;
        }
    }

    public redo() {
        if (this.redoStack.get(this.path)?.length) {
            const undoSourceStack = this.undoStack.get(this.path);
            undoSourceStack.push(this.content);
            if (undoSourceStack.length >= 100) {
                undoSourceStack.shift();
            }
            this.undoStack.set(this.path, undoSourceStack);
            const lastUndoSource = this.redoStack.get(this.path).pop();
            this.updateContent(this.path, lastUndoSource)
            return lastUndoSource;
        }
    }

    public addModification(source: string) {
        const sourcestack = this.undoStack.get(this.path);
        if (!sourcestack) {
            this.undoStack.set(this.path, [this.content]);
        } else {
            sourcestack.push(this.content);
            if (sourcestack.length >= 100) {
                sourcestack.shift();
            }
            this.undoStack.set(this.path, sourcestack);
        }
        this.content = source;
    }

    public getFilePath() {
        return(this.path);
    }
}
