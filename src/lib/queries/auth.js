// src/lib/queries/auth.js
import { gql } from "@apollo/client";

// ── FIX: Removed authToken + refreshToken — not available on this
// WPGraphQL version's RegisterCustomerPayload.
// After registration we do a normal JWT login instead.
export const REGISTER_CUSTOMER = gql`
  mutation RegisterCustomer(
    $username: String!
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
  ) {
    registerCustomer(
      input: {
        username: $username
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      customer {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

export const GET_VIEWER = gql`
  query GetLoggedInUser {
    viewer {
      id
      name
      email
      databaseId
    }
  }
`;

export const SEND_PASSWORD_RESET = gql`
  mutation SendPasswordResetEmail($username: String!) {
    sendPasswordResetEmail(input: { username: $username }) {
      success
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      customer {
        id
        firstName
        lastName
        email
        billing {
          address1
          city
          state
        }
      }
    }
  }
`;
