// export default async function handler(req, res) {
//   const { query } = req.query

//   // Make the request to the HTTP backend from the server
//   const response = await fetch(
//     `http://localhost:8000/api/games/search?query=${encodeURIComponent(query)}`,
//   )
//   const data = await response.json()

//   res.status(200).json(data)
// }
