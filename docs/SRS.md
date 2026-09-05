# Atrio Software Services Platform
# Software Requirements Specification (SRS)

**Version:** 2.0  
**Status:** V1 requirements locked  
**Implementation target:** Claude Code  
**Primary market:** Bahrain  
**Regional phone support:** GCC only  
**Deployment:** Vercel

---

# 1. Source of Truth

This document is the implementation source of truth for V1.

If an older specification conflicts with this document, this document wins.

The current visual reference supplied by the product owner is also a source of truth for the public-facing UI. The screenshots are included in the `ui-reference/` directory beside this SRS.

The implementation must preserve the visual character, hierarchy, spacing, color usage, typography scale, rounded geometry, modal behavior, and one-page scrolling structure shown in the supplied UI.

Do not redesign the product into a generic SaaS dashboard or multi-page agency website.

---

# 2. Mandatory Technology Stack

The project must use the following technologies.

## 2.1 Application

- Next.js
- TypeScript
- React
- Next.js App Router
- Next.js for both frontend and backend
- Next.js Server Components where appropriate
- Next.js Route Handlers and/or Server Actions for backend functionality

There is no separate Express, FastAPI, NestJS, Laravel, or other backend application.

## 2.2 Database

- PostgreSQL

The exact PostgreSQL hosting provider is not mandated by this SRS as long as it is production-ready and compatible with Vercel.

The implementation may use a TypeScript-compatible PostgreSQL database layer or ORM, but it must not replace PostgreSQL with another database.

## 2.3 Email

- Resend

All transactional email described in this document must be sent through Resend.

## 2.4 Deployment

- Vercel

The Next.js application must be deployable to Vercel.

Production configuration must not depend on a persistent local filesystem.

## 2.5 Image / file storage

Portfolio images and uploaded company assets require durable storage because the Vercel runtime filesystem is not persistent.

The implementation must use a persistent object/file storage solution compatible with Vercel.

This SRS does not force a specific provider.

If no separate product decision is supplied during implementation, prefer the simplest Vercel-compatible option and isolate it behind a small storage service so it can be replaced later.

Do not store uploaded images only on the Vercel local filesystem.

---

# 3. Product Summary

Atrio is a Bahrain-based software services company focused initially on small businesses.

Atrio provides practical software services and solutions such as:

- Websites and web applications
- Business software
- Automation
- AI solutions

The company should be positioned around solving business problems rather than selling technical packages.

The core idea is:

> The customer explains the business problem. Atrio handles the software complexity.

The product has three major areas:

1. Public one-page marketing website
2. Customer project portal
3. Internal admin system

---

# 4. Product Principles

The product must feel:

- Simple
- Direct
- Modern
- Premium
- Young
- Trustworthy
- Bahraini
- Technically capable
- Easy to use
- Easy to order from

The product must not feel:

- Corporate and bureaucratic
- Overly technical
- Like an enterprise CRM
- Like a generic AI startup
- Like a complicated project-management suite
- Like a checkout flow with packages and add-ons

The user should never need to understand Atrio's internal technical choices to start a project.

---

# 5. V1 Non-Goals

Do not add these features in V1:

- Billing
- Invoices
- Online payments
- Subscriptions
- Pricing package configurator
- Customer approval workflow
- Public customer registration
- Customer-to-team chat
- Internal team chat
- Full CRM
- Sales pipeline
- Kanban board
- Internal task management
- Time tracking
- Advanced analytics
- Complex support ticket workflow
- Support priorities
- SLA management
- Customer departments
- VAT management
- CR management
- Complex organization roles
- Automatic project progress calculation
- Blog
- E-commerce
- Separate public Services page
- Separate public About page
- Separate public Contact page
- Separate public Previous Work page for V1 marketing navigation

---

# 6. Visual Design Source

The supplied screenshots define the desired public UI direction.

Reference files:

- `ui-reference/01-home-hero-services.png`
- `ui-reference/02-services-section.png`
- `ui-reference/03-process-selected-work.png`
- `ui-reference/04-selected-work.png`
- `ui-reference/05-final-cta-footer.png`
- `ui-reference/06-start-project-modal.png`
- `ui-reference/07-request-success-modal.png`

The implementation must use these references closely rather than generating a new design language.

---

# 7. Brand Palette

Use the following primary colors:

- Off-white: `#F0EBE5`
- Light blue: `#8EABD5`
- Dark blue: `#486FA6`
- Black: `#000000`

Subtle derived shades may be used for:

- Borders
- Hover states
- Focus states
- Disabled states
- Muted text
- Backdrop overlays

Do not introduce unrelated strong colors unless required for accessibility or functional feedback.

---

# 8. Public Website Architecture

## 8.1 One-page requirement

The main public marketing website must be one scrolling page.

The following navigation items must scroll to sections on the same page:

- Home
- Services
- Previous Work
- About
- Contact

Do not create separate marketing routes for those items.

Recommended section anchors:

