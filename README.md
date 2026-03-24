# ObraLink

**ObraLink** is a construction progress management platform that enables contractors to share real-time project updates with clients through secure, password-protected links.

## Features

### Project Management Dashboard
- **Project Overview**: Track multiple construction projects with timelines and metadata
- **Progress Updates**: Create and manage construction milestones with rich descriptions
- **Construction Stages**: Structured pipeline — Demolición, Cimentación, Estructura, Instalaciones, Acabados, Entrega
- **File Attachments**: Upload images and documents as evidence for each update
- **Timeline Visualization**: Interactive timeline view of project progress
- **Statistics**: Real-time metrics including days in construction, total updates, and file counts

### Public Client Sharing
- **Secure Access**: Share project updates via unique, token-based URLs
- **Password Protection**: Client access protected with customizable passwords
- **Session Management**: 1-hour cookie-based sessions for seamless browsing
- **Read-Only View**: Clients can view updates and download files without editing permissions
- **Responsive Design**: Optimized for desktop and mobile viewing

### File Management
- **Multi-Format Support**: Upload images, PDFs, and various document types
- **Vercel Blob Storage**: Cloud storage with up to 3GB body size for large uploads
- **File Preview**: Automatic image previews and file type icons
- **Download Capability**: Direct download links for all attachments
- **Evidence Deletion**: Remove individual files or entire updates from the dashboard

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) with React 19
- **Language**: TypeScript 5
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/) v7 (`@prisma/adapter-pg`)
- **Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) v2
- **Styling**: Tailwind CSS 3 with animations
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) + Radix UI primitives
- **Icons**: Lucide React
- **Deployment**: [Vercel](https://vercel.com)

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Vercel account (for Blob storage)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd obralink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/obralink"

   # Vercel Blob Storage
   BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"

   # Password used to protect public share links
   SHARE_PASSWORD="your_share_password"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed demo data** (optional)

   Start the dev server and visit `http://localhost:3000/api/seed` to create a demo project.

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── actions.ts                # Server actions (create, delete, authenticate)
│   ├── layout.tsx                # Root layout
│   ├── api/
│   │   ├── upload/               # Vercel Blob upload endpoint
│   │   └── seed/                 # Demo data seeding endpoint
│   ├── dashboard/
│   │   └── projects/
│   │       └── [id]/
│   │           ├── page.tsx      # Project details + timeline
│   │           ├── new-update/   # Create update form
│   │           └── updates/[updateId]/
│   └── public/share/[token]/     # Client-facing secure share view
├── components/
│   ├── ui/                       # Shadcn UI components
│   ├── public-project-view.tsx
│   ├── delete-update-button.tsx
│   └── delete-evidence-button.tsx
├── lib/
│   ├── prisma.ts                 # Prisma singleton
│   └── utils.ts
├── types/
│   └── index.ts
└── generated/                    # Prisma-generated client
```

## Database Schema

**Project**
- `id`, `name`, `address`, `clientName`
- `shareToken` (unique — enables public sharing)
- `startDate`, `endDate`
- `status`: `ACTIVE` | `ARCHIVED`

**ProgressUpdate**
- `id`, `title`, `description`, `date`
- `stage`: `Demolicion` | `Cimentacion` | `Estructura` | `Instalaciones` | `Acabados` | `Entrega`
- `images` (string array of Vercel Blob URLs)
- `projectId` (cascade delete from Project)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/upload` | Upload files to Vercel Blob |
| `GET` | `/api/seed` | Seed a demo project |

## Server Actions

| Action | Description |
|--------|-------------|
| `authenticateShareAccess` | Validates share password and sets session cookie |
| `createProjectUpdate` | Creates an update with file uploads |
| `deleteProjectUpdate` | Deletes an update and its evidence |
| `deleteEvidence` | Removes a single image from an update |
| `createDemoProject` | Seeds initial demo data |

## License

This project is licensed under the MIT License.
