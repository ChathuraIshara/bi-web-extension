//  Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
//  This software is the property of WSO2 LLC. and its suppliers, if any.
//  Dissemination of any information or reproduction of any material contained
//  herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
//  You may not alter or remove any copyright or other notice from copies of this content.

# A mechanical character from the Star Wars universe
public type Character distinct service object {

    # The unique identifier of the character
    # + return - The id
    resource function get id() returns string;

    # The name of the character
    # + return - The name
    resource function get name() returns string;

    # This character's friends, or an empty list if they have none
    # + return - The friends
    resource function get friends() returns Character[];

    # The episodes this character appears in
    # + return - The episodes
    resource function get appearsIn() returns Episode[];
};