- `#home`
- `#services`
- `#work`
- `#about`
- `#contact`

Use smooth scrolling while respecting `prefers-reduced-motion`.

## 8.2 Public route

Primary marketing route:

- `/`

The public homepage contains the complete marketing experience.

## 8.3 Utility routes

Utility pages may still exist separately where appropriate:

- `/login`
- `/forgot-password`
- `/set-password`
- `/privacy`
- `/terms`

Authenticated admin and customer portal routes are separate from the one-page marketing website.

---

# 9. Public Navbar

The desktop navbar must visually follow the supplied UI.

Required elements:

- Atrio logo
- Home
- Services
- Previous Work
- About
- Contact
- `EN | عربي` language toggle
- Primary button: `Start a project`

Behavior:

- Marketing navigation links scroll to sections on `/`.
- The language toggle switches the current public UI language.
- Start a project opens the project request modal.
- If the user is on a utility page and selects a marketing link, navigate to `/#section`.

Mobile behavior:

- Compact logo
- Language control
- Mobile menu trigger
- Start a Project remains prominent
- No horizontal overflow
- Touch targets must be comfortable

---

# 10. Public One-Page Section Order

The homepage should follow this overall order:

1. Navbar
2. Hero
3. Services
4. Process
5. Selected Work
6. About / Bahrain positioning
7. Final CTA
8. Contact / footer

The supplied UI screenshots define the preferred visual rhythm.

---

# 11. Hero Section

Use the supplied design as the visual reference.

Default content shown in the reference:

**Eyebrow:**  
BAHRAIN-BASED DIGITAL STUDIO

**Headline:**  
Software built around your business.

**Body:**  
We build websites, business systems, automation and custom software for businesses that want to work smarter.

Primary CTA:

- Start a project

Secondary CTA:

- View our work

Behavior:

- Start a project opens the request modal.
- View our work scrolls to `#work`.

The hero's abstract software/progress visual should be implemented as a responsive visual composition inspired by the screenshot.

Do not replace it with a generic stock image.

---

# 12. Services Section

Use the visual structure shown in the supplied UI.

Section heading:

- What we can take care of

Supporting copy concept:

- No packages to decode. Just the right digital solution for the way you work.

The V1 landing design shows four primary service items:

1. Websites & web applications
2. Business software
3. Automation
4. AI solutions

Each item should contain:

- Number
- Service name
- Short business-oriented description
- Small directional affordance if retained by the design

Example descriptions based on the supplied UI:

### Websites & web applications
A clear digital home that helps your customers take the next step.

### Business software
Practical tools designed around the way your team already works.

### Automation
Less repetitive work, fewer handovers and more time for what matters.

### AI solutions
Useful intelligence applied thoughtfully to your real business tasks.

Do not add a fifth visual card unless the design is intentionally revised.

---

# 13. Process Section

Use the supplied three-card design.

Heading:

- Simple from the start.

Steps:

## 01 Tell us what you need

Describe the business problem or idea in your own words.

## 02 We plan and build it

We determine the right approach, then get to work.

## 03 Follow the progress

Stay close to the project without having to manage the details.

This section should reinforce the core product philosophy that ordering software from Atrio is simple.

---

# 14. Selected Work Section

Use the supplied dark section treatment.

Heading:

- Selected work

The section displays portfolio projects managed by admins.

Each project card should support:

- Category / business type
- Project title
- Main visual
- Link/interaction to see more

The public portfolio must be database-driven.

Admins must be able to:

- Add a portfolio project
- Upload images
- Edit project content
- Publish/hide project
- Reorder projects
- Mark projects as featured

## 14.1 One-page behavior

The main marketing site must remain one page.

Do not require a separate Previous Work marketing page.

`See all projects` should use one of these one-page behaviors:

Preferred V1 behavior:

- Expand the work section in-place to show all published projects

Alternative acceptable behavior:

- Open a full-screen portfolio overlay/modal on the same route

Do not navigate to a separate `/work` marketing page in V1.

## 14.2 Project detail behavior

If more detail is needed, open it in:

- A modal
- Drawer
- Full-screen overlay

Keep the user on `/`.

---

# 15. About Section

The navbar includes About, so the homepage must include an `#about` section.

Keep it concise.

Required themes:

- Bahrain-based company
- Software built around the business
- Direct communication
- Simple process
- Practical digital solutions
- Focus on small businesses initially

Avoid generic mission/vision filler.

This content must be editable by admins in English and Arabic.

---

# 16. Final CTA

Use the supplied large blue CTA block.

Default reference content:

**Eyebrow:**  
LET'S MAKE IT SIMPLER

**Heading:**  
Have a problem software could solve?

**Body:**  
Tell us what your business needs. You do not need to know the technical solution.

CTA:

- Start a project

Behavior:

- Opens the Start a Project modal

---

# 17. Footer / Contact

The footer also serves as the Contact section and should use `id="contact"`.

Use the supplied footer style.

Show:

