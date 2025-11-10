import { graphql } from "@/gql/graphql";
import {
  orderAddressFragment,
  orderCustomerFragment,
  orderDiscountFragment,
  orderPaymentFragment,
  orderShippingLineFragment,
} from "@/lib/vendure/fragments/active-order";
import productFragment from "@/lib/vendure/fragments/product";

export const setOrderShippingAddressMutation = graphql(`
  mutation setOrderShippingAddress($input: CreateAddressInput!) {
    setOrderShippingAddress(input: $input) {
      __typename
      ... on Order {
        id
        code
        state
        active
        lines {
          id
          quantity
          linePrice
          linePriceWithTax
          unitPrice
          unitPriceWithTax
          productVariant {
            id
            name
            sku
          }
          featuredAsset {
            id
            preview
          }
        }
        subTotal
        subTotalWithTax
        total
        totalWithTax
        shipping
        shippingWithTax
        currencyCode
        shippingAddress {
          fullName
          streetLine1
          streetLine2
          city
          province
          postalCode
          country
          phoneNumber
        }
        billingAddress {
          fullName
          streetLine1
          streetLine2
          city
          province
          postalCode
          country
          phoneNumber
        }
        customer {
          id
          firstName
          lastName
          emailAddress
        }
      }
      ... on ErrorResult {
        __typename
        errorCode
        message
      }
    }
  }
`);

export const setOrderBillingAddressMutation = graphql(`
  mutation setOrderBillingAddress($input: CreateAddressInput!) {
    setOrderBillingAddress(input: $input) {
      __typename
      ... on Order {
        id
        code
        state
        billingAddress {
          fullName
          streetLine1
          streetLine2
          city
          province
          postalCode
          country
          phoneNumber
        }
      }
      ... on ErrorResult {
        __typename
        errorCode
        message
      }
    }
  }
`);

export const setCustomerForOrderMutation = graphql(`
  mutation setCustomerForOrder($input: CreateCustomerInput!) {
    setCustomerForOrder(input: $input) {
      __typename
      ... on Order {
        id
        code
        customer {
          id
          firstName
          lastName
          emailAddress
          phoneNumber
        }
      }
      ... on ErrorResult {
        __typename
        errorCode
        message
      }
    }
  }
`);

export const setOrderShippingMethodMutation = graphql(`
  mutation setOrderShippingMethod($shippingMethodId: [ID!]!) {
    setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
      __typename
      ... on Order {
        id
        code
        shipping
        shippingWithTax
        shippingLines {
          shippingMethod {
            id
            name
            code
            description
          }
          priceWithTax
        }
      }
      ... on ErrorResult {
        __typename
        errorCode
        message
      }
    }
  }
`);

export const eligibleShippingMethodsQuery = graphql(`
  query eligibleShippingMethods {
    eligibleShippingMethods {
      id
      name
      code
      description
      metadata
      price
      priceWithTax
    }
  }
`);

export const eligiblePaymentMethodsQuery = graphql(`
  query eligiblePaymentMethods {
    eligiblePaymentMethods {
      id
      code
      name
      description
      isEligible
      eligibilityMessage
    }
  }
`);

export const addPaymentToOrderMutation = graphql(`
  mutation addPaymentToOrder($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      __typename
      ... on Order {
        id
        code
        state
        active
        payments {
          id
          method
          amount
          state
          metadata
        }
      }
      ... on ErrorResult {
        __typename
        errorCode
        message
      }
    }
  }
`);

export const transitionOrderToStateMutation = graphql(`
  mutation transitionOrderToState($state: String!) {
    transitionOrderToState(state: $state) {
      __typename
      ... on Order {
        id
        code
        state
      }
      ... on ErrorResult {
        __typename
        errorCode
        message
      }
    }
  }
`);

export const availableCountriesQuery = graphql(`
  query availableCountries {
    availableCountries {
      id
      code
      name
    }
  }
`);

export const orderByCodeQuery = graphql(
  `
    query orderByCode($code: String!) {
      orderByCode(code: $code) {
        id
        code
        state
        active
        createdAt
        updatedAt
        lines {
          id
          quantity
          linePrice
          linePriceWithTax
          unitPrice
          unitPriceWithTax
          productVariant {
            id
            name
            sku
            options {
              code
              name
              group {
                code
                name
              }
            }
            product {
              ...product
            }
          }
          featuredAsset {
            id
            preview
          }
        }
        subTotal
        subTotalWithTax
        total
        totalWithTax
        totalQuantity
        shipping
        shippingWithTax
        currencyCode
        couponCodes
        discounts {
          ...OrderDiscount
        }
        shippingAddress {
          ...OrderAddress
        }
        billingAddress {
          ...OrderAddress
        }
        customer {
          ...OrderCustomer
        }
        shippingLines {
          ...OrderShippingLine
        }
        payments {
          ...OrderPayment
        }
      }
    }
  `,
  [
    productFragment,
    orderAddressFragment,
    orderCustomerFragment,
    orderDiscountFragment,
    orderShippingLineFragment,
    orderPaymentFragment,
  ],
);
