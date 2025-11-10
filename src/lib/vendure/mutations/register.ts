import { graphql } from "@/gql/graphql";

export const registerCustomerAccount = graphql(`
    mutation registerCustomerAccount($input: RegisterCustomerInput!) {
        registerCustomerAccount(input: $input) {
            ... on Success {
                __typename
                success
            }
            ... on MissingPasswordError {
                __typename
                message
            }
            ... on PasswordValidationError {
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
