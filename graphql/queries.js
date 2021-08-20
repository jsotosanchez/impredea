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
    user_by_pk(id: $id) {
      maker_description
      maker_name
      maker_rating
      maker_sales
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
      client {
        fullname
      }
    }
    reviews(where: { maker_id: { _eq: $id } }) {
      client {
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
    questions(where: { maker_id: { _eq: $id }, response: { _is_null: true } }) {
      id
      question
      client {
        fullname
      }
      created_at
    }
  }
`;

export const GET_QUESTION_BY_ID = gql`
  query getQuestionById($id: Int!) {
    questions_by_pk(id: $id) {
      client {
        fullname
      }
      question
    }
  }
`;

export const GET_MAKER_INFO_BY_ID = gql`
  query getMakerById($id: Int!) {
    user_by_pk(id: $id) {
      maker_description
      maker_name
      maker_rating
      maker_sales
      maker_active
    }
  }
`;

export const GET_USER_IDENTITY_BY_EMAIL = gql`
  query getUserIdentityByEmail($email: String!) {
    user(where: { email: { _eq: $email } }) {
      email
      fullname
      id
      maker_active
    }
  }
`;

export const GET_QUOTATIONS_BY_MAKER_ID = gql`
  query getQuotationsByMakerId($id: Int!) {
    quotations(where: { maker_id: { _eq: $id } }) {
      id
      updated_at
      created_at
      status_id
      product {
        name
      }
      quotation_status {
        label
      }
    }
  }
`;

export const GET_QUOTATION_BY_PK = gql`
  query getQuotationByPK($id: uuid!) {
    quotations_by_pk(id: $id) {
      client_instructions
      id
      status_id
      quantity
      material {
        label
      }
      product {
        main_photo
        name
      }
      product_quality {
        label
      }
      client {
        fullname
      }
    }
  }
`;
