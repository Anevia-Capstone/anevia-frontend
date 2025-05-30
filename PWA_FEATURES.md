# PWA Features - Anevia Frontend

## Overview
Anevia has been enhanced with Progressive Web App (PWA) capabilities, enabling offline functionality, caching, and native app-like experience.

## Features Implemented

### 1. Service Worker & Caching
- **Automatic Service Worker Registration**: Handles caching and offline functionality
- **Cache Strategies**:
  - **Cache First**: Static assets (CSS, JS, images, fonts)
  - **Network First**: API calls with fallback to cache
  - **Stale While Revalidate**: HTML pages
- **Runtime Caching**: External resources (Google Fonts, CDNs)

### 2. Offline Functionality
- **Offline Page**: Custom offline fallback page with available features
- **Cached Data Access**: Previously viewed scan results and user data
- **Network Status Detection**: Real-time online/offline status indicators
- **Offline Data Queue**: Queues requests when offline and syncs when back online

### 3. App Installation
- **Web App Manifest**: Enables "Add to Home Screen" functionality
- **Install Prompts**: Smart install notifications for eligible users
- **App Icons**: Multiple sizes for different devices (192x192, 512x512)
- **Standalone Mode**: Full-screen app experience when installed

### 4. Update Management
- **Automatic Updates**: Service worker updates automatically
- **Update Notifications**: User-friendly update prompts
- **Background Sync**: Syncs data when connection is restored

### 5. Performance Optimizations
- **Resource Precaching**: Critical assets cached on first visit
- **Image Optimization**: Efficient caching of images and media
- **Font Caching**: Google Fonts cached for offline use
- **API Response Caching**: Smart caching of API responses

## File Structure

```
src/
├── js/
│   └── utils/
│       ├── pwa.js              # PWA manager and utilities
│       └── offline-api.js      # Offline-capable API wrapper
├── css/
│   └── pwa.css                 # PWA-specific styles
public/
├── offline.html                # Offline fallback page
├── manifest.json               # Web app manifest (auto-generated)
├── pwa-192x192.png            # App icon 192x192
├── pwa-512x512.png            # App icon 512x512
├── browserconfig.xml          # Windows tile configuration
└── sw.js                      # Service worker (auto-generated)
```

## Configuration

### Vite PWA Plugin Configuration
```javascript
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf,eot}'],
    maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50MB
    runtimeCaching: [
      // Google Fonts, CDNs, API endpoints, images
    ]
  },
  manifest: {
    name: 'Anevia - Early Anemia Detection',
    short_name: 'Anevia',
    description: 'Early anemia detection through eye analysis using AI technology',
    theme_color: '#1a237e',
    background_color: '#ffffff',
    display: 'standalone',
    // ... more manifest options
  }
})
```

## Usage

### For Users
1. **Installation**: Visit the app in a supported browser and look for install prompts
2. **Offline Access**: Continue using the app even without internet connection
3. **Updates**: App updates automatically in the background
4. **Native Experience**: Installed app behaves like a native mobile app

### For Developers
1. **Cache Management**: Use `pwaManager` for custom caching needs
2. **Offline API**: Use `offlineAPI` for network-aware API calls
3. **Status Monitoring**: Listen for online/offline events
4. **Data Sync**: Implement custom sync logic for offline data

## API Reference

### PWA Manager (`pwaManager`)
```javascript
// Cache user data
await pwaManager.cacheUserData('key', data);

// Get cached data
const data = await pwaManager.getCachedUserData('key');

// Check cache size
const size = await pwaManager.getCacheSize();

// Clear all caches
await pwaManager.clearCache();
```

### Offline API (`offlineAPI`)
```javascript
// Network-aware API calls
const scans = await offlineAPI.getAllScans();

// Save offline data
await offlineAPI.saveOfflineData('key', data);

// Check offline status
const isOffline = offlineAPI.isOffline();
```

## Browser Support
- Chrome/Edge 67+
- Firefox 63+
- Safari 11.1+
- iOS Safari 11.3+
- Android Chrome 67+

## Testing PWA Features

### Development
1. Run `npm run dev`
2. Open DevTools → Application → Service Workers
3. Test offline functionality by checking "Offline" in Network tab

### Production
1. Run `npm run build`
2. Serve the `dist` folder with a static server
3. Test installation prompts and offline functionality

## Performance Benefits
- **Faster Loading**: Cached resources load instantly
- **Reduced Data Usage**: Cached content reduces network requests
- **Better UX**: App works even with poor connectivity
- **Native Feel**: Installed app provides native app experience

## Security Considerations
- Service worker only works over HTTPS (or localhost)
- Cached data is stored securely in browser storage
- Automatic cache cleanup prevents storage bloat
- Token-based authentication works offline with cached tokens
