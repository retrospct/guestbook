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

// FIXME: Should not be using `any` type here, use a generic maybe or properly type the error responses for createConnection and query
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | any>) {
  try {
    // TODO: Fix typing so ?? operator isn't needed
    const connection = await mysql.createConnection(process.env.PS_DATABASE_URL ?? 'no-url')
    const [rows, fields] = await connection.query('SELECT * FROM users')
    res.status(200).json({ users: rows as User[] })
  } catch (err) {
    res.status(500).json(err)
  }
}

// Syncronous example
// const connection = mysql.createConnection(process.env.PS_DATABASE_URL ?? 'no-url')
// connection.connect()
// connection.query(
//   'SELECT * FROM users',
//   function (err: mysql.QueryError | null, rows: User[], fields: mysql.FieldPacket[]) {
//     if (err) {
//       res.status(500).send(err)
//       return
//     }
//     res.status(200).json({ users: rows })
//   }
// )
