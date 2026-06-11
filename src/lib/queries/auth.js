// src/lib/queries/auth.js
import { gql } from '@apollo/client';

export const REGISTER_CUSTOMER = gql`
  mutation RegisterCustomer(
    $username: String!
    $email: String!
    $password: String!
    $firstName: String
    $lastName: String
  ) {
    registerCustomer(input: {
      username: $username
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
    }) {
      customer {
        id
        email
        firstName
        lastName
        username
      }
    }
  }
`;

export const GET_VIEWER = gql`
  query GetViewer {
    viewer {
      id
      databaseId
      name
      email
      firstName
      lastName
      username
    }
  }
`;

export const GET_CUSTOMER = gql`
  query GetCustomer {
    customer {
      id
      databaseId
      firstName
      lastName
      email
      username
      billing {
        firstName lastName email phone
        address1 address2 city state postcode country
      }
      shipping {
        firstName lastName
        address1 address2 city state postcode country
      }
    }
  }
`;

// Step 1 — sends reset email to user
// WordPress emails a link: /reset-password?key=XXX&login=username
export const SEND_PASSWORD_RESET = gql`
  mutation SendPasswordReset($username: String!) {
    sendPasswordResetEmail(input: { username: $username }) {
      success
    }
  }
`;

// Step 2 — user clicks link in email, lands on /reset-password?key=XXX&login=username
// This mutation sets the new password using the key from the URL
export const RESET_USER_PASSWORD = gql`
  mutation ResetUserPassword($key: String!, $login: String!, $password: String!) {
    resetUserPassword(input: {
      key: $key
      login: $login
      password: $password
    }) {
      user {
        id
        email
      }
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
          firstName lastName email phone
          address1 address2 city state postcode country
        }
        shipping {
          firstName lastName
          address1 address2 city state postcode country
        }
      }
    }
  }
`;