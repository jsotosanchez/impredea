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

export const INSERT_PRODUCT = gql`
  mutation insertUser($makerId: Int!, $description: String!, $instructions: String!, $name: String!) {
    insert_product_one(
      object: { description: $description, instructions: $instructions, maker_id: $makerId, name: $name }
    ) {
      id
    }
  }
`;

export const DELETE_PRODUCT_BY_ID = gql`
  mutation deleteById($id: Int!) {
    delete_product_by_pk(id: $id) {
      id
    }
  }
`;

export const EDIT_PRODUCT_BY_ID = gql`
  mutation editById($id: Int!, $name: String!, $instructions: String!, $description: String!) {
    update_product_by_pk(
      pk_columns: { id: $id }
      _set: { name: $name, instructions: $instructions, description: $description }
    ) {
      id
    }
  }
`;

export const UPDATE_QUESTION_BY_ID = gql`
  mutation editById($id: Int!, $response: String!, $answered_at: Date!) {
    update_questions_by_pk(pk_columns: { id: $id }, _set: { response: $response, answered_at: $answered_at }) {
      id
    }
  }
`;

export const UPDATE_MAKER_INFO = gql`
  mutation updateMakerInfo($id: Int!, $description: String!, $name: String!) {
    update_maker_by_pk(pk_columns: { id: $id }, _set: { description: $description, name: $name }) {
      id
    }
  }
`;
