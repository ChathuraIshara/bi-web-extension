//  Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
//  This software is the property of WSO2 LLC. and its suppliers, if any.
//  Dissemination of any information or reproduction of any material contained
//  herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
//  You may not alter or remove any copyright or other notice from copies of this content.

public isolated function updateReviews(ReviewRecord review) {
    lock {
        reviewTable.add(review);
    }
}

public isolated function getReviews(EpisodeEnum episode) returns ReviewRecord[] {
    lock {
        ReviewRecord[] reviews = from var review in reviewTable where review.episode == episode select review;
        return reviews.cloneReadOnly();
    }
}
