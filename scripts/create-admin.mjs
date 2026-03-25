import fs from 'node:fs';

const envText = fs.readFileSync('.env', 'utf8');
const env = {};
for (const rawLine of envText.split(/\r?\n/)) {
  const line = rawLine.trim();
  if (!line || line.startsWith('#')) continue;
  const idx = line.indexOf('=');
  if (idx === -1) continue;
  const key = line.slice(0, idx).trim();
  const value = line.slice(idx + 1).trim();
  env[key] = value;
}

const apiKey = env.VITE_FIREBASE_API_KEY;
const projectId = env.VITE_FIREBASE_PROJECT_ID;
const email = 'arevalo.paulina29@gmail.com';
const password = '123456';

if (!apiKey || !projectId) {
  throw new Error('Missing VITE_FIREBASE_API_KEY or VITE_FIREBASE_PROJECT_ID in .env');
}

const emailPrefix = email.split('@')[0] || 'admin';

async function authRequest(path, body) {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/${path}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (!res.ok) {
    const msg = json?.error?.message || 'Auth request failed';
    const err = new Error(msg);
    err.code = msg;
    throw err;
  }
  return json;
}

async function getProfileDoc(idToken, uid) {
  const res = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${idToken}` }
  });
  if (res.status === 404) return null;
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message || 'Failed to read user profile');
  }
  return json;
}

async function upsertAdminProfile(idToken, uid) {
  const body = {
    fields: {
      uid: { stringValue: uid },
      email: { stringValue: email },
      username: { stringValue: emailPrefix },
      usernameLower: { stringValue: emailPrefix.toLowerCase() },
      userType: { stringValue: 'admin' }
    }
  };

  const res = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    },
    body: JSON.stringify(body)
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message || 'Failed to write admin profile');
  }
  return json;
}

async function main() {
  let authData;
  let created = false;

  try {
    authData = await authRequest('accounts:signUp', {
      email,
      password,
      returnSecureToken: true
    });
    created = true;
  } catch (error) {
    if (error.code !== 'EMAIL_EXISTS') throw error;
    authData = await authRequest('accounts:signInWithPassword', {
      email,
      password,
      returnSecureToken: true
    });
  }

  const uid = authData.localId;
  const idToken = authData.idToken;

  const existingDoc = await getProfileDoc(idToken, uid);
  if (existingDoc?.fields?.userType?.stringValue && existingDoc.fields.userType.stringValue !== 'admin') {
    throw new Error('Account exists but is not admin. Firestore rules prevent promoting userType from user to admin from client. Create a new admin account or change role in Firebase Console.');
  }

  await upsertAdminProfile(idToken, uid);

  console.log(created ? 'Admin auth account created and profile saved.' : 'Admin auth account already existed; admin profile verified/saved.');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main().catch((err) => {
  console.error('ERROR:', err.message || err);
  process.exit(1);
});
