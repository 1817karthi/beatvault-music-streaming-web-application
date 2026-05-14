/** Parse Authorization header; returns raw JWT or null. */
function readBearerToken(header) {
  if (!header || typeof header !== "string") return null;
  const trimmed = header.trim();
  if (!/^Bearer\s+/i.test(trimmed)) return null;
  const rest = trimmed.replace(/^Bearer\s+/i, "").trim();
  if (!rest) return null;
  return rest.replace(/^Bearer\s+/i, "").trim();
}

module.exports = { readBearerToken };
