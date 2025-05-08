//  Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
//  This software is the property of WSO2 LLC. and its suppliers, if any.
//  Dissemination of any information or reproduction of any material contained
//  herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
//  You may not alter or remove any copyright or other notice from copies of this content.

public enum EpisodeEnum {
    NEWHOPE,
    EMPIRE,
    JEDI
}

public type HumanRecord readonly & record {|
    string id;
    string name;
    string homePlanet?;
    float height?;
    int mass?;
    EpisodeEnum[] appearsIn;
|};

public type DroidRecord readonly & record {|
    string id;
    string name;
    EpisodeEnum[] appearsIn;
    string primaryFunction?;
|};

public type StarshipRecord readonly & record {|
    string id;
    string name;
    float length?;
    float[][] cordinates?;
|};

public type ReviewRecord readonly & record {|
    EpisodeEnum episode;
    int stars;
    string commentary?;
|};

public type FriendsEdgeRecord readonly & record {|
    string characterId;
    string friendId;
|};

public type StarshipEdgeRecord readonly & record {|
    string characterId;
    string starshipId;
|};
