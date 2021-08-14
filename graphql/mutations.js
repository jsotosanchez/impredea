import gql from 'graphql-tag';

export const MAKE_QUESTION_TO_MAKER = gql`
  mutation createDeal($maker_id: Int!, $user_id: Int!, $question: String!) {
    insert_questions_one(object: { client_id: $user_id, maker_id: $maker_id, question: $question }) {
      id
    }
  }
`;

export const UPDATE_USER_BY_PK = gql`
  mutation updateUser(
    $id: Int!
    $document: String!
    $email: String!
    $fullname: String!
    $location: String!
    $province: String!
    $street: String!
    $zip_code: String!
  ) {
    update_user_by_pk(
      pk_columns: { id: $id }
      _set: {
        document: $document
        email: $email
        fullname: $fullname
        location: $location
        province: $province
        street: $street
        zip_code: $zip_code
      }
    ) {
      id
    }
  }
`;
