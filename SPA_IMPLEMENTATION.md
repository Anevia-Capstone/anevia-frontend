# SPA Implementation - Anevia Frontend

## ✅ Mandatory Criteria 2: Single-Page Application Architecture

This document outlines the implementation of the required SPA architecture with hash-based routing and MVP pattern for the Anevia frontend application.

## 🏗️ Architecture Overview

### 1. Hash-based Routing (#)
- **Router Class**: `src/js/router/Router.js`
- **Navigation**: All routes use hash URLs (e.g., `#home`, `#tools`, `#login`)
- **Browser Support**: Back/forward buttons work correctly
- **Query Parameters**: Supported for advanced routing needs

### 2. MVP Pattern Implementation

#### Models (`src/js/models/`)
- `BaseModel.js` - Observer pattern for data changes
- `UserModel.js` - Authentication and user data management
- `ToolsModel.js` - Anemia detection functionality
- `ProfileModel.js` - User profile operations

#### Views (`src/js/views/`)
- `BaseView.js` - Common view functionality and DOM manipulation
- `HomeView.js` - Combined landing page (Home + About + FAQ)
- `ToolsView.js` - Anemia detection tools interface
- `LoginView.js` - User login interface
- `RegisterView.js` - User registration interface
- `ProfileView.js` - User profile management

#### Presenters (`src/js/presenters/`)
- `BasePresenter.js` - Common presenter functionality
- `HomePresenter.js` - Home page logic
- `ToolsPresenter.js` - Tools functionality logic
- `LoginPresenter.js` - Login logic
- `RegisterPresenter.js` - Registration logic
- `ProfilePresenter.js` - Profile management logic

## 🚀 Testing the SPA

### Available Routes

1. **Home/Landing Page**
   - URL: `http://localhost:5173/` or `http://localhost:5173/#home`
   - Features: Hero section, features, how it works, about, team, FAQ
   - Combined: Home + About + FAQ sections in one page

2. **Tools Page**
   - URL: `http://localhost:5173/#tools`
   - Features: Camera/upload interface, anemia detection, results
   - Access: Click "Try It Now" button or navigate directly

3. **Login Page**
   - URL: `http://localhost:5173/#login`
   - Features: Email/password login, Google sign-in
   - Layout: Full-screen login (header/footer hidden)

4. **Register Page**
   - URL: `http://localhost:5173/#register`
   - Features: User registration, Google sign-up
   - Layout: Full-screen register (header/footer hidden)

5. **Profile Page**
   - URL: `http://localhost:5173/#profile`
   - Features: Profile management, image upload, password change
   - Access: Requires authentication

### Navigation Testing

#### Hash-based Navigation
```
# Direct URL access
http://localhost:5173/#home
http://localhost:5173/#tools
http://localhost:5173/#login
http://localhost:5173/#register
http://localhost:5173/#profile

# Browser back/forward buttons work correctly
# URL changes reflect in address bar
# Page state is maintained during navigation
```

#### UI Navigation
- Click navigation links in header
- Use "Try It Now" button to go to tools
- Login/Register links work bidirectionally
- Profile access after authentication

### MVP Pattern Testing

#### Model-View-Presenter Communication
1. **User Actions** → Views capture events
2. **Views** → Notify presenters of user actions
3. **Presenters** → Coordinate between models and views
4. **Models** → Handle data and API calls
5. **Data Changes** → Models notify presenters via observer pattern
6. **UI Updates** → Presenters update views with new data

#### Example Flow: User Login
1. User enters credentials in `LoginView`
2. `LoginView` notifies `LoginPresenter` of login attempt
3. `LoginPresenter` calls `UserModel.login()`
4. `UserModel` handles Firebase authentication and API calls
5. `UserModel` notifies `LoginPresenter` of success/failure
6. `LoginPresenter` updates `LoginView` with result
7. On success, navigation to home page occurs

## 🎨 Design Preservation

