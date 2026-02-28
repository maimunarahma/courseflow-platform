# Testing Private Routes - Quick Guide

## 🧪 Test Scenarios

### Scenario 1: Student trying to access Admin
**Steps:**
1. Login as a student account
2. Try to access: `http://localhost:8081/admin`
3. **Expected:** See "Access Denied" page with:
   - Shield icon
   - "Access Denied" heading
   - "Required role: admin"
   - "Your role: student"
   - Buttons: "Go Back" and "Go to Dashboard"

### Scenario 2: Student trying to add course
**Steps:**
1. Login as student
2. Try to access: `http://localhost:8081/add-course`
3. **Expected:** Same "Access Denied" page

### Scenario 3: Check Header Menu
**As Student:**
- Header dropdown should NOT show "Admin Panel" link
- Should only show: Dashboard, Profile, Logout

**As Admin:**
- Header dropdown SHOULD show "Admin Panel" link
- Should show: Dashboard, Admin Panel, Profile, Logout

### Scenario 4: Direct URL Access (Not Logged In)
**Steps:**
1. Logout completely
2. Try to access: `http://localhost:8081/admin`
3. **Expected:** Redirect to `/login` with loading spinner first

### Scenario 5: Admin Access
**Steps:**
1. Login as admin
2. Access: `http://localhost:8081/admin`
3. **Expected:** Admin dashboard loads normally

## 🎯 Quick Test Commands

### Test in Browser Console:
```javascript
// Check current user
console.log('User:', window.localStorage.getItem('user'));

// Navigate to protected route
window.location.href = '/admin';

// Check auth status
fetch('http://localhost:5000/api/user/me', { credentials: 'include' })
  .then(r => r.json())
  .then(d => console.log('Auth check:', d));
```

## ✅ Checklist

- [ ] Student cannot access `/admin`
- [ ] Student cannot access `/add-course`
- [ ] Admin can access `/admin`
- [ ] Admin can access `/add-course`
- [ ] Unauthenticated redirects to `/login`
- [ ] "Access Denied" page shows correct roles
- [ ] Header shows/hides admin link correctly
- [ ] Navigation buttons work on Access Denied page
- [ ] Loading spinner shows during auth check
- [ ] `/unauthorized` route works

## 🐛 Common Issues & Fixes

### Issue: Admin can't access admin page
**Fix:** Check user object in AuthContext:
```javascript
// In browser console
JSON.parse(localStorage.getItem('user'))
// Should show: { role: 'admin', ... }
```

### Issue: Student can access admin page
**Fix:** 
1. Check if `<Private requiredRole="admin">` wrapper is in App.tsx
2. Verify auth context returns correct user.role
3. Check backend `/user/me` returns correct role

### Issue: Infinite redirect loop
**Fix:** Make sure `redirectTo` in Private component doesn't point to another protected route

### Issue: Always shows loading
**Fix:** Check AuthContext `loading` state:
```tsx
// In AuthContext.tsx
console.log('Auth loading:', loading);
console.log('User:', user);
```

## 📋 Manual Testing Script

```bash
# 1. Test as Student
# - Register new account with role='student'
# - Login
# - Try http://localhost:8081/admin → Should see Access Denied
# - Try http://localhost:8081/add-course → Should see Access Denied
# - Check header → No "Admin Panel" link

# 2. Test as Admin
# - Login with admin account
# - Try http://localhost:8081/admin → Should load admin page
# - Try http://localhost:8081/add-course → Should load add course page
# - Check header → Should see "Admin Panel" link

# 3. Test Unauthenticated
# - Logout
# - Try http://localhost:8081/admin → Redirects to /login
# - Try http://localhost:8081/dashboard → Loads (if not protected)

# 4. Test Unauthorized Page
# - As student, access: http://localhost:8081/unauthorized
# - Should see styled unauthorized page
```

## 🔍 Debug Tips

### Check Auth State:
```tsx
// Add to any component
import { useAuth } from '@/contexts/AuthContext';

function DebugAuth() {
  const { user, isAuthenticated, loading } = useAuth();
  
  return (
    <pre>
      {JSON.stringify({ user, isAuthenticated, loading }, null, 2)}
    </pre>
  );
}
```

### Check Route Protection:
```tsx
// In App.tsx, add console.log
<Route path="/admin" element={
  <Private requiredRole="admin">
    {console.log('Rendering admin with user:', user)}
    <Admin />
  </Private>
} />
```

### Monitor Auth Context:
```tsx
// In AuthContext.tsx, add logs
useEffect(() => {
  console.log('Auth state changed:', { user, isAuthenticated, loading });
}, [user, isAuthenticated, loading]);
```

## 📸 Expected Screenshots

### Access Denied (Student trying to access admin):
```
┌─────────────────────────────────┐
│          [Shield Icon]          │
│                                 │
│        Access Denied            │
│                                 │
│  You don't have permission to   │
│     access this page            │
│                                 │
│   Logged in as: John Doe        │
│   Role: student                 │
│                                 │
│   Required role: admin          │
│   Your role: student            │
│                                 │
│  [Go Back]  [Go to Dashboard]  │
└─────────────────────────────────┘
```

### Header Dropdown (Student):
```
┌────────────────────────┐
│ John Doe               │
│ john@example.com       │
├────────────────────────┤
│ 📊 Dashboard           │
│ 👤 Profile             │
├────────────────────────┤
│ 🚪 Log out             │
└────────────────────────┘
```

### Header Dropdown (Admin):
```
┌────────────────────────┐
│ Admin User             │
│ admin@example.com      │
├────────────────────────┤
│ 📊 Dashboard           │
│ 🛡️ Admin Panel         │  ← Only for admin
│ 👤 Profile             │
├────────────────────────┤
│ 🚪 Log out             │
└────────────────────────┘
```

## ✨ Success Criteria

All tests pass when:
1. ✅ Students see "Access Denied" for admin routes
2. ✅ Admins can access all admin routes
3. ✅ UI elements (header links) respect roles
4. ✅ Proper redirects for unauthenticated users
5. ✅ Loading states show during auth checks
6. ✅ Error messages are clear and helpful
7. ✅ Navigation works from error pages
8. ✅ No console errors
9. ✅ Backend also validates roles (important!)

## 🎉 Done!

Your app now has complete role-based access control. Students are restricted from admin areas with proper feedback and navigation options.
