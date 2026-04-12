# Changelog

All notable changes to this project will be documented in this file.

## [1.3.5] - 2026-04-12
### Changed
- Performance Optimization: Integrated `priority` loading for above-the-fold images in the project grid and detail pages. Resolved Next.js LCP (Largest Contentful Paint) warnings.

## [1.3.4] - 2026-04-12
### Added
- High-visibility `FeedbackToast` system-alert that prompts users for suggestions.
- `animate-terminal-pulse` animation for highlighting critical Calls to Action (CTA).
- Highlighted `[!] [SUBMIT_FEEDBACK]` link in footer with rhythmic green glow.

## [1.3.3] - 2026-04-12
### Added
- Administrative Review Moderation Dashboard (`/ace/reviews`) to manage user feedback.
- Backend support for updating and deleting review logs.

### Changed
- Shifted reviews to a private-by-default model. Public users can now only submit feedback, while previous logs are hidden to ensure privacy.
- Enhanced Admin Panel with a dedicated module for review moderation.

## [1.3.2] - 2026-04-12
### Added
- Dedicated `/feedback` page for general site reviews and suggestions.
- "Submit Feedback" link in footer for easier access.
- `AI Enhanced` category to categorization system.
- Formal `CHANGELOG.md` for version tracking.

### Changed
- Refactored `ReviewSystem` to support both project-specific and site-wide feedback.

## [1.3.1] - 2026-04-12
### Fixed
- Category filter engine logic (now targets primary categories instead of tags).
- Global cursor pointers for interactive elements.

### Added
- Section-wise categorization in the gallery.
- Skeleton loading state for smoother projects grid entrance.
- Advanced date tracking: Initialization and Completion dates.
- Interactive status indicators (DEVELOPMENT pulse vs PRODUCTION).
- New categories: `Template`, `Production/Launched`.
- Integrated `ReviewSystem` component for project-specific feedback.
- Widened admin project management modal for better data entry.

## [1.2.0] - 2026-03-27
### Added
- Custom SMTP-OTP authentication system.
- Admin portal (`/ace`) with secure dashboard.
- Project detail sections: "Why I Created This" and "Problem It Solves".
- Terminal-themed 404 page and visual design.
- Search terminal integrated into sticky top header.

## [1.0.0] - 2026-03-20
### Added
- Initial release of the Project Showcase Platform.
- Google Sheets integration for project data.
- Responsive project gallery grid.
- Dynamic project detail pages (ISR).
