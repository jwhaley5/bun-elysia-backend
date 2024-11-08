# Elysia with Bun Runtime

## Overview

This project is a backend API built using the **Elysia** framework and **Bun** runtime, with **Supabase** as the database backend. The application supports user authentication, task management, comments, and claps, making it ideal for prototyping social or idea-sharing applications. By leveraging Supabase’s PostgreSQL database and authentication, this project provides a flexible and scalable foundation.

## Prerequisites

-   [Bun](https://bun.sh/) (JavaScript runtime)
-   [Supabase](https://supabase.com/) account and project
-   PostgreSQL GUI of your choice (e.g., pgAdmin) for table setup and management

## Getting Started

### 1. Install Bun

If you haven't installed Bun yet, you can do so by following the instructions [here](https://bun.sh/docs/installation).

### 2. Clone the Repository and Install Dependencies

Clone this repository to your local machine and install dependencies:

```bash
git clone <your-repo-url>
cd <your-repo-name>
bun install
```

### 3. Supabase Setup

1. **Create a Supabase Project**: If you don’t already have a Supabase project, create one at [Supabase](https://supabase.com/).

2. **Database Setup**: Set up the required tables for this project by running the commands in `table_creation.sql` within your PostgreSQL GUI (e.g., pgAdmin). This file includes all the necessary SQL commands to create tables for users, ideas, comments, claps, and any other relevant data models.

3. **Environment Variables**: Create a `.env` file in the root directory of your project and add the following fields:

    ```bash
    SUPABASE_URL=<your-supabase-url>
    SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
    PORT=3000  # Optional, default is 3000
    JWT_SECRET=<your-jwt-secret>  # Secret for signing JWT tokens
    ```

    - **`SUPABASE_URL`**: Your Supabase project URL.
    - **`SUPABASE_SERVICE_ROLE_KEY`**: The service role key for Supabase, used for accessing the database securely.
    - **`PORT`**: The port on which the application will run. Defaults to 3000 if not set.
    - **`JWT_SECRET`**: A secure key for signing JWT tokens.
