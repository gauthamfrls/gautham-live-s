export default async function handler(req, res) {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  try {
    const updateRecord = await yourDatabaseFetchFunction(ecfg_2fofvupidjcan4mifhjobifdn5zy);
    
    if (!updateRecord) return res.status(404).json({ error: 'Not found' });

    res.status(200).json(updateRecord);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
