import React, { useState, useMemo } from 'react';

export const SessionContext = React.createContext(null);

export const SessionProvider = ({ children }) => {
  const [sessionState, setSessionState] = useState({});

  const context = useMemo(() => {
    const setIdentity = (newIdentity) => setSessionState(newIdentity);
    const getUser = () => sessionState;
    const isMaker = () => sessionState?.maker_active;

    return { getUser, isMaker, setIdentity };
  }, [sessionState]);

  return (
    <React.Fragment>
      <SessionContext.Provider value={context}>{children}</SessionContext.Provider>
    </React.Fragment>
  );
};
