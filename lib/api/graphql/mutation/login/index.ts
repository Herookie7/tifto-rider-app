import { gql } from "@apollo/client";

// Primary mutation - use riderLogin when available
export const RIDER_LOGIN = gql`
  mutation RiderLogin(
    $username: String
    $password: String
    $notificationToken: String
    $timeZone: String!
  ) {
    riderLogin(
      username: $username
      password: $password
      notificationToken: $notificationToken
      timeZone: $timeZone
    ) {
      userId
      token
    }
  }
`;

// Fallback mutation - use regular login if riderLogin is not available
// The login mutation supports metadata.username lookup for riders
export const RIDER_LOGIN_FALLBACK = gql`
  mutation RiderLoginFallback(
    $email: String
    $password: String
    $type: String!
    $notificationToken: String
  ) {
    login(
      email: $email
      password: $password
      type: $type
      notificationToken: $notificationToken
    ) {
      userId
      token
      tokenExpiration
      isActive
      name
      email
      phone
      isNewUser
    }
  }
`;

export const DEFAULT_RIDER_CREDS = gql`
  query LastOrderCreds {
    lastOrderCreds {
      riderUsername
      riderPassword
    }
  }
`;