### Maintained Features
- ✅ All existing CSS styles preserved
- ✅ Responsive design maintained
- ✅ Visual appearance unchanged
- ✅ All animations and transitions work
- ✅ Mobile navigation functions correctly

### Enhanced Features
- ✅ Modal system for profile actions
- ✅ Loading states and error handling
- ✅ Message notifications (success/error)
- ✅ Proper event cleanup and memory management

## 🔧 Technical Implementation

### Router System
```javascript
// Route registration
this.router.addRoute('home', () => this.showHome());
this.router.addRoute('tools', () => this.showTools());

// Navigation
window.location.hash = 'tools';

// Query parameters
this.router.navigateWithParams('profile', { tab: 'settings' });
```

### MVP Communication
```javascript
// View → Presenter
this.notifyPresenter('userAction', { data });

// Model → Presenter (Observer pattern)
this.model.addObserver(this.presenter);

// Presenter → View
this.view.update(data);
```

### State Management
```javascript
// Models use observer pattern
this.model.setData('key', value); // Notifies observers
this.model.getData('key'); // Retrieves data
```

## 🔍 Verification Checklist

### Hash-based Routing ✅
- [x] All navigation uses hash URLs
- [x] Browser back/forward buttons work
- [x] Direct URL access works
- [x] URL reflects current page state

### MVP Pattern ✅
- [x] Models handle data and business logic
- [x] Views handle UI rendering and user input
- [x] Presenters coordinate between models and views
- [x] Observer pattern for data change notifications

### Design Preservation ✅
- [x] All existing styles maintained
- [x] Responsive design works
- [x] No visual changes to user interface
- [x] All functionality preserved

### SPA Behavior ✅
- [x] No page reloads during navigation
- [x] Single HTML file with dynamic content
- [x] State maintained during navigation
- [x] Fast navigation between pages

## 🚨 Known Issues & Solutions

### Issue: Import Errors
**Problem**: Module import errors for Firebase functions
**Solution**: Fixed import statements to use correct function names

### Issue: Route Conflicts
**Problem**: Multiple routes trying to show simultaneously
**Solution**: Implemented proper page hiding/showing logic

### Issue: Memory Leaks
**Problem**: Event listeners not cleaned up
**Solution**: Implemented proper cleanup in BaseView and BasePresenter

## 📝 Development Notes

### File Structure
```
src/
├── js/
│   ├── router/
│   │   └── Router.js
│   ├── models/
│   │   ├── BaseModel.js
│   │   ├── UserModel.js
│   │   ├── ToolsModel.js
│   │   └── ProfileModel.js
│   ├── views/
│   │   ├── BaseView.js
│   │   ├── HomeView.js
│   │   ├── ToolsView.js
│   │   ├── LoginView.js
│   │   ├── RegisterView.js
│   │   └── ProfileView.js
│   └── presenters/
│       ├── BasePresenter.js
│       ├── HomePresenter.js
│       ├── ToolsPresenter.js
│       ├── LoginPresenter.js
│       ├── RegisterPresenter.js
│       └── ProfilePresenter.js
└── main.js (Updated for SPA)
```

### Key Changes
1. **main.js**: Refactored to use router and presenters
2. **CSS**: Added modal, loading, and message styles
3. **Components**: Converted to MVP pattern
4. **Navigation**: Implemented hash-based routing
5. **State**: Added proper state management

## ✅ Success Criteria Met

1. **Hash-based Routing**: ✅ Implemented and working
2. **MVP Pattern**: ✅ Fully implemented across all pages
3. **Design Preservation**: ✅ All existing designs maintained
4. **SPA Behavior**: ✅ Single-page application functionality
5. **Browser Compatibility**: ✅ Works in modern browsers
6. **Responsive Design**: ✅ Mobile and desktop support

The implementation fully satisfies Mandatory Criteria 2 requirements while preserving all existing functionality and design.
