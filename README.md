# Guestbook

Quick and dirty recreation of the guestbook app from [this article](https://www.mux.com/blog/how-we-built-our-video-guestbook) from the Mux blog. I'm going to get the basics working (mux upload, upchunk, option to save file locally, and UI components) and then build some custom features for a birthday party coming up (green screen, Snapchat style filters, ???).

Later things: refactor to build as an electron app or a react-native app too.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## PlanetScale Experiment

Trying out PlanetScale, using Node.js and PlanetScale CLI.

### Takeaways from trying PS

1. Amazingly scalable and easy to get setup using GUI or CLI
1. It's literally a vanilla mysql DB instance with all the difficult scaling and replication stuff taken care of for you automagically
1. Maybe use with an ORM or something that's not writing SQL queries in nodejs code to abstract away this stuff
1. Or used to back a microservice/function through a kafka or event stream instead of directly connecting to the DB
1. mysql2 and all the other major mysql capable NodeJs clients are really huge packages (+500kb)
1. Look into using the other supported languages Go, Rust, Elixir, or Prisma to see if the packages are smaller or more efficient.

> Instructions based off this guide, [NodeJs Guide - PlanetScale Docs](https://docs.planetscale.com/tutorials/connect-nodejs-app)
> The [PlanetScale Admin Dashboard](https://app.planetscale.com/hypergo/hypergo) GUI can be used instead of the PS CLI.

### Create a database (if not already created)

```zsh
pscale database create <DATABASE_NAME>
```

### Open a mysql shell, `<BRANCH_NAME>` is `main` by default

```zsh
pscale shell <DATABASE_NAME> <BRANCH_NAME>
```

### Create a `users` table

```sql
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255),
  `last_name` varchar(255)
);
```

### Add a `user` to the `users` table

```sql
INSERT INTO `users` (id, email, first_name, last_name)
VALUES  (1, 'me@jlee.cool', 'Justin', 'Lee');
```

### Verify user has been added

```sql
select * from users;
```

```sql
+----+--------------+------------+-----------+
| id | email        | first_name | last_name |
+----+--------------+------------+-----------+
|  1 | me@jlee.cool | Justin     | Lee       |
+----+--------------+------------+-----------+
```

### Connecting from your NodeJs app

```zsh
yarn add mysql2
```

### Querying the DB from NodeJs

```typescript
// pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql2/promise'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
}

interface Data {
  users: User[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | any>) {
  try {
    const connection = await mysql.createConnection(process.env.PS_DATABASE_URL ?? 'no-url')
    const [rows, fields] = await connection.query('SELECT * FROM users')
    res.status(200).json({ users: rows as User[] })
  } catch (err) {
    res.status(500).json(err)
  }
}
```
