/*
 * CometChat configuration loader (Vite)
 *
 * Loads required CometChat environment variables via import.meta.env.
 * If variables are missing, it logs a developer-friendly warning/error
 * without throwing—so builds/compilation do not break.
 */

const REQUIRED_KEYS = [
  'VITE_COMETCHAT_APP_ID',
  'VITE_COMETCHAT_AUTH_KEY',
  'VITE_COMETCHAT_REGION',
];

function readEnv(key) {
  // Vite injects import.meta.env at build time.
  // If running in an unexpected context, guard against undefined import.meta.
  try {
    // eslint-disable-next-line no-undef
    return (import.meta && import.meta.env && import.meta.env[key]) || '';
  } catch {
    return '';
  }
}

function normalize(value) {
  return typeof value === 'string' ? value.trim() : '';
}

const resolved = Object.fromEntries(
  REQUIRED_KEYS.map((key) => [key, normalize(readEnv(key))])
);

const missingKeys = REQUIRED_KEYS.filter((key) => !resolved[key]);

// Safety: do not throw during module initialization.
// Log a graceful, actionable message so developers understand what to set.
if (missingKeys.length > 0) {
  const messages = {
    VITE_COMETCHAT_APP_ID: 'Set VITE_COMETCHAT_APP_ID in your .env file.',
    VITE_COMETCHAT_AUTH_KEY: 'Set VITE_COMETCHAT_AUTH_KEY in your .env file.',
    VITE_COMETCHAT_REGION: 'Set VITE_COMETCHAT_REGION in your .env file.',
  };

  // Avoid logging secrets: never print AUTH_KEY value.
  // Show only which keys are missing.
  console.warn(
    '[CometChat config] Missing environment variables. The app will still compile, but CometChat will not be configured.\n' +
      missingKeys.map((k) => `- ${messages[k] || k}`).join('\n')
  );

  // In addition, provide a single concise error for faster visibility.
  console.error(
    '[CometChat config] CometChat is not ready: missing keys: ' + missingKeys.join(', ') +
      '. Create a .env file based on .env.example (do not commit secrets).'
  );
}

export const cometchatConfig = {
  appId: resolved.VITE_COMETCHAT_APP_ID,
  authKey: resolved.VITE_COMETCHAT_AUTH_KEY,
  region: resolved.VITE_COMETCHAT_REGION,
  isConfigured: missingKeys.length === 0,
  missingKeys,
};

export default cometchatConfig;

