// Node.js only. Never import this module into browser components or a Sites Worker.
export function mongoConfiguration(environment) {
  const raw = environment.MONGODB_URI?.trim();
  const password = environment.MONGODB_PASSWORD;
  if (!raw || !password) throw new Error('MISSING_CONFIGURATION');
  let uri;
  try { uri = new URL(raw); } catch { throw new Error('INVALID_URI'); }
  if (uri.protocol !== 'mongodb+srv:' || !uri.hostname.endsWith('.mongodb.net')) throw new Error('INVALID_URI');
  let username;
  try { username = decodeURIComponent(uri.username); } catch { throw new Error('INVALID_URI'); }
  if (!username || username.includes('<') || password.includes('<db_password>')) throw new Error('INVALID_CREDENTIALS');
  // Password is supplied separately so special characters need no URI encoding.
  uri.username = ''; uri.password = '';
  for (const key of ['tls', 'ssl', 'tlsInsecure', 'tlsAllowInvalidCertificates', 'tlsAllowInvalidHostnames', 'authSource']) uri.searchParams.delete(key);
  return {
    uri: uri.toString(),
    databaseName: 'pegalo',
    options: {
      auth: { username, password }, authSource: 'admin',
      tls: true, tlsAllowInvalidCertificates: false, tlsAllowInvalidHostnames: false,
      serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000, socketTimeoutMS: 15000,
      maxPoolSize: 3, minPoolSize: 0, appName: 'pegalo-connection-check',
    },
  };
}
