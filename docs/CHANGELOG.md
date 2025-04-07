# Changelog

All notable changes to the EMIR platform will be documented in this file.

## [1.1.4] - 2024-04-07
### Added
- User deletion functionality for admins and moderators
- Role selection during user creation
- Enhanced permission checks for user management
- Improved error handling and user feedback

### Changed
- Updated Supabase integration to use @supabase/ssr
- Optimized user profile page for better performance
- Improved error messages and UI feedback
- Enhanced security checks for user management actions

### Fixed
- Resolved issues with user profile page when cards table is missing
- Fixed deprecated auth-helpers usage in API routes
- Improved error handling for failed user operations

## [1.1.3] - 2024-03-28
### Added
- Real-time user activity tracking with last seen timestamps
- User roles with visual badges (admin, moderator, user)
- Enhanced user profile pages with activity statistics
- Middleware for automatic activity tracking
- User list with search functionality
- Profile images support with fallback icons
- Proper date formatting across the platform

## [1.1.2] - 2024-03-21
### Added
- Detailed individual update pages for each version
- Interactive cards and hover effects in updates list
- Version-based navigation between updates
- Two-factor authentication support
- Enhanced password hashing algorithm
- Rate limiting for API endpoints
- Improved session management
- Updated security headers configuration

### Security
- Fixed potential XSS vulnerabilities
- Enhanced security measures across the platform

## [1.1.0] - 2024-03-14
### Performance
- Optimized database queries for faster data loading
- Improved caching mechanism for frequently accessed data
- Fixed memory leaks in long-running sessions
- Enhanced error handling and logging
- Reduced bundle size for faster initial load
- Implemented lazy loading for heavy components

### UI/UX
- Fixed UI rendering issues in dark mode
- Improved form validation feedback
- Enhanced mobile responsiveness
- Added loading states for better feedback
- Fixed alignment issues in tables
- Improved error message clarity
- Added tooltips for better feature discovery

## [1.0.0] - 2024-03-07
### Initial Release
- User authentication and authorization
- Dashboard layout and navigation
- Quote cards creation interface
- User management system
- Profile settings

## Versioning

We follow [Semantic Versioning](https://semver.org/) for our releases:
- MAJOR version (1.0.0) for incompatible API changes
- MINOR version (1.1.0) for backwards-compatible functionality additions
- PATCH version (1.1.1) for backwards-compatible bug fixes 