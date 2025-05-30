# Profile Image Update Fix

## Problem
When users upload a new profile image on the profile page, the image updates successfully in the profile page but doesn't update in the navbar. The navbar continues to show the old profile image until the page is refreshed.

## Root Cause
The issue was that the ProfilePresenter only updated the ProfileView with the new user data after a successful image upload, but it didn't notify the main App class to update the navbar (UserProfile component). The navbar only gets updated when the main App class calls `updateUIForLoggedInUser()`, which typically happens during auth state changes.

## Solution Implemented

### 1. **Added Event-Based Communication**
- **ProfilePresenter** now dispatches a custom `profileUpdated` event when profile data changes
- **Main App class** listens for this event and updates the navbar accordingly

### 2. **Fixed Photo URL Handling**
- Updated the main App class to properly handle backend relative photo URLs
- Added `getProfileImageUrl()` helper method that converts relative paths to full URLs
- Ensures backend photos like `/profiles/photo-firebase-user-id.jpg` are properly displayed

### 3. **Code Changes Made**

#### ProfilePresenter.js
```javascript
// Added notification after successful image upload
async handleImageUpload(file) {
  // ... existing code ...
  if (result.success) {
    this.view.updateUserData(this.model.getCurrentUser(), result.user);
    this.view.showSuccess("Profile image updated successfully");
    
    // NEW: Notify the main app about the profile update
    this.notifyProfileUpdate(this.model.getCurrentUser(), result.user);
  }
}

// NEW: Method to dispatch profile update events
notifyProfileUpdate(currentUser, backendUser) {
  const profileUpdateEvent = new CustomEvent('profileUpdated', {
    detail: { currentUser, backendUser }
  });
  document.dispatchEvent(profileUpdateEvent);
}
```

#### main.js
```javascript
// Added event listener for profile updates
setupCustomEventListeners() {
  // ... existing listeners ...
  
  // NEW: Listen for profile updates
  document.addEventListener("profileUpdated", (event) => {
    const { currentUser, backendUser } = event.detail;
    console.log("Profile updated event received, updating navbar...");
    this.updateUIForLoggedInUser(currentUser, backendUser);
  });
}

// NEW: Helper method for proper photo URL handling
getProfileImageUrl(backendUser, currentUser) {
  if (backendUser?.photoUrl) {
    if (backendUser.photoUrl.startsWith("http")) {
      return backendUser.photoUrl; // Full URL
    } else {
      return `https://server.anevia.my.id${backendUser.photoUrl}`; // Relative path
    }
  } else if (currentUser?.photoURL) {
    return currentUser.photoURL; // Firebase photo
  }
  return "./src/assets/default-avatar.svg"; // Default
}
```

## API Integration
The fix properly handles the API response format:

```json
{
  "error": false,
  "message": "Profile image uploaded successfully",
  "user": {
    "uid": "firebase-user-id",
    "username": "johndoe",
    "email": "john@example.com",
    "photoUrl": "/profiles/photo-firebase-user-id.jpg",
    "birthdate": "1990-01-01T00:00:00.000Z",
    "createdAt": "2023-05-20T12:34:56.789Z"
  }
}
```

The `photoUrl` field contains a relative path that gets converted to a full URL: `https://server.anevia.my.id/profiles/photo-firebase-user-id.jpg`

## Testing Instructions

1. **Login to the application**
2. **Navigate to Profile page** (`#profile`)
3. **Upload a new profile image**:
   - Click on the profile image or "Upload photo" button
   - Select an image file
   - Wait for upload to complete
4. **Verify the fix**:
   - ✅ Profile image should update immediately in the profile page
   - ✅ Profile image should update immediately in the navbar (both desktop and mobile)
   - ✅ No page refresh should be required
   - ✅ Console should show "Profile updated event received, updating navbar..."

## Expected Behavior

- **Before Fix**: Navbar image only updated after page refresh
- **After Fix**: Navbar image updates immediately after successful upload

## Files Modified

1. `src/js/presenters/ProfilePresenter.js` - Added event notification
2. `src/main.js` - Added event listener and photo URL handling

This fix ensures that all UI components stay synchronized when profile data changes, providing a seamless user experience.
