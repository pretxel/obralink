# 🏗️ ObraLink

**ObraLink** is a modern construction progress management platform that enables contractors to share real-time project updates with clients through secure, password-protected links.

![ObraLink](public/favicon.png)

## ✨ Features

### 📊 Project Management Dashboard
- **Project Overview**: Track multiple construction projects with detailed timelines
- **Progress Updates**: Create and manage construction milestones with rich descriptions
- **File Attachments**: Upload images and documents as evidence for each update
- **Timeline Visualization**: Beautiful, interactive timeline view of project progress
- **Statistics**: Real-time metrics including days in construction, total updates, and file counts

### 🔗 Public Client Sharing
- **Secure Access**: Share project updates via unique, token-based URLs
- **Password Protection**: Client access protected with customizable passwords
- **Session Management**: 1-hour cookie-based sessions for seamless browsing
- **Read-Only View**: Clients can view updates and download files without editing permissions
- **Responsive Design**: Optimized for desktop and mobile viewing

### 📁 File Management
- **Multi-Format Support**: Upload images, PDFs, and various document types
- **Vercel Blob Storage**: Reliable cloud storage with unique file naming
- **File Preview**: Automatic image previews and file type icons
- **Download Capability**: Direct download links for all attachments
- **Evidence Deletion**: Remove individual files or entire updates from the dashboard

### 🎨 Modern UI/UX
- **Custom Design System**: Vibrant orange (#FF6B35) brand color with professional aesthetics
- **Shadcn UI Components**: Beautiful, accessible component library
- **Dark Mode Ready**: Prepared for theme switching
- **Responsive Layout**: Mobile-first design approach
- **Smooth Animations**: Polished transitions and hover effects

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Styling**: Tailwind CSS
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Deployment**: [Vercel](https://vercel.com)

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Vercel account (for blob storage)

## 🛠️ Installation

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
   
   # Public Share Password (for demo)
   NEXT_PUBLIC_DEMO_PASSWORD="123"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed demo data** (optional)
   
   Visit `http://localhost:3000/api/seed` after starting the dev server to create a demo project.

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.


## 📄 License

This project is licensed under the MIT License.


---

