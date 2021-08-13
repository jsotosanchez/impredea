import gql from 'graphql-tag';

export const MAKE_QUESTION_TO_MAKER = gql`
  mutation createDeal($maker_id: Int!, $user_id: Int!, $question: String!) {
    insert_questions_one(object: { client_id: $user_id, maker_id: $maker_id, question: $question }) {
      id
    }
  }
`;