- Atrio logo
- Short company line
- Manama, Bahrain
- Company email
- Company phone
- Instagram
- LinkedIn
- Optional WhatsApp link

Public contact details must be editable from admin settings.

---

# 18. Public Website Responsiveness

The public one-page site must be extremely responsive.

This is a hard requirement.

Test at:

- 320px
- 360px
- 390px
- 430px
- 768px
- 1024px
- 1440px+

Requirements:

- No horizontal scroll
- No clipped hero text
- No broken card geometry
- Responsive portfolio cards
- Responsive modals
- Readable type
- Touch-friendly controls
- Mobile navbar
- Full-width or near full-width mobile forms
- Minimum 16px input text on mobile
- Correct spacing on small devices
- Images must scale and crop correctly

The mobile experience is not a reduced-priority desktop adaptation. It must be deliberately designed.

---

# 19. English / Arabic Toggle

The navbar must include:

`EN | عربي`

English:

- LTR

Arabic:

- RTL

Arabic mode must correctly change:

- Text direction
- Content alignment
- Navbar order where appropriate
- Form direction
- Card alignment
- Directional icons where appropriate
- Spacing behavior

Phone numbers and email addresses must remain readable.

Language choice should persist using a cookie or equivalent preference.

The public one-page layout must work in both languages.

---

# 20. Admin-Editable Public Content

Admins must be able to modify landing page text from the system.

The public copy must not require a code deployment to change.

At minimum, admins can edit:

- Hero eyebrow
- Hero heading
- Hero body
- Hero button labels
- Services section heading/body
- Service names/descriptions
- Process heading
- Process step names/descriptions
- About section
- Final CTA eyebrow
- Final CTA heading
- Final CTA body
- Final CTA button label
- Footer company description
- Contact labels where appropriate

Each editable public text field must support:

- English
- Arabic

The system is a structured content editor, not a free-form page builder.

Do not implement WordPress-like drag-and-drop editing.

---

# 21. Start a Project Interaction

The Start a Project action should follow the supplied modal design.

It is not a separate public marketing page in V1.

The modal opens over the current homepage.

The background should dim.

The modal must:

- Trap focus
- Close using the X button
- Close with Escape
- Prevent background scrolling while open
- Restore focus to the trigger after closing
- Work correctly on mobile

---

# 22. Start a Project Form

The form must remain intentionally minimal.

## 22.1 Business Type

- Optional
- Select/dropdown

Suggested options:

- Restaurant / Cafe
- Retail
- Salon / Beauty
- Healthcare
- Professional Services
- Construction
- E-commerce
- Startup
- Other

## 22.2 Name

- Optional

## 22.3 Business Name

The product requirement allows this to be optional.

The supplied UI currently does not visually include it.

Implementation choice for V1:

- Include it only if it fits without making the modal feel heavier
- If omitted from the visible modal, do not block project submission
- It can be added later without database redesign

## 22.4 Description

Label based on current UI:

- What can we help with?

Required.

Placeholder:

Tell us what you need, what problem you're facing, or what you'd like us to build.

Validation:

- Required
- Minimum 10 characters
- Maximum 5000 characters

## 22.5 Email

Required.

Validation:

- Proper email format
- Trim whitespace
- Normalize safely

## 22.6 Phone / WhatsApp

Required.

GCC only.

Default country:

- Bahrain `+973`

## 22.7 Submit button

Label:

- Send request

The button must show a loading/submitting state.

Prevent duplicate submissions.

---

# 23. GCC Phone Input

Supported countries only:

- Bahrain `+973`
- Saudi Arabia `+966`
- United Arab Emirates `+971`
- Qatar `+974`
- Kuwait `+965`
- Oman `+968`

Default:

- Bahrain `+973`

Visual behavior should follow the supplied modal:

`[ 🇧🇭 +973 ▼ ] [ Phone number ]`

Requirements:

- Do not include non-GCC countries
- Country selector must be keyboard accessible
- Phone must be required
- Server-side validation required
- Normalize to international format
- Reject letters
- Reject negative signs
- Remove harmless spaces/hyphens during normalization

---

# 24. General Numeric Validation

Any number-only field must reject invalid negative values where negatives do not make sense.

Project progress:

- Integer
- Minimum 0
- Maximum 100

Validation must exist on both client and server.

Do not rely only on `input type="number"`.

---

# 25. Project Request Submission Flow

When the customer submits a valid request:

1. Validate server-side
2. Store the request in PostgreSQL
3. Send confirmation email to customer using Resend
4. Send internal notification using Resend
5. Display the success modal state

The request must remain stored even if email delivery fails.

Email failure must not delete or rollback the request.

---

# 26. Project Request Success State

Use the supplied success modal design.

Default text:

**Request received.**

We've received your request and sent a confirmation to your email. Our team will be in touch soon.

Button:

- Done

Behavior:

- Done closes the modal
- The form should be reset after successful submission
- Reopening Start a Project should show a fresh form

If the request was stored but confirmation email failed:

