// src/lib/queries/products.js
import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts($first: Int, $after: String, $category: String) {
    products(
      first: $first
      after: $after
      where: { category: $category, status: PUBLISH }
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
          nodes {
            name
            slug
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
          variations {
            nodes {
              id
              name
              price
              stockStatus
              attributes {
                nodes {
                  name
                  value
                }
              }
            }
          }
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
      description
      shortDescription
      sku
      image {
        sourceUrl
        altText
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      productCategories {
        nodes {
          name
          slug
        }
      }
      related {
        nodes {
          id
          name
          slug
          image {
            sourceUrl
          }
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
        variations {
          nodes {
            id
            databaseId
            name
            price
            salePrice
            stockStatus
            image {
              sourceUrl
            }
            attributes {
              nodes {
                name
                value
              }
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
        image {
          sourceUrl
        }
        children {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($search: String!) {
    products(where: { search: $search, status: PUBLISH }) {
      nodes {
        id
        name
        slug
        image {
          sourceUrl
        }
        ... on SimpleProduct {
          price
        }
        ... on VariableProduct {
          price
        }
      }
    }
  }
`;
