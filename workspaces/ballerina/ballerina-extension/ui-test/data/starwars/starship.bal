//  Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
//  This software is the property of WSO2 LLC. and its suppliers, if any.
//  Dissemination of any information or reproduction of any material contained
//  herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
//  You may not alter or remove any copyright or other notice from copies of this content.

import starwars.datasource as ds;

# A ship from the Star Wars universe
public distinct isolated service class Starship {

    private final readonly & ds:StarshipRecord starship;

    isolated function init(ds:StarshipRecord starship) {
        self.starship = starship.cloneReadOnly();
    }

    # The unique identifier of the starship
    # + return - The id
    isolated resource function get id() returns string {
        return self.starship.id;
    }

    # The name of the starship
    # + return - The name
    isolated resource function get name() returns string {
        return self.starship.name;
    }

    # The length of the starship, or null if unknown
    # + return - The length
    isolated resource function get length() returns float? {
        return self.starship?.length;
    }

    # Cordinates of the starship, or null if unknown
    # + return - The cordinates
    isolated resource function get cordinates() returns float[][]? {
        return self.starship?.cordinates;
    }
}
