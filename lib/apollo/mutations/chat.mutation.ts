import { gql } from "@apollo/client";

export const SEND_CHAT_MESSAGE = gql`
  mutation SendChatMessage($message: ChatMessageInput!, $orderId: ID!) {
    sendChatMessage(message: $message, orderId: $orderId) {
      success
      message
      data {
        id
        _id
        orderId
        message
        createdAt
        user {
          _id
          name
        }
      }
    }
  }
`;
