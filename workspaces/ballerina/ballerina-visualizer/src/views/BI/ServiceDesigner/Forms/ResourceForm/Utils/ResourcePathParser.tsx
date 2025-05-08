/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js

export interface ParseError {
    position: number;
    message: string;
}

export interface SegmentParam {
    type: 'param' | 'rest-param' | 'const-param';
    annots: string[];
    typeDescriptor: string;
    paramName?: string;
    start: number;
    end: number;
}

export interface ParseResult {
    valid: boolean;
    errors: ParseError[];
    segments: Array<
        | { type: 'dot'; start: number; end: number }
        | { type: 'segment'; value: string; start: number; end: number }
        | SegmentParam
    >;
}

export function parseResourcePath(input: string): ParseResult {
    const result: ParseResult = {
        valid: false,
        errors: [],
        segments: []
    };

    if (!input || input === '') {
        result.valid = false;
        result.errors.push({ position: 0, message: 'path cannot be empty' });
        return result;
    }

    if (input === '.') {
        result.segments.push({ type: 'dot', start: 0, end: 0 });
        result.valid = result.errors.length === 0;
        if (!result.valid) {
            result.errors.push({ position: 0, message: 'cannot have charcaters after dot (.)' });
        }
        return result;
    }

    if (input.includes('//')) {
        result.errors.push({ position: 0, message: 'cannot have two consecutive slashes (//)' });
        return result;
    }

    const segments = splitSegments(input);
    for (const segment of segments) {
        if (segment.value.startsWith('[') || segment.value.endsWith(']')) {
            processParam(segment, result);
        } else {
            processSegment(segment, result);
        }
    }

    result.valid = result.errors.length === 0;
    return result;
}

function processSegment(
    segment: { value: string; start: number; end: number },
    result: ParseResult
) {
    const tokenResult = tokenize(segment.value, segment.start);
    result.errors.push(...tokenResult.errors);
    
    if (tokenResult.tokens.length !== 1) {
        result.errors.push({
            position: segment.start,
            message: `Invalid segment: ${segment.value}`
        });
        return;
    }

    result.segments.push({
        type: 'segment',
        value: segment.value,
        start: segment.start,
        end: segment.end
    });
}

function processParam(
    segment: { value: string; start: number; end: number },
    result: ParseResult
) {
    const content = segment.value.slice(1, -1);

    // split the content by spaces
    const tokens = content.split(/\s+/);
    let typeDescriptor = '';
    let paramName = '';
    if (tokens.length > 0) {
        typeDescriptor = tokens[0];
    }
    if (tokens.length > 1) {
        let paramNameStr = tokens[tokens.length - 1];
        if (!paramNameStr.startsWith('...')) {
            paramName = paramNameStr;
            let paramToken = { value: paramName, start: segment.start + 1, end: segment.end - 1 };
            validateParamName(paramToken, result);
        }
    }
    
    result.segments.push({
        type: 'param',
        annots: [],
        typeDescriptor,
        paramName,
        start: segment.start,
        end: segment.end
    });
}

function handleRegularParam(
    tokens: Token[],
    segment: { start: number; end: number },
    result: ParseResult
) {
    if (tokens.length === 0) {
        result.errors.push({
            position: segment.start + 2,
            message: 'Empty parameter'
        });
        return;
    }

    const paramName = validateParamName(tokens[tokens.length - 1], result);
    const remaining = tokens.slice(0, -1);
    
    if (remaining.length === 0) {
        result.errors.push({
            position: segment.start + 2,
            message: 'Missing type descriptor'
        });
        return;
    }

    const typeDescriptor = remaining[remaining.length - 1].value;
    const annots = remaining.slice(0, -1).map(t => t.value);

    result.segments.push({
        type: 'param',
        annots,
        typeDescriptor,
        paramName,
        start: segment.start,
        end: segment.end
    });
}

function handleRestParam(
    tokens: Token[],
    segment: { start: number; end: number },
    result: ParseResult
) {
    const dotIndex = tokens.findIndex(t => t.value === '...');
    if (dotIndex === -1) return;

    const beforeDot = tokens.slice(0, dotIndex);
    const afterDot = tokens.slice(dotIndex + 1);

    if (beforeDot.length === 0) {
        result.errors.push({
            position: segment.start + 2,
            message: 'Missing type descriptor in rest parameter'
        });
    }

    if (afterDot.length > 1) {
        result.errors.push({
            position: afterDot[1].start,
            message: 'Extra tokens after rest parameter'
        });
    }

    const typeDescriptor = beforeDot.length > 0 ? beforeDot[beforeDot.length - 1].value : '';
    const annots = beforeDot.slice(0, -1).map(t => t.value);
    const paramName = afterDot.length > 0 ? validateParamName(afterDot[0], result) : undefined;

    result.segments.push({
        type: 'rest-param',
        annots,
        typeDescriptor,
        paramName,
        start: segment.start,
        end: segment.end
    });
}

