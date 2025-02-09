export default async function handler(req, res) {
  const station = "Balgrist";
  const limit = 10;
  const apiUrl = `http://transport.opendata.ch/v1/stationboard?station=${encodeURIComponent(station)}&limit=${limit}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      res.status(500).json({ error: "Error fetching transport data" });
      return;
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 