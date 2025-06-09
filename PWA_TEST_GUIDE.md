# PWA Testing Guide - Anevia

## Quick Testing Steps

### 1. Development Testing
```bash
# Start development server
npm run dev

# Open browser to http://localhost:5173
# Open DevTools → Application tab
```

### 2. Service Worker Verification
1. Go to **Application → Service Workers** in DevTools
2. Verify service worker is registered and running
3. Check **Application → Storage** for cached resources

### 3. Offline Testing
1. In DevTools → **Network** tab, check "Offline"
2. Refresh the page - should still work
3. Navigate between pages - should work from cache
4. Try accessing previously viewed scan results

### 4. Cache Testing
1. **Application → Storage → Cache Storage**
2. Verify these caches exist:
   - `workbox-precache-v2-[hash]` (static assets)
   - `google-fonts-cache` (Google Fonts)
   - `api-cache` (API responses)
   - `images-cache` (images)
   - `anevia-user-data-v1` (user data)

### 5. Install Testing
1. Look for install prompt in address bar (Chrome/Edge)
2. Or use **Application → Manifest → Install** button
3. Verify app opens in standalone mode

### 6. Production Testing
```bash
# Build for production
npm run build

# Serve the dist folder (use any static server)
npx serve dist

# Test all PWA features in production build
```

## Expected Behaviors

### ✅ Working Offline
- App loads and displays cached content
- Previously viewed scan results are accessible
- Navigation between cached pages works
- Offline indicator appears when disconnected

### ✅ Caching
- Static assets (CSS, JS, images) load instantly on repeat visits
- Google Fonts load from cache
- API responses are cached and available offline
- Large images are cached efficiently

### ✅ Installation
- Install prompt appears for eligible users
- App can be added to home screen
- Installed app opens in standalone mode
- App icon appears correctly

### ✅ Updates
- Service worker updates automatically
- Update notification appears when new version is available
- Users can manually trigger updates

## Troubleshooting

### Service Worker Not Registering
- Check console for errors
- Ensure HTTPS or localhost
- Clear browser cache and reload

### Offline Mode Not Working
- Verify service worker is active
- Check cache storage in DevTools
- Ensure resources are properly cached

### Install Prompt Not Showing
- Check manifest.json is valid
- Ensure PWA criteria are met
- Try in incognito mode

### Cache Issues
- Clear all caches in DevTools
- Check cache size limits
- Verify cache strategies in network tab

## Browser DevTools Commands

```javascript
// Check service worker status
navigator.serviceWorker.getRegistrations()

// Check cache storage
caches.keys()

// Check if app is installed
window.matchMedia('(display-mode: standalone)').matches

// Check online status
navigator.onLine

// Access PWA manager (in console)
pwaManager.getCacheSize()
```

## Performance Verification

### Lighthouse PWA Audit
1. Open DevTools → Lighthouse
2. Select "Progressive Web App" category
3. Run audit
4. Should score 90+ for PWA compliance

### Network Performance
1. Check **Network** tab during page load
2. Verify cached resources show "(from ServiceWorker)"
3. Measure load times with and without cache

## Mobile Testing

### Android Chrome
1. Visit app URL
2. Look for "Add to Home Screen" banner
3. Install and test standalone mode

### iOS Safari
1. Visit app URL
2. Tap Share → "Add to Home Screen"
3. Test app icon and splash screen
