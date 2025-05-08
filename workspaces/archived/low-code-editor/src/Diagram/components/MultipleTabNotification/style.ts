/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        multipleTabsNotification: {
            height: 384,
            width: 590,
            borderRadius: 12,
            backgroundColor: '#fff',
            boxShadow: '0 10px 40px -20px rgba(76, 77, 82, 0.3)',
            position: 'absolute',
            top: '20vh',
            left: '30vw',
            zIndex: 25,
            padding: '5rem 2rem',
            textAlign: 'center'
        },
        mainTitle: {
            color: "#222228",
            fontSize: 29,
            letterSpacing: 0,
            textAlign: 'center'
        },

        subText: {
            color: '#8d91a3',
            fontSize: 15,
            letterSpacing: 0,
            textAlign: 'center',
            marginTop: "1rem"
        },
        buttonWrapper: {
            marginTop: 20,
            paddingTop: 35
        },
        backgroundOverlay: {
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            zIndex: 15,
            display: 'flex',
            position: 'absolute'
        },
        multipleTabRestoreBtn: {
            height: 48,
            width: 174
        }
    })
);
