import { gql } from "@apollo/client";

export const EDIT_RIDER = gql`
  mutation EditRider($riderInput: RiderInput!) {
    editRider(riderInput: $riderInput) {
      _id
      name
      username
      phone
      password
      vehicleType
      zone {
        _id
      }
    }
  }
`;

export const UPDATE_LOCATION = gql`
  mutation UpdateRiderLocation($latitude: String!, $longitude: String!) {
    updateRiderLocation(latitude: $latitude, longitude: $longitude) {
      _id
      location {
        coordinates
      }
    }
  }
`;

export const UPDATE_AVAILABILITY = gql`
  mutation ToggleRider($id: String!) {
    toggleAvailablity(id: $id) {
      _id
    }
  }
`;

export const TOGGLE_RIDER_AVAILABILITY = gql`
  mutation ToggleRiderAvailability {
    toggleRiderAvailability {
      _id
      available
    }
  }
`;


export const ASSIGN_SUBSCRIPTION_DELIVERY = gql`
  mutation AssignSubscriptionDelivery($deliveryId: ID!) {
    assignSubscriptionDelivery(deliveryId: $deliveryId) {
      _id
      status
      rider {
        _id
      }
    }
  }
`;

export const UPDATE_SUBSCRIPTION_DELIVERY_STATUS = gql`
  mutation UpdateSubscriptionDeliveryStatus($deliveryId: ID!, $status: String!, $reason: String) {
    updateDeliveryStatus(deliveryId: $deliveryId, status: $status, reason: $reason) {
      _id
      status
      deliveredAt
    }
  }
`;


export const UPDATE_LICENSE = gql`
  mutation UpdateRiderLicenseDetails(
    $updateRiderLicenseDetailsId: String!
    $licenseDetails: LicenseDetailsInput
  ) {
    updateRiderLicenseDetails(
      id: $updateRiderLicenseDetailsId
      licenseDetails: $licenseDetails
    ) {
      _id
    }
  }
`;
export const UPDATE_VEHICLE = gql`
  mutation UpdateRiderVehicleDetails(
    $updateRiderVehicleDetailsId: String!
    $vehicleDetails: VehicleDetailsInput
  ) {
    updateRiderVehicleDetails(
      id: $updateRiderVehicleDetailsId
      vehicleDetails: $vehicleDetails
    ) {
      _id
    }
  }
`;
export const UPDATE_BUSINESS_DETAILS = gql`
  mutation UpdateRiderBussinessDetails(
    $bussinessDetails: BussinessDetailsInput
    $updateRiderBussinessDetailsId: String!
  ) {
    updateRiderBussinessDetails(
      bussinessDetails: $bussinessDetails
      id: $updateRiderBussinessDetailsId
    ) {
      _id
    }
  }
`;

export const UPDATE_WORK_SCHEDULE = gql`
  mutation UpdateWorkSchedule(
    $riderId: String!
    $workSchedule: [DayScheduleInput!]!
    $timeZone: String!
  ) {
    updateWorkSchedule(
      riderId: $riderId
      workSchedule: $workSchedule
      timeZone: $timeZone
    ) {
      _id
      timeZone
      workSchedule {
        day
        enabled
        slots {
          startTime
          endTime
        }
      }
    }
  }
`;

export const UPLOAD_IMAGE_TO_S3 = gql`
  mutation UploadImageToS3($image: String!) {
    uploadImageToS3(image: $image) {
      imageUrl
    }
  }
`;

export const CREATE_HOLIDAY_REQUEST = gql`
  mutation CreateHolidayRequest(
    $startDate: String!
    $endDate: String!
    $reason: String
  ) {
    createHolidayRequest(
      startDate: $startDate
      endDate: $endDate
      reason: $reason
    ) {
      _id
      startDate
      endDate
      reason
      status
      createdAt
    }
  }
`;
