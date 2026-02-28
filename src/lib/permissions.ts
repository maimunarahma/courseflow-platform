import { User } from '@/types';

/**
 * Role-based access control utilities
 */

export const ROLES = {
  STUDENT: 'student' as const,
  ADMIN: 'admin' as const,
  INSTRUCTOR: 'instructor' as const,
};

export type UserRole = typeof ROLES[keyof typeof ROLES];

/**
 * Check if user has a specific role
 */
export const hasRole = (user: User | null, role: UserRole): boolean => {
  return user?.role === role;
};

/**
 * Check if user is admin
 */
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, ROLES.ADMIN);
};

/**
 * Check if user is student
 */
export const isStudent = (user: User | null): boolean => {
  return hasRole(user, ROLES.STUDENT);
};

/**
 * Check if user is instructor
 */
export const isInstructor = (user: User | null): boolean => {
  return hasRole(user, ROLES.INSTRUCTOR);
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean => {
  return roles.some(role => hasRole(user, role));
};

/**
 * Get user role display name
 */
export const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    student: 'Student',
    admin: 'Administrator',
    instructor: 'Instructor',
  };
  return roleMap[role] || role;
};

/**
 * Get role badge color classes
 */
export const getRoleBadgeClass = (role: string): string => {
  const roleClasses: Record<string, string> = {
    student: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    instructor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  };
  return roleClasses[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
};