function validateParamName(token: Token, result: ParseResult): string | undefined {
    if (!token) return undefined;
    if (!isValidIdentifier(token.value)) {
        result.errors.push({
            position: token.start,
            message: `Invalid parameter name: ${token.value}`
        });
    }
    return token.value;
}

// Helper functions and tokenization implementation

interface Token {
    value: string;
    start: number;
    end: number;
}

function splitSegments(input: string): Array<{ value: string; start: number; end: number }> {
    const segments = [];
    let start = 0;
    let current = 0;
    
    while (current < input.length) {
        if (input[current] === '/') {
            if (start !== current) {
                segments.push({
                    value: input.substring(start, current),
                    start,
                    end: current - 1
                });
            }
            start = current + 1;
        }
        current++;
    }
    
    if (start < current) {
        segments.push({
            value: input.substring(start, current),
            start,
            end: current - 1
        });
    }
    
    return segments;
}

function tokenize(content: string, offset: number): { tokens: Token[]; errors: ParseError[] } {
    const tokens: Token[] = [];
    const errors: ParseError[] = [];
    let pos = 0;

    while (pos < content.length) {
        const start = pos + offset;
        const c = content[pos];

        if (/\s/.test(c)) {
            pos++;
            continue;
        }

        if (c === "'" || c === '"') {
            const { value, newPos, error } = readQuoted(content, pos, offset);
            pos = newPos;
            if (error) errors.push(error);
            if (value !== null) tokens.push({ value, start, end: pos + offset - 1 });
        } else if (c === '.' && content.slice(pos, pos + 3) === '...') {
            tokens.push({ value: '...', start: pos + offset, end: pos + offset + 2 });
            pos += 3;
        } else {
            const { value, newPos, error } = readUnquoted(content, pos, offset);
            pos = newPos;
            if (error) errors.push(error);
            if (value !== null) tokens.push({ value, start, end: pos + offset - 1 });
        }
    }

    return { tokens, errors };
}

function readQuoted(content: string, pos: number, offset: number) {
    let value = '';
    let escape = false;
    value += content[pos];
    pos++; // Skip opening quote

    while (pos < content.length) {
        const c = content[pos];
        if (escape) {
            value += c;
            escape = false;
            pos++;
        } else if (c === '\\') {
            escape = true;
            pos++;
        } else if (c === "'" || c === '"') {
            value += c;
            pos++;
            return { value, newPos: pos, error: null as ParseError | null };
        } else {
            value += c;
            pos++;
        }
    }

    return {
        value: null as string | null,
        newPos: pos,
        error: { position: pos + offset, message: 'Unterminated quoted identifier' }
    };
}

function readUnquoted(content: string, pos: number, offset: number) {
    let value = '';
    const initial = content[pos];
    
    if (!isValidInitial(initial)) {
        return {
            value: null as string | null,
            newPos: pos + 1,
            error: { position: pos + offset, message: `Invalid initial character: ${initial}` }
        };
    }

    value += initial;
    pos++;

    while (pos < content.length) {
        const c = content[pos];
        if (/\s/.test(c) || c === ']' || c === '[') break;
        if (isValidFollowing(c)) {
            value += c;
            pos++;
            continue;
        }
        const nextChar = content[pos + 1];

        if (c === '\\') {
            if (nextChar === '-' || nextChar === '\\' || nextChar === '.') {
                value += c;
                value += nextChar;
                pos += 2;
                continue;
            }
            return {
                value: null,
                newPos: pos + 1,
                error: { position: pos + offset, message: 'Backslash is not allowed' }
            };
        }

        return {
            value: null,
            newPos: pos + 1,
            error: { position: pos + offset, message: `Invalid character: ${c}` }
        };
    }

    return { value, newPos: pos, error: null };
}

function isValidInitial(c: string): boolean {
    // Allow ASCII letters, underscores, and Unicode identifier characters
    return /^[a-zA-Z_]$/.test(c) || isUnicodeIdentifierChar(c);
}

function isValidFollowing(c: string): boolean {
    // Allow ASCII letters, digits, underscores, and Unicode identifier characters
    return /^[a-zA-Z0-9_]$/.test(c) || isUnicodeIdentifierChar(c);
}

function isValidIdentifier(value: string): boolean {
    // Check for unquoted identifiers
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
        return true;
    }
    // Check for quoted identifiers
    if (/^'[^']*'$/.test(value)) {
        return true;
    }
    // Check for escaped hyphens
    if (value.includes('-') && !value.includes('\\-')) {
        return false; // Hyphen is not escaped
    }
    return false;
}

function isUnicodeIdentifierChar(c: string): boolean {
    // Placeholder for Unicode identifier character validation
    // You can implement this based on your specific Unicode requirements
    return false;
}

export function isConstantLiteral(value: string) : boolean {
    return value.startsWith('"') && value.endsWith('"');
}