- The request is still successful
- Do not tell the customer the request failed
- Adjust the success copy so it does not falsely claim the email was sent

---

# 27. Request Emails

## 27.1 Customer confirmation email

Send via Resend.

Recipient:

- Customer's submitted email

Required content:

- Confirm Atrio received the request
- State that the team will review it
- Include submitted description or concise summary
- Atrio branding
- Contact information

Do not promise a specific response time unless configured later.

## 27.2 Internal new-request email

Send via Resend.

Recipient:

- Configured internal Atrio notification addresses

Include:

- Name if provided
- Business name if provided
- Business type if provided
- Email
- Phone
- Full description
- Submission timestamp
- Link to admin request detail

---

# 28. User Roles

V1 has three logical user types.

## 28.1 Visitor

Can:

- Browse the one-page public site
- Switch language
- View previous work
- Submit a project request

## 28.2 Customer

Authenticated.

Can:

- Log in
- Set/reset password
- View own project(s)
- View project progress
- View project status
- View project updates
- Submit support request

Cannot:

- Register publicly
- Edit project progress
- Edit project status
- Approve project stages
- View other customers
- Access admin

## 28.3 Admin

Authenticated internal user.

Can:

- View requests
- Create customer accounts
- Create projects
- Manage project status
- Manage project progress
- Assign project members
- Publish project updates
- View support requests
- Manage portfolio
- Manage public website text
- Manage team members
- Manage company settings

---

# 29. Customer Registration Model

There is no public customer signup.

An admin creates the customer account from the submitted project request.

The customer is then invited by email.

The system should reuse the submitted contact information.

Prefill from request:

- Name if available
- Email
- Phone
- Business name if available

Admin can edit values before account creation.

---

# 30. Customer Invitation

When admin creates a new customer account:

1. Create customer in PostgreSQL
2. Generate secure one-time setup token
3. Send account setup email through Resend
4. Customer opens set-password flow
5. Customer sets password
6. Customer account becomes active

Never email a plaintext generated password.

Invitation token must:

- Expire
- Be single-use
- Be stored securely
- Not be stored in plaintext if a custom token system is used

---

# 31. Authentication Requirements

The authentication implementation must be compatible with:

- Next.js
- PostgreSQL
- Vercel

This SRS does not mandate a specific authentication package.

Requirements:

- Secure password hashing
- Secure session cookies
- Server-side authorization
- Customer password setup
- Customer forgot-password
- Admin login
- Customer login
- Logout
- Expiring password reset tokens
- No plaintext password storage
- No public registration

---

# 32. Customer Portal

The customer portal is intentionally simple.

Suggested routes:

- `/portal`
- `/portal/projects/[id]`

It does not contain:

- Billing
- Approvals
- Chat
- Task management
- Invoices
- Payments

---

# 33. Customer Dashboard

Show:

- Welcome message
- Customer project cards

Each project card contains:

- Project name
- Status
- Progress percentage
- Progress bar
- Latest update date
- Open Project action

If the customer has only one project, the UI may emphasize that project directly.

---

# 34. Customer Project Page

Required:

- Project name
- Project description
- Status
- Progress
- Last updated
- Project updates
- Support form

---

# 35. Project Statuses

V1 has exactly four statuses:

1. Pending Team Approval
2. Development
3. Testing
4. Done

Internal enum recommendation:

- `PENDING_TEAM_APPROVAL`
- `DEVELOPMENT`
- `TESTING`
- `DONE`

Do not add:

- Planning
- Design
- On Hold
- Review
- Deployed
- Archived

unless the product requirements are changed later.

---

# 36. Project Progress

Progress is manually controlled by admin.

Rules:

- Integer
- 0 to 100
- Separate from status
- Shown to customer
- Shown in admin

Do not calculate progress from tasks.

No task system exists in V1.

---

# 37. Project Updates

Admins can write progress updates from the admin project page.

When published:

1. Persist update to PostgreSQL
2. Show update in customer portal
3. Send update to customer through Resend

The update record should store:

- Project
- Author/admin
- Text
- Status snapshot
- Progress snapshot
- Timestamp

Email failure must not remove the persisted update.

---

# 38. Project Update Email

Send via Resend.

Recipient:

- Project customer

Include:

- Project name
- Update text
- Current status
- Current progress
- Link to customer portal

Suggested subject:

`Project update: {Project Name}`

---

# 39. Customer Support

Support is intentionally simple.

On the customer project page:

**Need help?**

Textarea:

- Required
- Minimum 5 characters
- Maximum 5000 characters

Button:

- Send Support Request

Do not include:

- Priority
- Severity
- Category
- Assignee
- SLA
- Ticket status workflow

---

# 40. Support Email Recipients

This is a hard requirement.

When a customer submits a support request:

1. Persist the support request
2. Find every active team member assigned to the project
3. Send the support email to all of them through Resend

All project members receive the email.

Do not send support only to one "owner".

If the project has no active project members:

