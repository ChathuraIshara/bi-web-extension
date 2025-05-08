/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Schema, SchemaEditor } from './SchemaEditor';
import { useState } from 'react';
import { ReadOnlySchemaEditor } from './ReadOnlySchemaEditor';
import { OpenAPI } from '../../Definitions/ServiceDefinitions';


export default {
    component: SchemaEditor,
    title: 'SchemaEditor',
};

const schema: Schema = {
    title: "Person",
    description: "This is a person",
    type: "object",
    properties: {
        name: {
            type: "string"
        },
        age: {
            type: "number"
        },
        address: {
            type: "object",
            properties: {
                street: {
                    type: "string"
                },
                city: {
                    type: "string"
                }
            }
        },
        friends: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    age: {
                        type: "number"
                    },
                    type: {
                        type: "string"
                    },
                }
            }
        },
        spouse: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                },
                age: {
                    type: "number"
                },
                address: {
                    type: "object",
                    properties: {
                        street: {
                            type: "string"
                        },
                        city: {
                            type: "string"
                        },
                        country: {
                            type: "string"
                        }
                    }
                }
            }
        },
        test: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                },
                age: {
                    type: "number"
                },
                address: {
                    type: "object",
                    properties: {
                        street: {
                            type: "string"
                        },
                        city: {
                            type: "string"
                        },
                        country: {
                            type: "string"
                        }
                    }
                }
            }
        }
    }
};

const openAPIDefinition: OpenAPI = {
    openapi: '3.0.0',
    info: {
        title: 'Test',
        version: '1.0.0'
    },
    paths: {},
    components: {
        schemas: {
            Person: schema
        }
    }
};

export const SchemaEditorStory = () => {
    const [selectedId, setSelectedId] = useState<string | null>("1");
    const handleClick = (id: string) => {
        setSelectedId(id);
    };

    return (
        <SchemaEditor openAPI={openAPIDefinition} schema={schema} schemaName="Person" onSchemaChange={(schema) => { console.log('schema change', schema) }} />
    );
};

export const ReadonlySchemaEditorStory = () => {
    return (
        <ReadOnlySchemaEditor schema={schema} schemaName="Person" />
    );
}