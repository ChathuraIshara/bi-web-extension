//  Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
//  This software is the property of WSO2 LLC. and its suppliers, if any.
//  Dissemination of any information or reproduction of any material contained
//  herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
//  You may not alter or remove any copyright or other notice from copies of this content.

import ballerina/graphql;
import xlibb/pubsub;

import starwars.datasource as ds;

type SearchResult Human|Droid|Starship;

public enum Episode {
    NEWHOPE,
    EMPIRE,
    JEDI
}

public type Review record {|
    Episode episode;
    int stars;
    string commentary?;
|};

public type ReviewInput record {|
    int stars;
    string commentary?;
|};

service /graphql2 on new graphql:Listener(9090) {
    private final pubsub:PubSub pubsub = new;

    # Fetch the hero of the Star Wars
    # + return - The hero
    resource function get hero(Episode? episode) returns Character {
        if episode == EMPIRE {
            return new Human(ds:humanTable.get("1000"));
        }
        return new Droid(ds:droidTable.get("2001"));
    }

    # Returns reviews of the Star Wars
    # + return - The reviews
    resource function get reviews(Episode episode) returns Review?[] {
        return ds:getReviews(episode);
    }

    # Returns characters by id, or null if character is not found
    # + return - The characters
    resource function get characters(string[] idList) returns Character?[] {
        Character?[] characters = [];
        foreach string id in idList {
            if ds:humanTable.hasKey(id) {
                characters.push(new Human(ds:humanTable.get(id)));
            } else if ds:droidTable.hasKey(id) {
                characters.push(new Droid(ds:droidTable.get(id)));
            } else {
                characters.push(());
            }
        }
        return characters;
    }

    # Returns a droid by id, or null if droid is not found
    # + return - The Droid
    resource function get droid(string id = "2000") returns Droid? {
        if ds:droidTable.hasKey(id) {
            return new Droid(ds:droidTable.get(id));
        }
        return;
    }

    # Returns a human by id, or null if human is not found
    # + return - The Human
    resource function get human(string id) returns Human? {
        if ds:humanTable.hasKey(id) {
            return new Human(ds:humanTable.get(id));
        }
        return;
    }

    # Returns a starship by id, or null if starship is not found
    # + return - The Starship
    resource function get starship(string id) returns Starship? {
        if ds:starshipTable.hasKey(id) {
            return new Starship(ds:starshipTable.get(id));
        }
        return;
    }

    # Returns search results by text, or null if search item is not found
    # + return - The SearchResult
    resource function get search(string text) returns SearchResult[]? {
        SearchResult[] searchResult = [];
        if text.includes("human") {
            ds:HumanRecord[] humans = from var human in ds:humanTable
                            select human;
            foreach ds:HumanRecord human in humans {
                searchResult.push(new Human(human));
            }
        }
        if text.includes("droid") {
            ds:DroidRecord[] droids = from var droid in ds:droidTable
                select droid;
            foreach ds:DroidRecord droid in droids {
                searchResult.push(new Droid(droid));
            }
        }
        if text.includes("starship") {
            ds:StarshipRecord[] starships = from var ship in ds:starshipTable
                select ship;
            foreach ds:StarshipRecord ship in starships {
                searchResult.push(new Starship(ship));
            }
        }
        if searchResult.length() > 0 {
            return searchResult;
        }
        return;
    }

    # Add new reviews and return the review values
    # + episode - Episode name
    # + reviewInput - Review of the episode
    # + return - The reviews
    remote function createReview(Episode episode, ReviewInput reviewInput) returns Review|error {
        ds:ReviewRecord newReview = {episode, ...reviewInput};
        ds:updateReviews(newReview);
        string topic = string `reviews-${episode}`;
        check self.pubsub.publish(topic, newReview, timeout = 5);
        return {...newReview};
    }

    # Subscribe to review updates
    # + episode - Episode name
    # + return - The reviews
    resource function subscribe reviewAdded(Episode episode) returns stream<Review, error?>|error {
        string topic = string `reviews-${episode}`;
        return self.pubsub.subscribe(topic, timeout = 5);
    }

    #Test hierarchical resources
     resource function get profile/quote() returns string {
        return "I am the one who knocks!";
     }

     resource function get profile/name/first() returns string {
        return "Walter";
     }

     resource function get profile/name/last() returns string {
        return "White";
     }


}