- Persist the support request
- Send to configured fallback admin/support recipients
- Log the missing assignment

---

# 41. Project Members

A project can have multiple team members.

A team member can belong to multiple projects.

Admin assignment UI should be simple:

- Multi-select
- Checkboxes
- Searchable multi-select if team grows

Only active team members can be newly assigned.

---

# 42. Admin System Navigation

Keep admin navigation simple.

Required:

1. Dashboard
2. Requests
3. Projects
4. Customers
5. Previous Work
6. Website Content
7. Team
8. Settings

No Billing section.

---

# 43. Admin Dashboard

Show only essential information.

Summary:

- New Requests
- Active Projects
- Support Requests
- Completed Projects

Below:

- Recent Requests
- Active Projects
- Recent Support Requests

Do not add unnecessary charts.

---

# 44. Admin Requests

Request list should show:

- Name if provided
- Business name if provided
- Business type if provided
- Email
- Phone
- Description preview
- Submission date
- Conversion state

Request detail should show full submitted data.

Primary action:

- Create Customer & Project

---

# 45. Request Conversion

When admin selects `Create Customer & Project`:

Prefill customer data:

- Name
- Business name
- Email
- Phone

Project defaults:

- Description copied from request
- Status: Pending Team Approval
- Progress: 0

Admin enters:

- Project name
- Assigned project members

Admin may edit prefilled information.

Preserve the original request after conversion.

---

# 46. Existing Customer Handling

If the email already belongs to an existing customer:

- Do not create duplicate customer automatically
- Show the existing customer
- Allow the new project to be attached to them
- Allow admin to update contact details if needed

Do not send a new account setup email to an already active customer.

---

# 47. Admin Projects

Project list:

- Project name
- Customer
- Status
- Progress
- Assigned project members
- Last updated

Allow:

- Search
- Status filter

Keep the list simple.

---

# 48. Admin Project Detail

Required sections:

## Project information

- Project name
- Customer
- Description
- Status selector
- Progress input/control
- Assigned project members
- Created date
- Last updated

## Customer contact

- Name
- Email
- Phone
- Business name if available

## Send project update

- Large text field
- Publish button

Publishing both stores and emails the update.

## Update history

- Date
- Text
- Status snapshot
- Progress snapshot

## Support requests

- Date
- Customer
- Message

No task board.

---

# 49. Customers

Customer list:

- Name/display name
- Business
- Email
- Phone
- Project count

Customer detail:

- Basic contact information
- Account status
- Linked projects
- Resend invitation if pending

Keep the profile simple.

---

# 50. Previous Work Admin

Admins can manage public portfolio projects from the system.

Required actions:

- Add
- Edit
- Publish
- Hide
- Delete
- Feature
- Reorder
- Upload image
- Upload additional images
- Reorder images
- Remove images

Suggested fields:

- Title EN
- Title AR
- Short description EN
- Short description AR
- Category/business type
- Client name optional
- Main image
- Additional images
- Optional live URL
- Featured boolean
- Published boolean
- Display order

Optional detail content:

- Problem EN/AR
- What we built EN/AR
- Result EN/AR

The public selected-work section uses this data.

---

# 51. Website Content Admin

Admin can edit landing page copy without code changes.

Organize by sections:

- Hero
- Services
- Process
- About
- Final CTA
- Footer/Contact

For each text value:

- English
- Arabic

Do not provide arbitrary HTML editing.

Use plain text or tightly controlled structured fields.

---

# 52. Team Admin

Team member fields:

- Name
- Email
- Active

Actions:

- Add
- Edit
- Activate
- Deactivate

Prefer deactivation over destructive deletion if historical assignments exist.

---

# 53. Settings

Keep settings minimal.

Recommended:

- Company name
- Logo
- Company email
- Company phone
- WhatsApp
- Location text EN
- Location text AR
- Instagram
- LinkedIn
- Internal new-request notification recipients
- Fallback support recipients
- SEO default title EN/AR
- SEO default description EN/AR

---

# 54. PostgreSQL Data Model

Exact schema naming may differ, but the following entities are required.

Use non-guessable stable IDs such as UUIDs.

All major records should include:

- `created_at`
- `updated_at`

## 54.1 AdminUser

- id
- name
- email
- password_hash or auth equivalent
- is_active
- created_at
- updated_at

## 54.2 Customer

- id
- name nullable
- business_name nullable
- email required
- phone_country required
- phone_e164 required
- preferred_locale (`en` or `ar`)
- account_status
- created_at
- updated_at

Suggested account states:

- INVITED
- ACTIVE
- DISABLED

## 54.3 ProjectRequest

- id
- business_type nullable
- description required
- name nullable
- business_name nullable
- email required
- phone_country required
- phone_e164 required
- preferred_locale
- state
- converted_customer_id nullable
- converted_project_id nullable
- created_at
- updated_at

Suggested request states:

- NEW
- CONVERTED
- ARCHIVED

## 54.4 Project

