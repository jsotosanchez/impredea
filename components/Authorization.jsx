import { useUser } from '@auth0/nextjs-auth0';
import React, { useContext, useEffect } from 'react';
import { SessionContext } from '../context/sessionContext';
import { useGetUserIdentity } from '../graphql/hooks';

export default function Authorization({ children }) {
  const { user, error, isLoading } = useUser();
  const context = useContext(SessionContext);
  const { getIdentity, loading, error: userIdentityError, data: userIdentity } = useGetUserIdentity();

  useEffect(() => {
    if (user) {
      getIdentity(user);
    }
  }, [user]);

  useEffect(() => {
    context.setIdentity(userIdentity);
  }, [userIdentity]);

  return <>{children}</>;
}
