# Tifto Rider App - Complete Feature Documentation

## Authentication & Onboarding

### Login System
- **Rider Login**: Username/password authentication
- **Default Credentials**: Retrieval of default login credentials
- **Token Management**: JWT token-based authentication with AsyncStorage persistence
- **Push Notifications**: Registration of push notification tokens during login
- **Timezone Handling**: Automatic timezone detection and storage
- **Session Management**: Automatic token validation and refresh

### Security Features
- Password hashing and validation
- Account activation status checking
- Secure token storage

## Home Tab - Orders Management

### Order Types
1. **New Orders Screen**
   - Displays unassigned orders (status: ACCEPTED, no rider assigned, not picked up)
   - Real-time order updates via subscriptions
   - Pull-to-refresh functionality
   - Empty state with appropriate messaging
   - Order cards showing:
     - Restaurant name and image
     - Delivery address
     - Order amount
     - Payment method
     - Order ID
     - Customer information

2. **Processing Orders Screen**
   - Shows accepted orders that are being processed
   - Orders that have been picked up
   - Real-time status updates
   - Order tracking capabilities

3. **Delivered Orders Screen**
   - Historical completed orders
   - Order history with details
   - Past delivery records

### Order Detail View
- **Full Order Information**:
  - Complete order items list
  - Item variations and addons
  - Restaurant details and location
  - Customer details and contact
  - Delivery address with map
  - Payment information
  - Order status timeline
  - Order amount breakdown (subtotal, tax, tip, delivery charges)
  - Preparation time
  - Expected delivery time

### Order Actions
- **Accept Order**: Rider can accept unassigned orders
- **Pick Up Order**: Mark order as picked up from restaurant
- **Deliver Order**: Mark order as delivered to customer
- **Cancel Order**: Handle order cancellations
- **Order Assignment**: Automatic/manual order assignment

### Real-time Features
- **Order Subscriptions**: Live updates for new orders
- **Status Subscriptions**: Real-time order status changes
- **Zone-based Orders**: Filter orders by delivery zone
- **Rider Assignment**: Notifications when orders are assigned

## Wallet Tab

### Balance Management
- **Current Wallet Balance**: Real-time balance display
- **Total Wallet Amount**: Lifetime earnings tracking
- **Withdrawn Amount**: Total amount withdrawn tracking
- **Balance Updates**: Automatic balance refresh after transactions

### Withdraw Functionality
- **Withdraw Request Creation**: 
  - Minimum withdrawal amount (₹10)
  - Validation against current balance
  - Request amount input with error handling
- **Withdraw Request Status**:
  - Pending request display
  - Status tracking (pending, approved, rejected)
  - Request amount and date
- **Success Screen**: Confirmation after successful request creation

### Transaction History
- **Recent Transactions**: List of all wallet transactions
- **Transaction Details**:
  - Amount transferred
  - Transaction date
  - Status (pending, completed, failed)
  - Transaction type
- **Empty State**: No records found message

## Earnings Tab

### Earnings Overview
- **Grand Total Earnings**: Lifetime total earnings display
- **Earnings Breakdown**:
  - Delivery fees
  - Tips
  - Total earnings per order
- **Earnings Graph**: Bar chart visualization of earnings over time
  - Last 5 days/periods displayed
  - Visual representation of earnings trends
  - Interactive chart with labels

### Earnings Details
- **Date Range Filtering**: Filter earnings by date range
- **Earnings by Date**: Daily earnings breakdown
- **Earnings Order Details**: Detailed view of orders contributing to earnings
  - Order ID
  - Order type
  - Payment method
  - Delivery fee
  - Tips
  - Total earnings per order
  - Date and time

### Earnings Statistics
- **Total Deliveries**: Count of completed deliveries
- **Total Hours**: Time worked (if tracked)
- **Total Tips**: Sum of all tips received
- **Total Earnings Sum**: Aggregate earnings for period

## Profile Tab

### Profile Information
- **Personal Details**:
  - Name editing
  - Email management
  - Phone number
  - Profile image upload
  - Account status

### Vehicle Management
- **Vehicle Type Selection**: 
  - Bike, Car, Bicycle, Motorcycle options
  - Vehicle type display and editing
- **License Details**:
  - License number input
  - License expiry date
  - License image upload
- **Vehicle Details**:
  - Vehicle number/plate
  - Vehicle image upload

### Work Schedule
- **Day-wise Configuration**: 
  - Enable/disable days
  - Time slot configuration per day
  - Start and end time selection
  - Multiple slots per day support

### Bank Management
- **Bank Account Details**:
  - Bank name
  - Account holder name
  - Account number
  - Account code (IFSC/SWIFT)
  - Business details for tax purposes

