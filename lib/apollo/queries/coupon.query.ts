export const getCoupon = `#graphql
mutation Coupon($coupon:String!){
    getCoupon(coupon:$coupon){
      _id
      title
      discount
      enabled
    }
  }`;
