import { graphql } from "@/gql/graphql";

export const verifyCustomerAccount = graphql(`
    mutation verifyCustomerAccount($token: String!, $password: String) {
        verifyCustomerAccount(token: $token, password: $password) {
            ... on CurrentUser {
                __typename
                id
                identifier
            }
            ... on VerificationTokenInvalidError {
                __typename
                message
            }
            ... on VerificationTokenExpiredError {
                __typename
                message
            }
            ... on MissingPasswordError {
                __typename
                message
            }
            ... on PasswordValidationError {
                __typename
                message
            }
            ... on PasswordAlreadySetError {
                __typename
                message
            }
            ... on NativeAuthStrategyError {
                __typename
                message
            }
        }
    }
`);
