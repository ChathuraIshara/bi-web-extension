//  Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
//  This software is the property of WSO2 LLC. and its suppliers, if any.
//  Dissemination of any information or reproduction of any material contained
//  herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
//  You may not alter or remove any copyright or other notice from copies of this content.

import starwars.datasource as ds;

# A humanoid creature from the Star Wars universe
distinct service class Human {
    *Character;

    private final readonly & ds:HumanRecord human;

    function init(ds:HumanRecord human) {
        self.human = human.cloneReadOnly();
    }

    # The unique identifier of the human
    # + return - The id
    resource function get id() returns string {
        return self.human.id;
    }

    # The name of the human
    # + return - The name
    resource function get name() returns string {
        return self.human.name;
    }

    # The home planet of the human, or null if unknown
    # + return - The homePlanet
    resource function get homePlanet() returns string? {
        return self.human?.homePlanet;
    }

    # Height in meters, or null if unknown
    # + return - The height
    resource function get height() returns float? {
        return self.human.height;
    }

    # Mass in kilograms, or null if unknown
    # + return - The mass
    resource function get mass() returns int? {
        return self.human.mass;
    }

    # This human's friends, or an empty list if they have none
    # + return - The friends
    resource function get friends() returns Character[] {
        Character[] friends = [];
        ds:FriendsEdgeRecord[] edges = from var edge in ds:friendsEdgeTable
            join var human in [self.human] on edge.characterId equals human.id
            select edge;
        friends.push(...from var human in ds:humanTable
            join var edge in edges on human.id equals edge.friendId
            select new Human(human));
        friends.push(...from var droid in ds:droidTable
            join var edge in edges on droid.id equals edge.friendId
            select new Droid(droid));
        return friends;
    }

    # The episodes this human appears in
    # + return - The episodes
    resource function get appearsIn() returns Episode[] {
        return self.human.appearsIn;
    }

    # A list of starships this person has piloted, or an empty list if none
    # + return - The startships
    resource function get starships() returns Starship[] {
        ds:StarshipEdgeRecord[] edges = from var edge in ds:starshipEdgeTable
            join var human in [self.human] on edge.characterId equals human.id
            select edge;
        Starship[] starship = from var ship in ds:starshipTable
            join var edge in edges on ship.id equals edge.starshipId
            select new Starship(ship);
        return starship;
    }
}
