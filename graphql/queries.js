import { gql } from '@apollo/client';

export const GET_SEARCHFORM_QUERY = gql`
  query {
    order_quantity {
      id
      label
    }
    maker_category {
      id
      label
    }
  }
`;

export const GET_MAKER_BY_ID = gql`
  query getMakerById($id: Int!) {
    maker_by_pk(id: $id) {
      description
      name
      rating
      sales
    }
    product(where: { maker_id: { _eq: $id } }) {
      name
      id
    }
    questions(where: { maker_id: { _eq: $id }, response: { _is_null: false } }) {
      id
      question
      response
      answered_at
      user {
        fullname
      }
    }
    reviews(where: { maker_id: { _eq: $id } }) {
      user {
        fullname
      }
      rating
      id
      text
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query getProductById($id: Int!) {
    product_by_pk(id: $id) {
      description
      instructions
      name
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query getProductById($id: Int!) {
    user_by_pk(id: $id) {
      email
      fullname
      location
      province
      street
      zip_code
      document
    }
  }
`;

export const GET_PRODUCTS_BY_MAKER_ID = gql`
  query getProductsByMakerId($id: Int!) {
    product(where: { maker_id: { _eq: $id } }) {
      name
      updated_at
      id
    }
  }
`;

export const GET_QUESTIONS_BY_MAKER_ID = gql`
  query getProductsByMakerId($id: Int!) {
    questions(where: { maker_id: { _eq: $id }, response: { _is_null: false } }) {
      id
      question
      user {
        fullname
      }
      created_at
    }
  }
`;

export const GET_QUESTION_BY_ID = gql`
  query getQuestionById($id: Int!) {
    questions_by_pk(id: $id) {
      user {
        fullname
      }
      question
    }
  }
`;
