import { graphql } from "@/gql/graphql";
import productFragment from "./product";

export const orderAddressFragment = graphql(`
  fragment OrderAddress on OrderAddress {
    fullName
    streetLine1
    streetLine2
    city
    province
    postalCode
    country
    phoneNumber
  }
`);

export const orderCustomerFragment = graphql(`
  fragment OrderCustomer on Customer {
    id
    firstName
    lastName
    emailAddress
    phoneNumber
  }
`);

export const orderDiscountFragment = graphql(`
  fragment OrderDiscount on Discount {
    description
    amountWithTax
  }
`);

export const orderShippingLineFragment = graphql(`
  fragment OrderShippingLine on ShippingLine {
    shippingMethod {
      id
      name
      code
      description
    }
    priceWithTax
  }
`);

export const orderPaymentFragment = graphql(`
  fragment OrderPayment on Payment {
    id
    method
    amount
    state
  }
`);

const activeOrderFragment = graphql(
  `
    fragment active_order on Order {
      id
      code
      state
      subTotal
      subTotalWithTax
      currencyCode
      totalWithTax
      total
      shipping
      shippingWithTax
      couponCodes
      discounts {
        ...OrderDiscount
      }
      lines {
        id
        quantity
        linePriceWithTax
        productVariant {
          ... on ProductVariant {
            id
            name
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
        }
      }
      totalQuantity
      customer {
        ...OrderCustomer
      }
      billingAddress {
        ...OrderAddress
      }
      shippingAddress {
        ...OrderAddress
      }
      shippingLines {
        ...OrderShippingLine
      }
      payments {
        ...OrderPayment
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

export default activeOrderFragment;
