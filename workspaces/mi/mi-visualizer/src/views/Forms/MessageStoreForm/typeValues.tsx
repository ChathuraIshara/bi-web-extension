  /*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
  
export const rabbitMQInitialValues=()=>({
    rabbitMQServerHostName: "localhost",
    rabbitMQServerPort: "5671",
    sslEnabled: false ,
    rabbitMQQueueName: "",
    rabbitMQExchangeName: "",
    routineKey: "",
    userName: "",
    password: "",
    virtualHost: "",
});

export const jmsInitialValues=()=>({
    initialContextFactory: "",
    providerURL: "",
    connectionFactory: "",
    jndiQueueName: "",
    userName: "",
    password: "",
    cacheConnection: false,
    jmsAPIVersion: "1.1",
});

export const jdbcInitialValues=()=>({
    dataBaseTable: "",
    connectionInformationType: "Pool"
});

export const wso2MbInitialValues=()=>({
    initialContextFactory: "org.wso2.andes.jndi.PropertiesFileInitialContextFactory",
    queueConnectionFactory: "amqp://admin:admin@clientID/carbon?brokerlist='tcp://localhost:5673'",
    jndiQueueName: "",
    jmsAPIVersion: "1.1",
    cacheConnection: false,
});

export const resequenceInitialValues=()=>({
    dataBaseTable: "",
    pollingCount: "",
    xPath: "",
    connectionInformationType: "Pool"
});

export const poolInitialValues=()=>({
    rdbmsType: "Other",
    driver:"",
    url:"",
    user:"",
    password:"",
});

export const carbonDatasourceInitialValues=()=>({
    dataSourceName: ""
});
