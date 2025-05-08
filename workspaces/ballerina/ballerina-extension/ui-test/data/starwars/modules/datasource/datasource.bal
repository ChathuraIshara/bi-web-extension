//  Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
//  This software is the property of WSO2 LLC. and its suppliers, if any.
//  Dissemination of any information or reproduction of any material contained
//  herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
//  You may not alter or remove any copyright or other notice from copies of this content.

public final readonly & table<HumanRecord> key(id) humanTable = table [
    { id: "1000", name: "Luke Skywalker", homePlanet: "Tatooine", height: 1.72, mass: 77, appearsIn: [NEWHOPE, EMPIRE, JEDI] },
    { id: "1001", name: "Darth Vader", homePlanet: "Tatooine", height: 2.02, mass: 136, appearsIn: [NEWHOPE, EMPIRE, JEDI] },
    { id: "1002", name: "Han Solo", height: 1.80, mass: 80, appearsIn: [ NEWHOPE, EMPIRE, JEDI] },
    { id: "1003", name: "Leia Organa", homePlanet: "Alderaan", height: 1.50, mass: 49, appearsIn: [NEWHOPE, EMPIRE, JEDI] },
    { id: "1004", name: "Wilhuff Tarkin", height: 1.80, appearsIn: [NEWHOPE] }
];

public final readonly & table<DroidRecord> key(id) droidTable = table [
    { id: "2000", name: "C-3PO", appearsIn: [NEWHOPE, EMPIRE, JEDI], primaryFunction: "Protocol" },
    { id: "2001", name: "R2-D2", appearsIn: [NEWHOPE, EMPIRE, JEDI], primaryFunction: "Astromech" }
];

public final readonly & table<StarshipRecord> key(id) starshipTable = table [
    { id: "3000", name: "Millenium Falcon", length: 34.37 },
    { id: "3001", name: "X-Wing", length: 12.5 },
    { id: "3002", name: "TIE Advanced x1", length: 9.2 },
    { id: "3003", name: "Imperial shuttle", length: 20 }
];

isolated table<ReviewRecord> reviewTable = table [
    { episode: NEWHOPE, stars:5, commentary:"This is a great movie!" }
];

public final readonly & table<FriendsEdgeRecord> key(characterId, friendId) friendsEdgeTable = table [
    { characterId: "1000", friendId: "1002" },
    { characterId: "1000", friendId: "1003" },
    { characterId: "1000", friendId: "2000" },
    { characterId: "1000", friendId: "2001" },
    { characterId: "1001", friendId: "1004" },
    { characterId: "1002", friendId: "1000" },
    { characterId: "1002", friendId: "1003" },
    { characterId: "1002", friendId: "2001" },
    { characterId: "1003", friendId: "1000" },
    { characterId: "1003", friendId: "1002" },
    { characterId: "1003", friendId: "2000" },
    { characterId: "1003", friendId: "2001" },
    { characterId: "1004", friendId: "1001" },
    { characterId: "2000", friendId: "1000" },
    { characterId: "2000", friendId: "1002" },
    { characterId: "2000", friendId: "1003" },
    { characterId: "2000", friendId: "2001" },
    { characterId: "2001", friendId: "1000" },
    { characterId: "2001", friendId: "1002" },
    { characterId: "2001", friendId: "1003" }
];

public final readonly & table<StarshipEdgeRecord> key(characterId, starshipId) starshipEdgeTable = table [
    { characterId: "1000", starshipId: "3001" },
    { characterId: "1000", starshipId: "3003" },
    { characterId: "1001", starshipId: "3002" },
    { characterId: "1002", starshipId: "3000" },
    { characterId: "1002", starshipId: "3003" }
];
