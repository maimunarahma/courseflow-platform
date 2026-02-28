# Private Routes & Role-Based Access Control

## Overview
Complete implementation of role-based access control (RBAC) to protect admin routes and restrict access based on user roles.

## Components Created

### 1. **Private Component** (`src/pages/Private.tsx`)
Enhanced private route component with:
- ✅ Loading state while checking authentication
- ✅ Redirect to login if not authenticated
- ✅ Beautiful "Access Denied" page with role information
- ✅ Role-based access control
- ✅ Navigation options (Go Back, Dashboard)

**Usage:**
```tsx
<Route path="/admin" element={
  <Private requiredRole="admin">
    <Admin />
  </Private>
} />

<Route path="/add-course" element={
  <Private requiredRole="admin">
    <AddCourse />
  </Private>
} />
```

**Props:**
- `requiredRole?: 'student' | 'admin' | 'instructor'` - Required user role (default: 'admin')
- `redirectTo?: string` - Where to redirect if not authenticated (default: '/login')

### 2. **ProtectedRoute Component** (`src/components/ProtectedRoute.tsx`)
Flexible route protection with multiple variants:

**Main Component:**
```tsx
<ProtectedRoute requireRole="admin">
  <AdminPage />
</ProtectedRoute>
```

**Shorthand Components:**
```tsx
// Admin only
<AdminRoute><Admin /></AdminRoute>

// Student only
<StudentRoute><StudentDashboard /></StudentRoute>

// Any authenticated user
<AuthRoute><Dashboard /></AuthRoute>
```

### 3. **Unauthorized Page** (`src/pages/Unauthorized.tsx`)
Beautiful access denied page with:
- ✅ Gradient background
- ✅ User info display (name, role)
- ✅ Multiple navigation options
- ✅ Help text and switch account option
- ✅ Role-specific dashboard links

### 4. **Permission Utilities** (`src/lib/permissions.ts`)
Helper functions for role checking:

```typescript
import { isAdmin, isStudent, hasRole, hasAnyRole } from '@/lib/permissions';

// Check if user is admin
if (isAdmin(user)) {
  // Show admin features
}

// Check if user is student
if (isStudent(user)) {
  // Show student features
}

// Check specific role
if (hasRole(user, 'admin')) {
  // Admin-only code
}

// Check multiple roles
if (hasAnyRole(user, ['admin', 'instructor'])) {
  // Code for admin or instructor
}

// Get display name
const displayName = getRoleDisplayName(user.role); // "Administrator"

// Get badge classes
const badgeClass = getRoleBadgeClass(user.role); // "bg-red-100 text-red-800..."
```

## Updated Components

### **App.tsx**
Protected routes:
```tsx
{/* Admin only - explicitly requires admin role */}
<Route path="/admin" element={
  <Private requiredRole="admin"><Admin /></Private>
} />

{/* Add course - admin only */}
<Route path="/add-course" element={
  <Private requiredRole="admin"><AddCourse /></Private>
} />

{/* Unauthorized page */}
<Route path="/unauthorized" element={<Unauthorized />} />
```

### **Header.tsx**
Admin Panel link shows only for admins:
```tsx
{user?.role === 'admin' && (
  <DropdownMenuItem asChild>
    <Link to="/admin">
      <Shield className="mr-2 h-4 w-4" />
      Admin Panel
    </Link>
  </DropdownMenuItem>
)}
```

## User Roles

### Available Roles:
1. **student** - Regular users who enroll in courses
2. **admin** - Full access to admin panel, course management
3. **instructor** - (Future) Course creators and instructors

### Role Hierarchy:
```
admin > instructor > student
```

## How It Works

### Authentication Flow:
1. User attempts to access protected route
2. `Private` component checks:
   - Is user authenticated? → If no, redirect to login
   - Does user have required role? → If no, show "Access Denied"
   - If yes, render protected content

### Access Denied Flow:
1. Student tries to access `/admin`
2. Private component detects role mismatch
3. Shows beautiful "Access Denied" page with:
   - User's current role
   - Required role
   - Navigation options

