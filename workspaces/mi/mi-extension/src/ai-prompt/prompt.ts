/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export function generatePrompt(xml: string, userInput: string): string {
    const prompt = `# Schema Understanding and Log Tag Generation
    ## Schema Definitions
    ### Log Schema (\`<xs:schema
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    elementFormDefault="qualified"
    targetNamespace="http://ws.apache.org/ns/synapse"
    xmlns="http://ws.apache.org/ns/synapse">
    <xs:include schemaLocation="../../misc/common.xsd" />
    <xs:element name="log">
    <xs:annotation>
    <xs:documentation source="description">
    Generates logs for messages (mediated by a sequence or proxy service). By default, only the minimum
    details are logged. If required, you can log the full message payload, headers, and even custom
    user-defined properties.
    </xs:documentation>
    </xs:annotation>
    <xs:complexType>
    <xs:sequence>
    <xs:element name="property" type="mediatorProperty" minOccurs="0" maxOccurs="unbounded" />
    </xs:sequence>
    <xs:attribute name="level" type="logLevel" use="optional" default="simple" />
    <xs:attribute name="separator" type="xs:string" use="optional" default=", " />
    <xs:attribute name="category" type="logCategory" use="optional" default="INFO" />
    <xs:attribute name="description" type="xs:string" use="optional" />
    </xs:complexType>
    </xs:element>
    <xs:simpleType name="logLevel">
    <xs:annotation>
    <xs:documentation source="description">
    This simple type represents the possible values for
    the header mediator action attribute
    </xs:documentation>
    </xs:annotation>
    <xs:restriction base="xs:string">
    <xs:enumeration value="simple" />
    <xs:enumeration value="headers" />
    <xs:enumeration value="full" />
    <xs:enumeration value="custom" />
    </xs:restriction>
    </xs:simpleType>
    <xs:simpleType name="logCategory">
    <xs:annotation>
    <xs:documentation source="description">
    This simple type represents the possible values for
    the header mediator action attribute
    </xs:documentation>
    </xs:annotation>
    <xs:restriction base="xs:string">
    <xs:enumeration value="INFO" />
    <xs:enumeration value="FATAL" />
    <xs:enumeration value="ERROR" />
    <xs:enumeration value="WARN" />
    <xs:enumeration value="DEBUG" />
    <xs:enumeration value="TRACE" />
    </xs:restriction>
    </xs:simpleType>
    </xs:schema>\`)
    This schema defines the structure of a \`<log>\` tag. The \`<log>\` tag is used to generate logs for messages mediated by a sequence or proxy service. By default, only the minimum details are logged. If required, you can log the full message payload, headers, and even custom user-defined properties.
    The \`<log>\` tag can have the following attributes:
    - \`level\`: This attribute represents the level of logging. It can be one of the following values: \`simple\`, \`headers\`, \`full\`, \`custom\`. The default value is \`simple\`.
    - \`separator\`: This attribute represents the separator used in the log. The default value is \`, \`.
    - \`category\`: This attribute represents the category of the log. It can be one of the following values: \`INFO\`, \`FATAL\`, \`ERROR\`, \`WARN\`, \`DEBUG\`, \`TRACE\`. The default value is \`INFO\`.
    - \`description\`: This attribute represents the description of the log. It is optional.
    The \`<log>\` tag can also contain multiple \`<property>\` tags. The structure of the \`<property>\` tag is defined in the \`common.xsd\` schema.
    ### Common Schema (\`<xs:schema
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    elementFormDefault="qualified"
    targetNamespace="http://ws.apache.org/ns/synapse"
    xmlns="http://ws.apache.org/ns/synapse"
    xmlns:wsdl11="http://schemas.xmlsoap.org/wsdl/"
    xmlns:wsdl20="http://www.w3.org/ns/wsdl">
    <xs:import namespace="http://schemas.xmlsoap.org/wsdl/" schemaLocation="wsdl11.xsd"/>
    <xs:import namespace="http://www.w3.org/ns/wsdl" schemaLocation="wsdl20.xsd"/>
    <xs:element name="resource">
    <xs:annotation>
    <xs:documentation source="description">
    Resources like XSDs to be provided to the WSDL and so forth
    </xs:documentation>
    </xs:annotation>
    <xs:complexType>
    <xs:attribute name="location" type="xs:anyURI" use="required"/>
    <xs:attribute name="key" type="xs:string" use="required"/>
    </xs:complexType>
    </xs:element>
    <xs:element name="parameter">
    <xs:annotation>
    <xs:documentation source="description">
    These are the parameters for various elements in the Synapse Configuration,
    for example, for proxy services, for registry and so forth
    </xs:documentation>
    </xs:annotation>
    <xs:complexType>
    <xs:complexContent mixed="true">
    <xs:extension base="xs:anyType">
    <xs:attribute name="name" type="xs:string" use="required"/>
    <xs:attribute name="key" type="xs:string" use="optional"/>
    <xs:attribute name="locked" type="xs:boolean" use="optional"/>
    </xs:extension>
    </xs:complexContent>
    </xs:complexType>
    </xs:element>
    <xs:element name="feature">
    <xs:annotation>
    <xs:documentation source="description">
    This is a feature, with a name value pair as its configuration
    and mainly used in the validate mediator
    </xs:documentation>
    </xs:annotation>
    <xs:complexType>
    <xs:attribute name="name" type="xs:string" use="required"/>
    <xs:attribute name="value" type="xs:boolean" use="required"/>
    </xs:complexType>
    </xs:element>
    <xs:group name="inlineWsdl">
    <xs:choice>
    <xs:element ref="wsdl11:definitions" minOccurs="0" maxOccurs="1"/>
    <xs:element ref="wsdl20:description" minOccurs="0" maxOccurs="1"/>
    </xs:choice>
    </xs:group>
    <xs:attributeGroup name="monitoringAspect">
    <xs:annotation>
    <xs:documentation source="description">
    This group of attributes represents the statistics and tracing of sequences,
    proxy services and endpoints
    </xs:documentation>
    </xs:annotation>
    <xs:attribute name="statistics" default="disable" type="enableDisable" use="optional"/>
    <xs:attribute name="trace" default="disable" type="enableDisable" use="optional"/>
    </xs:attributeGroup>
    <xs:attributeGroup name="nameValueOrExpression">
    <xs:annotation>
    <xs:documentation>
    This group of attributes are mainly used in header and property mediators
    to provide the name value or expression pairs as its configuration
    </xs:documentation>
    </xs:annotation>
    <xs:attribute name="name" type="xs:string" use="required"/>
    <xs:attribute name="action" type="setRemove" use="optional"/>
    <xs:attributeGroup ref="valueOrExpression"/>
    </xs:attributeGroup>
    <xs:attributeGroup name="valueOrExpression">
    <xs:annotation>
    <xs:documentation>
    This group of attributes are mainly used in places where the value can be
    statically specified or dynamically evaluated over the given xpath
    </xs:documentation>
    </xs:annotation>
    <xs:attribute name="value" type="xs:string" use="optional"/>
    <xs:attribute name="expression" type="xs:string" use="optional"/>
    </xs:attributeGroup>
    <xs:complexType name="mediatorProperty">
    <xs:annotation>
    <xs:documentation source="description">
    These are the properties which could be name value pairs or could be
    xpath expression extracting the property value by evaluating over
    the message
    </xs:documentation>
    </xs:annotation>
    <xs:complexContent mixed="true">
    <xs:extension base="xs:anyType">
    <xs:attribute name="name" type="xs:string" use="required"/>
    <xs:attributeGroup ref="valueOrExpression"/>
    </xs:extension>
    </xs:complexContent>
    </xs:complexType>
    <xs:simpleType name="enableDisable">
    <xs:annotation>
    <xs:documentation source="description">
    This simple type represents the possible values for the statistics and tracing
    attributes
    </xs:documentation>
    </xs:annotation>
    <xs:restriction base="xs:string">
    <xs:enumeration value="enable"/>
    <xs:enumeration value="disable"/>
    </xs:restriction>
    </xs:simpleType>
    <xs:simpleType name="setRemove">
    <xs:annotation>
    <xs:documentation source="description">
    This simple type represents the possible values for
    the header mediator action attribute
    </xs:documentation>
    </xs:annotation>
    <xs:restriction base="xs:string">
    <xs:enumeration value="set"/>
    <xs:enumeration value="remove"/>
    </xs:restriction>
    </xs:simpleType>
    </xs:schema>\`)
    This schema defines common elements and types used across different schemas. The \`<property>\` tag used in the \`<log>\` tag is defined here. The \`<property>\` tag represents a property which could be a name-value pair or could be an XPath expression extracting the property value by evaluating over the message. It has the following attributes:
    - \`name\`: This attribute represents the name of the property. It is required.
    - \`value\`: This attribute represents the value of the property. It is optional.
    - \`expression\`: This attribute represents an XPath expression used to extract the property value. It is optional.
    ## Prompt
    You are a software engineer working on a project that involves generating XML tags based on user requests. Your current task is to generate a \`<log>\` tag based on the user's request and add it to a given XML file. The \`<log>\` tag should have specific properties as per the user's request.
    The user's request will be appended to the end of this prompt. Your task is to generate the \`<log>\` tag with the requested properties and add it to the specified position in the XML file provided by the user. The modified XML file should be returned as the response.
    The \`<log>\` tag and its properties are defined in the \`log.xsd\` and \`common.xsd\` schema files. You should use these schema files to understand the possible configurations of the \`<log>\` tag and generate it accordingly.
    Please note that the \`<log>\` tag can have multiple \`<property>\` tags, and each \`<property>\` tag can have a \`name\`, \`value\`, or \`expression\` attribute. The \`name\` attribute is required, while the \`value\` and \`expression\` attributes are optional.
    Please return only the XML. don't give any other clarifications to the user. don't include any explanations in your responses. when adding tags, don't remove any existing tags. if you are unable to add the tag or understand the user query, return the original XML.
    User's XML: (\`${xml}\`)
    User's request: ${userInput}`;

    return prompt;
}