- id
- customer_id
- name
- description
- status
- progress
- created_at
- updated_at

Constraints:

- progress between 0 and 100
- status limited to four values

## 54.5 TeamMember

- id
- name
- email
- is_active
- created_at
- updated_at

## 54.6 ProjectMember

- project_id
- team_member_id
- created_at

Unique:

- project_id + team_member_id

## 54.7 ProjectUpdate

- id
- project_id
- author_admin_id
- body
- status_snapshot
- progress_snapshot
- email_delivery_state
- created_at
- updated_at

## 54.8 SupportRequest

- id
- project_id
- customer_id
- message
- email_delivery_state
- created_at
- updated_at

## 54.9 PortfolioProject

- id
- title_en
- title_ar
- description_en
- description_ar
- category nullable
- client_name nullable
- problem_en nullable
- problem_ar nullable
- built_en nullable
- built_ar nullable
- result_en nullable
- result_ar nullable
- live_url nullable
- featured
- published
- display_order
- created_at
- updated_at

## 54.10 PortfolioImage

- id
- portfolio_project_id
- storage_key
- public_url or resolvable asset reference
- alt_en nullable
- alt_ar nullable
- is_main
- display_order
- created_at
- updated_at

## 54.11 WebsiteContent

- id
- key unique
- value_en
- value_ar
- created_at
- updated_at

## 54.12 CompanySettings

- id
- company_name
- company_email
- company_phone
- whatsapp_phone
- location_en
- location_ar
- instagram_url nullable
- linkedin_url nullable
- logo_storage_key nullable
- request_notification_recipients
- support_fallback_recipients
- seo_title_en
- seo_title_ar
- seo_description_en
- seo_description_ar
- created_at
- updated_at

## 54.13 SecureToken

Only if authentication implementation requires custom token storage:

- id
- customer_id
- type
- token_hash
- expires_at
- used_at nullable
- created_at

Never store raw reset/invite tokens.

---

# 55. Backend Architecture

The backend is part of the same Next.js application.

Do not create a second backend repository or service.

Use:

- Server Components for server-rendered data where appropriate
- Server Actions for trusted form mutations where appropriate
- Route Handlers for HTTP endpoints where appropriate
- Dedicated server-side service modules for business logic
- Dedicated validation schemas
- Dedicated email service
- Dedicated database access layer
- Dedicated storage abstraction for uploaded images

Suggested conceptual structure:

```text
app/
  ...
lib/
  db/
  auth/
  validation/
  email/
  storage/
  services/
```

Exact folder naming is flexible.

Keep business logic out of UI components.

---

# 56. Resend Integration

Resend API calls must execute server-side only.

Never expose:

- Resend API key
- Internal recipient configuration

Required email types:

1. Project request confirmation to customer
2. New project request to Atrio internal recipients
3. Customer account invitation
4. Password reset
5. Project update to customer
6. Support request to all assigned project members

Use responsive branded email templates.

Where customer locale is known, use appropriate English or Arabic email content.

---

# 57. Email Failure Behavior

Database persistence is primary.

For:

- Project requests
- Project updates
- Support requests

The business record must remain saved even if Resend fails.

Recommended delivery state:

- PENDING
- SENT
- FAILED

Log failures.

Allow safe retry from admin if implemented.

Do not create duplicate records during retry.

---

# 58. Vercel Deployment Requirements

The application must be deployable on Vercel.

Requirements:

- Production build passes
- Environment variables documented
- No dependency on persistent local disk
- PostgreSQL connection works from Vercel
- Resend works from Vercel
- Uploaded asset storage works from Vercel
- App uses production base URL correctly
- Auth callback/session configuration works on Vercel
- Image domains/storage configuration is production-safe

Recommended environments:

- Local
- Vercel Preview
- Vercel Production

Do not expose production secrets to Preview unless intentionally configured.

---

# 59. Environment Variables

Provide `.env.example`.

At minimum, expect categories similar to:

```text
DATABASE_URL=

APP_URL=
AUTH_SECRET=

RESEND_API_KEY=
RESEND_FROM_EMAIL=

# If the chosen image storage needs them:
STORAGE_...=

INITIAL_ADMIN_EMAIL=
INITIAL_ADMIN_PASSWORD=
```

Exact names may vary.

Never commit real secrets.

---

# 60. Security Requirements

- HTTPS in production
- Secure cookies
- Server-side authorization
- Server-side validation
- Password hashing
- No plaintext passwords
- No raw token storage
- No exposed database credentials
- No exposed Resend API key
- Rate-limit public request submission
- Prevent duplicate form submission
- Safe output rendering
- Validate uploads
- Restrict file types
- Restrict file size
- Never trust upload filenames
- Do not allow executable uploads
- Validate external URLs
- Protect all `/admin` routes
- Protect all `/portal` routes

Customers must never access another customer's project by changing an ID in the URL.

---

# 61. Project Request Anti-Abuse

Keep the customer flow low-friction.

Use:

