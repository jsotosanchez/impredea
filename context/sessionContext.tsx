import { DEFAULT_IDENTITY } from '@/utils/defaults';
import React, { useState, useMemo } from 'react';

interface ContextType {
  getUser: () => Identity | undefined;
  setIdentity: (newIdentity: Identity) => void;
}

const initialContext: ContextType = {
  setIdentity: () => {},
  getUser: () => DEFAULT_IDENTITY,
};

export const SessionContext = React.createContext(initialContext);

interface Props {
  children: React.ReactNode;
}
interface Identity {
  email: string;
  fullname: string;
  id: number;
  maker_active: boolean;
}
export const SessionProvider = ({ children }: Props) => {
  const [sessionState, setSessionState] = useState<Identity>();

  const context = useMemo(() => {
    const setIdentity = (newIdentity: Identity) => setSessionState(newIdentity);
    const getUser = () => sessionState;

    return { getUser, setIdentity };
  }, [sessionState]);

  return (
    <React.Fragment>
      <SessionContext.Provider value={context}>{children}</SessionContext.Provider>
    </React.Fragment>
  );
};
