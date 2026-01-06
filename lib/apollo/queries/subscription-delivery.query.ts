import { gql } from "@apollo/client";

export const GET_PENDING_DELIVERIES_FOR_ZONE = gql`
  query GetPendingDeliveriesForZone {
    getPendingDeliveriesForZone {
        _id
        subscriptionId {
            _id
            user {
                name
                phone
                location {
                    coordinates
                    address
                }
            }
            restaurantId {
                name
                address
                location {
                    coordinates
                }
                phone
            }
        }
        status
        deliveryTime
        scheduledDate
        dayOfWeek
        mealType
        menuItems {
            title
            quantity
        }
    }
  }
  }
`;

export const GET_RIDER_ASSIGNMENTS = gql`
  query GetRiderAssignments {
    getRiderAssignments {
        _id
        scheduledDate
        dayOfWeek
        mealType
        status
        deliveryTime
        subscriptionId {
            _id
            planName
            remainingTiffins
            restaurantId {
                _id
                name
                address
                location {
                    coordinates
                }
            }
            user {
                _id
                name
                email
                phone
                location {
                   coordinates
                   address: deliveryAddress 
                }
                addressBook {
                    deliveryAddress
                    location {
                        coordinates
                    }
                }
            }
        }
    }
  }
`;