### Availability Toggle
- **Online/Offline Status**: Toggle availability for orders
- **Status Indicator**: Visual indication of current status

## Drawer Menu

### Navigation Items
1. **Vehicle Type**: Quick access to vehicle type selection
2. **Work Schedule**: Access to work schedule configuration
3. **Bank Management**: Bank account management
4. **Help & Support**: Help documentation and support
5. **Language Selection**: Multi-language support
6. **Profile**: Access to profile settings
7. **Links**: Privacy policy, terms of service, website links

### Drawer Features
- User profile display in header
- Logout functionality
- Theme toggle (if implemented)
- Settings access

## Additional Features

### Real-time Chat
- **Customer Communication**: Chat with customers during delivery
- **Message History**: View past conversations
- **Image Sharing**: Send/receive images in chat
- **Real-time Updates**: Live message synchronization
- **Order-specific Chat**: Chat tied to specific orders

### Location Services
- **Location Tracking**: Continuous location updates
- **Google Maps Integration**: 
  - Map display for orders
  - Restaurant location marking
  - Customer location marking
  - Route navigation
- **Location Permissions**: Request and handle location permissions
- **Background Location**: Location updates in background
- **Zone Detection**: Automatic zone assignment based on location

### Order Tracking
- **Map View**: Visual order tracking on map
- **Navigation**: Open in Google Maps/Apple Maps
- **Route Display**: Directions to restaurant and customer
- **Distance Calculation**: Distance to pickup/delivery points

### Notifications
- **Push Notifications**: 
  - New order alerts
  - Order status updates
  - Assignment notifications
  - System notifications
- **Sound Notifications**: Audio alerts for important events
- **Notification Settings**: Control notification preferences

### Subscriptions (Real-time)
- **Rider Location Subscription**: Live location updates
- **Order Status Changed**: Real-time order status updates
- **New Messages**: Chat message notifications
- **Zone Orders**: New orders in assigned zone
- **Rider Assignment**: Order assignment notifications
- **Order Updates**: General order update subscriptions

### Order Management
- **Order Cancellation**: Handle cancelled orders
- **Order Review**: Review completed orders
- **Order History**: Access past orders
- **Order Filtering**: Filter by status, date, zone

## Technical Features

### Navigation
- **Expo Router**: File-based routing system
- **Tab Navigation**: Bottom tab bar (Home, Wallet, Earnings, Profile)
- **Stack Navigation**: Nested navigation for details
- **Drawer Navigation**: Side drawer menu
- **Deep Linking**: Support for deep links

### Data Management
- **Apollo Client**: GraphQL client for API communication
- **WebSocket Subscriptions**: Real-time data via WebSocket
- **AsyncStorage**: Local data persistence
- **State Management**: Context API for global state

### Internationalization
- **i18n Support**: Multi-language support via react-i18next
- **Language Selection**: User-selectable languages
- **RTL Support**: Right-to-left language support (if needed)
- **Language Persistence**: Saved language preference

### Theme System
- **Light/Dark Themes**: Theme switching capability
- **Theme Persistence**: Saved theme preference
- **Customizable Colors**: Theme color customization
- **System Theme**: Follow system theme preference

### Error Handling
- **Sentry Integration**: Error tracking and reporting
- **Error Boundaries**: React error boundaries
- **Error Messages**: User-friendly error messages
- **Retry Mechanisms**: Automatic retry for failed requests

### Media Handling
- **Image Picker**: Select images for profile, license, vehicle
- **Image Upload**: Upload images to server
- **Image Display**: Optimized image loading and display

### Performance
- **FlashList**: High-performance list rendering
- **Lazy Loading**: On-demand data loading
- **Optimistic Updates**: Immediate UI updates
- **Caching**: Apollo Client caching

### Platform Features
- **iOS Support**: Full iOS compatibility
- **Android Support**: Full Android compatibility
- **Platform-specific Code**: iOS/Android specific implementations
- **Responsive Design**: Adapts to different screen sizes

## Data Models

### Order Model
- Order ID, Order Number
- Restaurant details
- Customer details
- Rider assignment
- Items with variations and addons
- Delivery address
- Payment information
- Order status
- Timestamps (created, accepted, picked, delivered)
- Location coordinates
- Chat messages

### Rider Model
- Personal information
- Vehicle details
- License information
- Bank details
- Work schedule
- Location
- Availability status
- Wallet information
- Earnings data

### Wallet Model
- Current balance
- Total amount
- Withdrawn amount
- Transaction history
- Withdraw requests

### Earnings Model
- Total earnings
- Delivery fees
- Tips
- Date-based breakdown
- Order-wise earnings
- Time-based statistics

