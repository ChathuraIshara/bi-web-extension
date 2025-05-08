/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useReducer } from "react";

export default function createContext(reducer: any, actions: any = {}, defaultState: any = {}) {
  const Context = React.createContext(defaultState);

  // interface ProviderProps {
  //   children: {},
  //   initialState: {}
  // }

  const Provider = (props: any) => {
    const { children, initialState } = props;
    const [state, dispatch] = useReducer(reducer, initialState);

    const boundActions: any = {};
    /* tslint:disable-next-line */
    for (const key in actions) {
      boundActions[key] = actions[key](dispatch);
    }

    return (
      <Context.Provider value={{ state, ...boundActions }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
}