- Server-side rate limiting
- Honeypot or equivalent invisible bot protection
- Request body size limit

Do not add visible CAPTCHA by default.

Only add visible CAPTCHA if actual abuse requires it later.

---

# 62. Accessibility

Target WCAG 2.2 AA where practical.

Required:

- Keyboard navigation
- Focus indicators
- Semantic headings
- Proper input labels
- Associated validation messages
- Accessible modals
- Accessible mobile menu
- Touch-friendly controls
- Good contrast
- Alt text for portfolio images
- Reduced motion support
- No color-only status communication
- Correct RTL accessibility

---

# 63. SEO

The one-page public website should include:

- Strong page title
- Meta description
- Canonical URL
- Open Graph metadata
- Social image
- Structured heading hierarchy
- Sitemap
- Robots configuration

Marketing section anchors do not need independent route metadata because they are sections of `/`.

Do not index:

- `/admin`
- `/portal`
- Password reset/set-password pages

Privacy and Terms may be indexed if desired.

---

# 64. Performance

The public one-page website should be highly optimized.

Requirements:

- Minimize client-side JS
- Optimize all images
- Use responsive image sizing
- Lazy-load below-the-fold work images
- Avoid layout shift
- Cache public content safely
- Revalidate content after admin edits
- Avoid unnecessary animation libraries
- Efficient font loading
- Keep the project modal lightweight

Target mobile Lighthouse performance:

- 90+ where practical

---

# 65. UI State Requirements

Every important interface needs:

- Loading
- Empty
- Error
- Success
- Disabled

The Start a Project modal specifically needs:

- Default form
- Validation errors
- Submitting
- Success
- Server failure

Project updates need:

- Draft input
- Sending
- Saved + emailed
- Saved but email failed

Support needs:

- Draft input
- Sending
- Success
- Saved but email failed internally

---

# 66. Form Rules

General:

- Trim whitespace
- Reject malformed emails
- Enforce max lengths
- Reject negative numeric values where invalid
- Prevent duplicate submit
- Use server validation as source of truth

Do not rely only on browser validation.

---

# 67. Testing Requirements

## 67.1 Unit tests

At minimum:

- GCC phone normalization
- Request validation
- Email validation
- Progress validation
- Status validation
- Authorization helper
- Support recipient resolution
- Localized content fallback

## 67.2 Integration tests

At minimum:

- Submit project request
- Request persists if Resend fails
- Admin converts request
- Customer invitation created
- Existing customer not duplicated
- Project update persists
- Project update email triggered
- Support request persists
- All active project members receive support notification
- Fallback support recipient works
- Portfolio publish/hide works
- Website content update works

## 67.3 End-to-end

### A. One-page navigation

- Open `/`
- Click Services
- Scrolls to Services section
- Click Previous Work
- Scrolls to Work section
- Click Contact
- Scrolls to footer/contact

### B. Start project

- Open modal
- Leave optional fields blank
- Enter description
- Enter valid email
- Use Bahrain +973 default
- Submit
- See Request Received success state

### C. Arabic

- Switch to Arabic
- Verify RTL
- Open project modal
- Verify form RTL
- Submit request
- Preferred locale stored

### D. Admin conversion

- Admin opens request
- Creates customer/project
- Invitation email triggered

### E. Customer portal

- Customer sets password
- Logs in
- Sees own project
- Cannot access another customer's project

### F. Project update

- Admin publishes update
- Customer sees it
- Resend is triggered

### G. Support

- Customer submits support
- Request stored
- Every active project member is included as recipient

### H. CMS

- Admin edits hero EN/AR
- Public page updates
- Admin adds portfolio project
- It appears in selected work
- Admin hides it
- It disappears

---

# 68. Definition of Done

V1 is complete only when all of the following are true.

## Public website

- Marketing experience is a single scrolling page
- Navbar links scroll to same-page sections
- Public UI closely follows supplied screenshots
- Responsive mobile layout is verified
- English and Arabic work
- Arabic RTL works
- Start a Project opens as a modal
- Business type is optional
- Name is optional
- Description is required
- Email is required
- Phone is required
- GCC-only selector works
- Bahrain +973 is default
- Request submission persists to PostgreSQL
- Confirmation email works through Resend
- Internal notification works through Resend
- Success modal works

## Content

- Admin can edit landing copy
- Admin can edit both English and Arabic copy
- Admin can add/edit/hide/reorder previous work
- Admin can upload work images
- Public work section is database-driven

## Admin

- Admin login works
- Requests work
- Customer creation works
- Customer invitation works
- Projects work
- Exactly four statuses
- Progress accepts only 0 to 100
- Multiple project members work
- Project update publishing works
- Customer gets progress update by Resend
- Support requests are visible
- Team management works
- Settings work
- Billing does not exist

## Customer

- Account setup works
- Login works
- Forgot password works
- Customer only sees own projects
- Progress/status display works
- Update timeline works
- Support form works
- All active project members receive support email

## Deployment

