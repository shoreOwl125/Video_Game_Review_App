export default async function handler(req, res) {
  const { query } = req.query

  // Make the request to the HTTP backend from the server
  const response = await fetch(
    `http://54.200.162.255/api/games/search?query=${encodeURIComponent(query)}`,
  )
  const data = await response.json()

  res.status(200).json(data)
}