## Testing

### Test as Student:
1. Register/Login as student
2. Try to access `/admin` → Should see "Access Denied"
3. Try to access `/add-course` → Should see "Access Denied"
4. Header should NOT show "Admin Panel" link

### Test as Admin:
1. Login as admin
2. Access `/admin` → Should see admin dashboard
3. Access `/add-course` → Should work
4. Header should show "Admin Panel" link

### Test Unauthenticated:
1. Logout
2. Try to access `/admin` → Redirects to `/login`
3. Try to access `/add-course` → Redirects to `/login`

## Example Usage

### Protect Any Route:
```tsx
// Simple admin protection
<Route path="/admin" element={
  <Private requiredRole="admin"><Admin /></Private>
} />

// Student-only route
<Route path="/my-courses" element={
  <Private requiredRole="student"><MyCourses /></Private>
} />

// Custom redirect
<Route path="/settings" element={
  <Private requiredRole="admin" redirectTo="/dashboard">
    <Settings />
  </Private>
} />
```

### In Components:
```tsx
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/lib/permissions';

function MyComponent() {
  const { user } = useAuth();

  return (
    <div>
      {isAdmin(user) && (
        <Button onClick={deleteUser}>Delete User</Button>
      )}
      
      {user?.role === 'student' && (
        <p>Welcome, student!</p>
      )}
    </div>
  );
}
```

### Conditional Navigation:
```tsx
import { useAuth } from '@/contexts/AuthContext';

function Navigation() {
  const { user } = useAuth();

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      
      {user?.role === 'admin' && (
        <>
          <Link to="/admin">Admin Panel</Link>
          <Link to="/add-course">Add Course</Link>
        </>
      )}
      
      {user?.role === 'student' && (
        <Link to="/my-learning">My Learning</Link>
      )}
    </nav>
  );
}
```

## Security Notes

### Frontend Protection:
- ✅ Routes protected with Private component
- ✅ UI elements hidden based on role
- ✅ Redirects for unauthorized access

### Backend Required:
⚠️ **Frontend protection is NOT enough!** Always validate on backend:

```typescript
// Backend route protection example
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  // Only admins can access this
});

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}
```

## Benefits

✅ **User Experience:**
- Clear error messages
- Helpful navigation options
- Loading states
- Professional UI

✅ **Security:**
- Role-based access control
- Proper redirects
- Protected routes

✅ **Developer Experience:**
- Reusable components
- Type-safe utilities
- Easy to implement
- Consistent pattern

## Future Enhancements

### Possible Additions:
1. **Permission-based access** (more granular than roles)
2. **Instructor role** implementation
3. **Custom permissions per user**
4. **Audit logging** for access attempts
5. **Two-factor authentication** for admin
6. **Session management** improvements

### Example Permission System:
```typescript
const permissions = {
  admin: ['read:all', 'write:all', 'delete:all'],
  instructor: ['read:courses', 'write:courses', 'read:students'],
  student: ['read:courses', 'write:assignments']
};

function hasPermission(user, permission) {
  return permissions[user.role]?.includes(permission);
}
```

## Troubleshooting

### Issue: "Access Denied" but user is admin
**Solution:** Check if `user.role` is correctly set in auth context

### Issue: Redirects in infinite loop
**Solution:** Make sure `redirectTo` path doesn't require same role

### Issue: Loading screen shows forever
**Solution:** Check if auth context `loading` state resolves properly

### Issue: Can access admin route despite being student
**Solution:** 
1. Check Private component is wrapping the route
2. Verify `requiredRole` prop is set
3. Ensure backend also validates role

## Summary

Complete role-based access control now implemented:
- ✅ Private routes for admin-only pages
- ✅ Beautiful access denied page
- ✅ Loading states
- ✅ Role utilities
- ✅ Conditional UI elements
- ✅ Proper redirects
- ✅ Type-safe implementation

Students cannot access admin routes, and the system provides clear feedback when access is denied.
