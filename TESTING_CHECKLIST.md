# Tifto Rider App - Testing Checklist

## Manual Testing Required

Since automated testing requires running the app, please test the following functionality:

### Authentication & Login
- [ ] Rider login with username/password
- [ ] Default credentials retrieval
- [ ] Token persistence after app restart
- [ ] Push notification token registration
- [ ] Timezone handling

### Orders Management
- [ ] New Orders screen displays unassigned orders
- [ ] Processing Orders screen shows accepted/picked up orders
- [ ] Delivered Orders screen shows completed orders
- [ ] Order detail view displays all information correctly
- [ ] Accept order functionality
- [ ] Pick up order functionality
- [ ] Deliver order functionality
- [ ] Real-time order updates via subscriptions
- [ ] Pull-to-refresh works

### Wallet
- [ ] Current wallet balance displays with ₹ symbol
- [ ] Withdraw request creation
- [ ] Withdraw amount validation (minimum ₹10)
- [ ] Pending request display
- [ ] Transaction history shows with ₹ symbol
- [ ] Success screen after withdraw request

### Earnings
- [ ] Grand total earnings displays with ₹ symbol
- [ ] Earnings graph/chart visualization
- [ ] Earnings detail by date range
- [ ] Earnings order details
- [ ] Delivery fee and tips tracking
- [ ] Date filtering works correctly

### Profile
- [ ] Profile information displays correctly
- [ ] Profile image upload
- [ ] Name, email, phone editing
- [ ] Vehicle type selection
- [ ] License details management
- [ ] Vehicle details management
- [ ] Work schedule configuration
- [ ] Bank account management
- [ ] Availability toggle

### Drawer Menu
- [ ] Vehicle Type selection
- [ ] Work Schedule configuration
- [ ] Bank Management
- [ ] Help & Support
- [ ] Language selection
- [ ] Profile access
- [ ] Links to privacy policy, terms (tifto.com)

### Additional Features
- [ ] Real-time chat with customers
- [ ] Location tracking and updates
- [ ] Google Maps integration
- [ ] Order tracking on map
- [ ] Navigation to restaurant/customer
- [ ] Push notifications
- [ ] Sound notifications
- [ ] Order status subscriptions
- [ ] Rider location subscriptions

### Currency & Localization
- [ ] All prices display with ₹ symbol (not $)
- [ ] Currency formatting is correct (Indian number system)
- [ ] Default currency is INR
- [ ] Language selection works
- [ ] All text uses Tifto branding (not Enatega)

### Theme
- [ ] Light theme displays correctly
- [ ] Dark theme displays correctly
- [ ] Theme switching works
- [ ] All colors match customer app theme

### Backend Integration
- [ ] GraphQL queries work with ftifto-backend.onrender.com
- [ ] WebSocket subscriptions connect to wss://ftifto-backend.onrender.com/graphql
- [ ] Authentication works with backend
- [ ] All rider endpoints respond correctly
- [ ] Error handling works for network issues

## Known Configuration Notes

### Firebase
- Package names updated to `com.tifto.rider`
- Firebase project_id may need to be updated in Firebase console if using different project
- Service account credentials may need updating if using different Firebase project

### Backend
- GraphQL: `https://ftifto-backend.onrender.com/graphql`
- WebSocket: `wss://ftifto-backend.onrender.com/graphql`
- All rider endpoints implemented and ready

