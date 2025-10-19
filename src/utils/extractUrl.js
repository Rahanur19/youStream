function extractPublicIdFromUrl(url) {
  try {
    const matches = url.match(/upload\/v\d+\/(.+)\.(\w+)$/);
    if (!matches || matches.length < 2) return null;

    return matches[1]; // this is the public_id
  } catch (err) {
    console.error("Failed to extract public_id:", err);
    return null;
  }
}

module.exports = { extractPublicIdFromUrl };
