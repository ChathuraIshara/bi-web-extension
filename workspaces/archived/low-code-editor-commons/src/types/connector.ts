/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export interface ConnectionData {
    [key: string]: ConnectionInfoWrap[];
}
export interface ConnectionInfoWrap {
    [key: string]: any;
}
export interface ConnectionInfo {
    isFetching: boolean;
    error: Error;
}

// github
export interface GithubConnectionInfo extends ConnectionInfo{
    user?: GithubUser;
    userRepositoryList?: GithubRepo[];
}
export interface GithubUser {
    id: string;
    login: string;
    url: string;
    avatarUrl: string;
    resourcePath: string;
}
export interface GithubRepoPrimaryLanguage {
    id: string;
    name: string;
    color: string;
}
export interface GithubRepo {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    forkCount: number;
    hasIssuesEnabled: boolean;
    hasWikiEnabled: boolean;
    isArchived: boolean;
    isFork: boolean;
    isLocked: boolean;
    isMirror: boolean;
    isPrivate: boolean;
    homepageUrl: string;
    lockReason: string;
    mirrorUrl: string;
    url: string;
    sshUrl: string;
    owner: GithubUser;
    primaryLanguage: GithubRepoPrimaryLanguage;
    stargazerCount: number;
}

// google spreadsheet
export interface GsheetConnectionInfo extends ConnectionInfo{
    userSheetList: GSpreadsheet[];
    isSheetFetching?: boolean; // active spreadsheet sheet list fetching
    activeSpreadsheetSheetList?: GSheet[];
}
export interface GSpreadsheet {
    id: string;
    name: string;
    kind: string;
    mimeType: string;
}

export interface GSheetGridProperties {
    rowCount: number;
    columnCount: number;
    frozenRowCount: number;
    frozenColumnCount: number;
    hideGridlines: boolean;
}

export interface GSheet {
    sheetId: number;
    title: string;
    index: number;
    sheetType: string;
    gridProperties: GSheetGridProperties;
    hidden: boolean;
    rightToLeft: boolean;
}

// google calendar
export interface GcalendarConnectionInfo extends ConnectionInfo{
    userCalendarList?: Gcalendar[];
}
export interface Gcalendar {
    kind: string;
    etag: string;
    id: string;
    summary: string;
    description?: string;
    timeZone: string;
    colorId: string;
    selected: boolean;
    backgroundColor: string;
    foregroundColor: string;
    accessRole: string;
    defaultReminders?: GcalendarDefaultReminder[];
    conferenceProperties?: GcalendarConferenceProperties;
    primary?: boolean;
    notificationSettings?: GcalendarNotificationSettings;
}
export interface GcalendarDefaultReminder {
    method: string;
    minutes: number;
}
export interface GcalendarConferenceProperties {
    allowedConferenceSolutionTypes: string[];
}
export interface GcalendarNotification {
    type: string;
    method: string;
}
export interface GcalendarNotificationSettings {
    notifications: GcalendarNotification[];
}