- PostgreSQL works in production
- Resend works in production
- Persistent image storage works in production
- Vercel deployment succeeds
- Production build succeeds
- Environment variables documented

## Quality

- Typecheck passes
- Lint passes
- Tests pass
- Production build passes
- No exposed secrets
- No major responsive defects
- No critical accessibility defects
- No public registration
- No billing
- No separate marketing pages for Services, Work, About, or Contact

---

# 69. Claude Code Rules

Claude Code must follow these instructions while implementing.

1. This SRS is the V1 scope.
2. Use Next.js for both frontend and backend.
3. Use PostgreSQL.
4. Use Resend.
5. Deploy to Vercel.
6. Do not introduce a separate backend framework.
7. The main public marketing website must be one scrolling page.
8. Home, Services, Previous Work, About, and Contact are same-page sections.
9. Start a Project is a modal, matching the supplied UI.
10. Use the supplied screenshots as the public UI source of truth.
11. Preserve the supplied Atrio visual style.
12. Do not redesign into a generic SaaS template.
13. Keep mobile responsiveness a first-class requirement.
14. Implement English and Arabic from the start.
15. Implement true RTL.
16. Business type is optional.
17. Name is optional.
18. Description, email, and phone are mandatory.
19. Phone country codes are GCC-only.
20. Bahrain +973 is the default.
21. Save a project request before attempting email.
22. Send customer request confirmation through Resend.
23. Send internal new-request notification through Resend.
24. No public customer registration.
25. Admin creates customer accounts from request contact information.
26. Never email plaintext passwords.
27. Project statuses are exactly:
   - Pending Team Approval
   - Development
   - Testing
   - Done
28. Project progress is manually set from 0 to 100.
29. Project updates are stored and emailed to the customer through Resend.
30. Support is simple.
31. Every active assigned project member receives support emails.
32. Do not build billing.
33. Do not build approvals.
34. Do not build chat.
35. Do not build a full CRM.
36. Do not build task management.
37. Admins manage previous work from the system.
38. Admins manage landing page text from the system.
39. Uploaded images must use persistent storage compatible with Vercel.
40. All protected data access must be authorized server-side.
41. All mutations must be validated server-side.
42. Add meaningful loading/error/empty/success states.
43. Add `.env.example`.
44. Add database migrations.
45. Add seed/setup path for the first admin.
46. Add tests for critical flows.
47. Run lint, typecheck, tests, and production build before declaring V1 complete.
48. Do not invent new product features without a requirement change.

---

# 70. Recommended Build Order

## Phase 1
- Next.js foundation
- TypeScript
- PostgreSQL connection
- Authentication foundation
- Localization
- Design tokens
- Base responsive layout

## Phase 2
- One-page public UI
- Navbar anchors
- Hero
- Services
- Process
- Selected Work
- About
- Final CTA
- Contact/footer
- Mobile responsiveness
- Arabic RTL

## Phase 3
- Start a Project modal
- GCC phone input
- Validation
- PostgreSQL persistence
- Resend customer confirmation
- Resend internal notification
- Success state

## Phase 4
- Admin authentication
- Admin layout
- Requests
- Dashboard
- Team
- Settings

## Phase 5
- Customer model
- Account invitation
- Request conversion
- Projects
- Project member assignment

## Phase 6
- Customer login/setup/reset
- Customer dashboard
- Customer project page
- Authorization

## Phase 7
- Project updates
- Customer timeline
- Resend progress update

## Phase 8
- Support form
- Support persistence
- Email all project members
- Fallback recipients

## Phase 9
- Website content management
- English/Arabic content
- Public revalidation

## Phase 10
- Previous work management
- Image uploads
- Persistent storage
- Reordering
- Public selected-work integration

## Phase 11
- Security review
- Accessibility
- SEO
- Performance
- Mobile QA
- RTL QA
- Tests
- Vercel deployment

---

# 71. Final V1 Flow

## Visitor

```text
Atrio one-page website
        |
        +--> Services
        +--> Process
        +--> Work
        +--> About
        +--> Contact
        |
        v
Start a Project modal
        |
        +--> Business type optional
        +--> Name optional
        +--> Description required
        +--> Email required
        +--> GCC phone required
        |
        v
PostgreSQL request
        |
        +--> Resend confirmation to customer
        |
        +--> Resend notification to Atrio
        |
        v
Request received modal
```

## Admin

```text
Request
   |
   v
Create customer + project
   |
   +--> Customer setup email via Resend
   |
   v
Project
   |
   +--> Status
   +--> Progress
   +--> Project members
   +--> Progress updates
   +--> Support requests
```

## Customer

```text
Account invitation
      |
      v
Set password
      |
      v
Customer portal
      |
      v
Project
      |
      +--> Status
      +--> Progress
      +--> Updates
      |      |
      |      +--> Also emailed through Resend
      |
      +--> Support request
             |
             +--> Stored in PostgreSQL
             |
             +--> Resend to all active project members
```

V1 must stay this simple.
