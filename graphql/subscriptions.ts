import gql from 'graphql-tag';

export const MESSAGES_SUBSCRIPTION = gql`
  subscription MessageSubscription($id: uuid, $limit: Int = 20) {
    messages(where: { conversation_id: { _eq: $id } }, order_by: { created_at: desc }, limit: $limit) {
      sender_id
      text
      created_at
      read_at
      id
    }
  }
`;
