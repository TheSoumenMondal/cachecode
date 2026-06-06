# cachecode

**cachecode** is a modern, full-stack web application designed for developers to store, share, and discover code snippets. It provides a clean and intuitive interface to organize your most used code blocks, helping you stop searching through old projects and start building faster.

## Features

- **Beautiful Syntax Highlighting:** Snippets are automatically highlighted based on their language using `react-syntax-highlighter` for readability at a glance.
- **Public & Private Modes:** Keep your secret keys and company-specific logic private, or switch to public mode to share your solutions with the broader community.
- **Tag-Based Organization:** Categorize your snippets with custom tags so you can find exactly what you need in seconds.
- **Seamless Authentication:** Secure and easy login/registration powered by [Better Auth](https://better-auth.com/).
- **Responsive Design:** Fully responsive and modern UI built with [Tailwind CSS v4](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/).
- **Light & Dark Mode:** Built-in theme toggling that respects your system preferences.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, v16.2.7)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** [shadcn/ui](https://ui.shadcn.com/), [Phosphor Icons](https://phosphoricons.com/)
- **State Management & Forms:** [TanStack Form](https://tanstack.com/form) & Zod
- **Database:** [Neon (Serverless Postgres)](https://neon.tech/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** Better Auth
- **Formatting & Linting:** [Biome](https://biomejs.dev/)

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) and your preferred package manager (`npm`, `yarn`, `pnpm`, or `bun`) installed.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/cachecode.git
   cd cachecode
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Neon database connection string and Better Auth secrets:

   ```env
   DATABASE_URL="postgres://user:password@ep-your-db-endpoint.neon.tech/neondb"
   BETTER_AUTH_SECRET="your-super-secret-key"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database:**
   Push the schema to your Neon database using Drizzle Kit:

   ```bash
   npm run db:push
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## Scripts

- `npm run dev` - Starts the Next.js development server.
- `npm run build` - Builds the application for production.
- `npm run start` - Starts the Next.js production server.
- `npm run lint` - Runs Biome to check for linting and formatting errors.
- `npm run format` - Automatically formats the codebase using Biome.
- `npm run db:push` - Pushes your Drizzle schema directly to the database.
- `npm run db:generate` - Generates SQL migration files.

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/yourusername/cachecode/issues).

## License

This project is licensed under the MIT License.
