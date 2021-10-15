import gql from 'graphql-tag';

export const MAKE_QUESTION_TO_MAKER = gql`
  mutation makeQuestion($maker_id: Int!, $user_id: Int!, $question: String!) {
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
    $maker_active: Boolean
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
        maker_active: $maker_active
      }
    ) {
      id
    }
  }
`;

export const INSERT_PRODUCT = gql`
  mutation insertProduct($makerId: Int!, $description: String!, $instructions: String!, $name: String!) {
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
  mutation editById($id: Int!, $response: String!, $answered_at: date!) {
    update_questions_by_pk(pk_columns: { id: $id }, _set: { response: $response, answered_at: $answered_at }) {
      id
    }
  }
`;

export const UPDATE_MAKER_INFO = gql`
  mutation updateMakerInfo($id: Int!, $description: String!, $name: String!, $pictureKey: String) {
    update_user_by_pk(
      pk_columns: { id: $id }
      _set: { maker_description: $description, maker_name: $name, maker_picture_key: $pictureKey }
    ) {
      id
    }
  }
`;

export const REQUEST_QUOTATION = gql`
  mutation requestQuotation(
    $clientId: Int!
    $clientInstructions: String!
    $materialId: Int!
    $qualityId: Int!
    $quantity: Int!
    $makerId: Int!
    $productId: Int!
  ) {
    insert_quotations_one(
      object: {
        client_id: $clientId
        client_instructions: $clientInstructions
        material_id: $materialId
        quality_id: $qualityId
        quantity: $quantity
        maker_id: $makerId
        product_id: $productId
      }
    ) {
      id
    }
  }
`;

export const SEND_QUOTATION = gql`
  mutation updateQuotation($id: uuid!, $estimated_date: date, $information: String, $price: numeric) {
    update_quotations_by_pk(
      pk_columns: { id: $id }
      _set: { estimated_date: $estimated_date, information: $information, price: $price, status_id: 2 }
    ) {
      id
    }
  }
`;
export const ACCEPT_QUOTATION = gql`
  mutation acceptQuotation($id: uuid!) {
    update_quotations_by_pk(pk_columns: { id: $id }, _set: { status_id: 3 }) {
      id
      maker_id
      client_id
    }
  }
`;

export const DECLINE_QUOTATION = gql`
  mutation declineQuotation($id: uuid!) {
    update_quotations_by_pk(pk_columns: { id: $id }, _set: { status_id: 4 }) {
      id
      maker_id
      client_id
    }
  }
`;

export const CREATE_SALE = gql`
  mutation createSale($client_id: Int!, $maker_id: Int!, $id: uuid!) {
    insert_sales_one(object: { client_id: $client_id, quotation_id: $id, maker_id: $maker_id }) {
      id
    }
  }
`;

export const REPORT_PROBLEM = gql`
  mutation reportProblem($description: String!, $related_sale: uuid = "2", $subject: String!, $reporter: Int!) {
    insert_problems_one(
      object: { reporter: $reporter, subject: $subject, description: $description, related_sale: $related_sale }
    ) {
      id
    }
  }
`;

export const REGISTER_USER = gql`
  mutation registerUser($email: String!, $fullname: String!) {
    insert_user_one(object: { email: $email, fullname: $fullname }) {
      id
      email
    }
  }
`;

export const CREATE_CONVERSATION = gql`
  mutation MyMutation($quotationId: uuid!) {
    insert_conversations_one(object: { quotation_id: $quotationId }) {
      id
    }
  }
`;
