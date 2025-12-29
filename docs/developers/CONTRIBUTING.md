# Code Contributions

## Prerequisites

- The latest version of [Node.js](https://nodejs.org/en) >= 22.0.0
- Either one of the following IDEs
  - [Visual Studio Code](https://code.visualstudio.com/) (*Recommended*)
  - [JetBrains Webstorm](https://www.jetbrains.com/webstorm/)
- The [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension
- [PostgreSQL 17](https://www.postgresql.org/download/)

### Optional Extensions
There are useful extensions in Visual Studio Code that are very useful for development and effectively make your coding efficiency faster.
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): Code formats a consistent style.
- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme): Revamps icons for different directories/files
- [JavaScript (ES6)](https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets): Provides code snippets for JS
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens): Visualize authors and annotations from GitHub

## Installations
1. Clone the repository. (Optional: Fork the repository)
2. In the project directory, install the packages.
    ```bash
    npm install
    ```

### Setting up Database
To set up the PostgreSQL database locally, you will need to configure your PG Admin 4 first. Afterwards, create a database for KapsuLog and set up the environment variables with the following:

In frontend directory:
- `REACT_APP_API_URL`: The link to the hosted backend (i.e. `http://localhost:3000`)

In backend directory:
- `FRONTEND_URL`: The link to hosting the frontend (i.e. `http://localhost:5173`)
- `PORT`: The port to the backend (i.e. `3000`)
- `DATABASE_URL`: The link to connect to your local SQL database
``` 
Format: "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"
```

### Backend Setup with Prisma
KapsuLog uses Prisma ORM to utilize relational models easier as objects instead of entering SQL queries. The following steps will setup your local database by using the schema and seed provided.

1. Generate the Prisma Client.
    ```bash
    npx prisma generate
    ```
2. Load the seed into your database. This will inject all tables and example data.
    ```bash
    npx prisma db seed
    ```

**IMPORTANT NOTE: You do not need to run this command after the first time.**
    
3.  If you update the Prisma Schema, you may need to push the changes to your local database.
    ```bash
    npx prisma db push
    ```

## Running the Project
1. Activate a local server for the website.
    ```bash
    npm run dev
    ```
2. Or, you can host specific ends like the frontend or the backend only depending on your choice.
    ```bash
    npm run dev:frontend
    # or..
    npm run dev:backend
    ```
3. To stop the server, enter `q` or `CTRL-C`.

## KapsuLog Project Details
The following details are utilized/currently planned tech stack and deployment for this project:

### Tech Stack
- TypeScript - Core Language
- React - Frontend
- Node.js/Express - Backend
- PostgreSQL - Database
- Prisma - Database Framework
- Git Actions - CI/CD Pipeline

### Deployment
- Cloudflare Pages - Frontend
- Render - Backend
- Supabase - Database
