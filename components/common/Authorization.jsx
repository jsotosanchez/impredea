import { useMutation } from '@apollo/client';
import { useUser } from '@auth0/nextjs-auth0';
import { useToast } from '@chakra-ui/toast';
import React, { useContext, useEffect, useRef } from 'react';
import { SessionContext } from '../../context/sessionContext';
import { useGetUserIdentity } from '../../graphql/hooks';
import { REGISTER_USER } from '../../graphql/mutations';

export default function Authorization({ children }) {
  const { user, error, isLoading } = useUser();
  const toast = useToast();
  const context = useContext(SessionContext);
  const userCreated = useRef(false);
  const { getIdentity, loading, error: userIdentityError, data: userIdentity } = useGetUserIdentity();

  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted: () => {
      getIdentity(user);
      toast({
        title: 'Te has registrado con exito!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: () => {},
  });
  useEffect(() => {
    if (user) {
      getIdentity(user);
    }
  }, [user, getIdentity]);

  useEffect(() => {
    if (user && !userIdentity) {
      registerUser({
        variables: { email: user.email, fullname: user.name },
      });
    } else context.setIdentity(userIdentity);
  }, [userIdentity, context, user, registerUser]);

  return <>{children}</>;
}
