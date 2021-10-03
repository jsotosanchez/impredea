import { gql } from '@apollo/client';

export const GET_SEARCHFORM_QUERY = gql`
  query {
    order_quantity {
      id
      label
    }
    maker_category(order_by: { label: asc }) {
      id
      label
    }
    provinces(order_by: { name: asc }) {
      name
      id
    }
  }
`;

export const GET_SEARCH_PRODUCT_DATA = gql`
  query {
    order_quantity {
      id
      label
    }
    maker_category(order_by: { label: asc }) {
      id
      label
    }
  }
`;

export const GET_PRODUCTS = gql`
  query getProducts($category: Int, $productName: String!, $quantity: Int!) {
    maker_category {
      id
      label
    }
    order_quantity {
      id
      label
    }
    product(
      where: {
        name: { _ilike: $productName }
        maker: {
          maker_active: { _eq: true }
          maker_category_id: { _eq: $category }
          maker_capacity: { _lte: $quantity }
        }
      }
      limit: 20
    ) {
      id
      main_photo
      description
      maker {
        maker_name
      }
      name
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
      id
      text
      rating
      client {
        fullname
      }
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
      maker_active
    }
  }
`;

export const GET_PRODUCTS_BY_MAKER_ID = gql`
  query getProductsByMakerId($id: Int!, $filter: String, $limit: Int = 10, $offset: Int = 0) {
    product(
      where: { maker_id: { _eq: $id }, name: { _ilike: $filter } }
      order_by: { updated_at: desc }
      limit: $limit
      offset: $offset
    ) {
      name
      updated_at
      id
    }
  }
`;

export const GET_QUESTIONS_BY_MAKER_ID = gql`
  query getProductsByMakerId($id: Int!, $limit: Int = 10, $offset: Int = 0) {
    questions(
      where: { maker_id: { _eq: $id }, response: { _is_null: true } }
      order_by: { created_at: asc }
      limit: $limit
      offset: $offset
    ) {
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
  query getQuotationsByMakerId($id: Int!, $statuses: [Int!] = [1, 2, 3, 4], $limit: Int = 10, $offset: Int = 0) {
    quotations(
      where: { maker_id: { _eq: $id }, status_id: { _in: $statuses } }
      order_by: { updated_at: asc, quotation_status: { id: asc } }
      limit: $limit
      offset: $offset
    ) {
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

export const GET_QUOTATIONS_BY_CLIENT_ID = gql`
  query getQuotationsByMakerId($id: Int!, $limit: Int = 10, $offset: Int = 0) {
    quotations(where: { client_id: { _eq: $id }, status_id: { _eq: 2 } }, limit: $limit, offset: $offset) {
      id
      updated_at
      product {
        name
      }
      quotation_status {
        label
      }
      maker {
        maker_name
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
      price
      information
      estimated_date
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

export const GET_SALES_BY_CLIENT_ID = gql`
  query getSalesByClientId($id: Int!, $limit: Int = 10, $offset: Int = 0) {
    sales(where: { client_id: { _eq: $id } }, offset: $offset, limit: $limit) {
      id
      quotation {
        price
        quantity
        estimated_date
        product {
          name
        }
        maker {
          maker_name
        }
      }
    }
  }
`;

export const GET_SALES_BY_MAKER_ID = gql`
  query getSalesByMakerId($id: Int!, $limit: Int = 10, $offset: Int = 0) {
    sales(where: { maker_id: { _eq: $id } }, offset: $offset, limit: $limit) {
      id
      quotation {
        price
        quantity
        estimated_date
        product {
          name
        }
        client {
          fullname
        }
      }
    }
  }
`;

export const GET_MAKERS = gql`
  query MyQuery(
    $quantity: Int
    $location: Int
    $category: Int
    $makerName: String
    $minRep: numeric
    $limit: Int = 10
    $offset: Int = 0
  ) {
    user(
      where: {
        maker_active: { _eq: true }
        maker_capacity: { _gte: $quantity }
        maker_location: { _eq: $location }
        maker_category_id: { _eq: $category }
        maker_name: { _ilike: $makerName }
        maker_rating: { _gte: $minRep }
      }
      order_by: { maker_rating: desc }
      offset: $offset
      limit: $limit
    ) {
      maker_category_id
      maker_description
      maker_name
      maker_rating
      id
    }
  }
`;

export const GET_QUOTATIONS_STATUSES = gql`
  query MyQuery {
    quotation_statuses {
      id
      label
    }
  }
`;
