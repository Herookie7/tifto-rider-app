import { gql } from "@apollo/client";

export const CREATE_WITHDRAW_REQUEST = gql`
  mutation CreateRiderWithdrawRequest($requestAmount: Float!) {
    createRiderWithdrawRequest(requestAmount: $requestAmount) {
      _id
      requestAmount
      status
      createdAt
    }
  }
`;

export const CANCEL_WITHDRAW_REQUEST = gql`
  mutation CancelRiderWithdrawRequest($id: ID!) {
  cancelRiderWithdrawRequest(id: $id) {
    _id
    status
  }
}
`;
