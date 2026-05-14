/** Trimmed JWT secret from env (Render/UI sometimes adds trailing newline). */
function getJwtSecret() {
  return String(process.env.JWT_SECRET ?? "").trim();
}

module.exports = { getJwtSecret };
