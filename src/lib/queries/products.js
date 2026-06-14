// src/lib/queries/products.js
import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts($first: Int, $after: String, $category: String, $search: String) {
    products(
      first: $first
      after: $after
      where: {
        category: $category
        search: $search
      }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        name
        slug
        shortDescription
        image {
          sourceUrl
          altText
        }
        productCategories {
          nodes { name slug }
        }
        ... on SimpleProduct {
          price
          salePrice
          regularPrice
          stockStatus
        }
        ... on VariableProduct {
          price
          variations(first: 100) {
            nodes {
              id
              price
              stockStatus
            }
          }
        }
        ... on ExternalProduct {
          price
        }
        ... on GroupProduct {
          price
        }
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
      shortDescription
      sku
      image {
        sourceUrl
        altText
      }
      galleryImages {
        nodes { sourceUrl altText }
      }
      productCategories {
        nodes { name slug }
      }
      related(first: 4) {
        nodes {
          id
          name
          slug
          image { sourceUrl }
          ... on SimpleProduct { price }
          ... on VariableProduct { price }
        }
      }
      ... on SimpleProduct {
        price
        salePrice
        regularPrice
        stockStatus
        stockQuantity
      }
      ... on VariableProduct {
        price
        attributes {
          nodes {
            name
            options
            variation
          }
        }
        variations(first: 100) {
          nodes {
            id
            databaseId
            name
            price
            salePrice
            stockStatus
            image { sourceUrl }
            attributes {
              nodes { name value }
            }
          }
        }
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    productCategories(where: { hideEmpty: true }) {
      nodes {
        id
        name
        slug
        count
        image { sourceUrl altText }
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($search: String!) {
    products(where: { search: $search }, first: 20) {
      nodes {
        id
        name
        slug
        image { sourceUrl }
        ... on SimpleProduct { price stockStatus }
        ... on VariableProduct { price }
      }
    }
  }
`;
