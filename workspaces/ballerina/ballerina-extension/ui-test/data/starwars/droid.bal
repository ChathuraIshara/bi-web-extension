//  Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
//  This software is the property of WSO2 LLC. and its suppliers, if any.
//  Dissemination of any information or reproduction of any material contained
//  herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
//  You may not alter or remove any copyright or other notice from copies of this content.

import starwars.datasource as ds;

# An autonomous mechanical character in the Star Wars universe
distinct service class Droid {
    *Character;

    private final readonly & ds:DroidRecord droid;

    function init(ds:DroidRecord droid) {
        self.droid = droid.cloneReadOnly();
    }

    # The unique identifier of the droid
    # + return - The id
    resource function get id() returns string {
        return self.droid.id;
    }

    # The name of the droid
    # + return - The name
    resource function get name() returns string {
        return self.droid.name;
    }

    # This droid's friends, or an empty list if they have none
    # + return - The friends
    resource function get friends() returns Character[] {
        Character[] friends = [];
        ds:FriendsEdgeRecord[] edges = from var edge in ds:friendsEdgeTable
                        join var droid in [self.droid] on edge.characterId equals droid.id
                        select edge;
        friends.push(...from var human in ds:humanTable
                        join var edge in edges on human.id equals edge.friendId
                        select new Human(human));
        friends.push(...from var droid in ds:droidTable
                        join var edge in edges on droid.id equals edge.friendId
                        select new Droid(droid));
        return friends;
    }

    # The episodes this droid appears in
    # + return - The episodes
    resource function get appearsIn() returns Episode[] {
        return self.droid.appearsIn;
    }

    # This droid's primary function
    # + return - The primaryFunction
    resource function get primaryFunction() returns string? {
        return self.droid?.primaryFunction;
    }
}
