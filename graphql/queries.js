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
        name
      }
    }
    reviews(where: { maker_id: { _eq: $id } }) {
      user {
        name
      }
      rating
      id
      text
    }
  }
`;
