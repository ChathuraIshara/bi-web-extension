import { Resource } from "../Diagram/components/FormComponents/Utils/ApiConfigureWizard/types";
import {
    convertReturnTypeStringToSegments,
    returnTypes
} from "../Diagram/components/FormComponents/Utils/ApiConfigureWizard/util";
import { keywords } from "../Diagram/components/Portals/utils/constants";


export function isPathDuplicated(resources: Resource[]): boolean {
    const resourceSignatures: string[] = [];
    let isDuplicated = false;
    resources.forEach((res: any) => {
        // Validate method signature
        if (res.method) {
            const signature: string = `${res.method.toLocaleLowerCase()}_${res.path}`;
            if (resourceSignatures.includes(signature)) {
                isDuplicated = true;
            } else {
                resourceSignatures.push(signature);
            }
        }
    });
    return isDuplicated;
}

export function isServicePathValid(servicePath: string): boolean {
    const servicePathRegex = /^\/?[\S\w-\/]+$/g;
    return servicePath === "" || servicePathRegex.test(servicePath);
}

export function isKeywords(word: string): boolean {
    return keywords.includes(word);
}

export function isValidBallerinaIdentifier(word: string): boolean {
    if (word.startsWith("'")) {
        const splitedWord = word.split("'");
        if (splitedWord && splitedWord[splitedWord.length - 1]) {
            return (/^[a-zA-Z0-9]+$/g.test(word)) && !isKeywords(word);
        } else {
            return false;
        }
    } else {
        return (/^[a-zA-Z0-9]+$/g.test(word)) && !isKeywords(word);
    }
}

export function validateReturnType(text: string) {
    if (!text) {
        return true;
    } else {
        const returnSegments = convertReturnTypeStringToSegments(text);
        if (returnSegments.length === 0) {
            return false;
        }
        let allSegmentsValid = true;
        returnSegments.forEach(segment => {
            allSegmentsValid = returnTypes.includes(segment.type);
        })
        return allSegmentsValid;
    }
}

export function reCalculateDuplicatedResources(resources: Resource[]) {
    const resourceSignatures: string[] = [];
    resources.forEach((res: Resource) => {
        // Validate method signature
        const signature: string = `${res.method.toLowerCase()}_${res.path}`;
        if (resourceSignatures.includes(signature)) {
            res.isPathDuplicated = true;
        } else {
            res.isPathDuplicated = false;
            resourceSignatures.push(signature);
        }
    });
}
