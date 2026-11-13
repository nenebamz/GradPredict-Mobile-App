// Future Random Forest inference API contract.
// Set EXPO_PUBLIC_MODEL_API_URL to your FastAPI server URL.
// No sensitive student information should be sent without authorization.
const API_URL = process.env.EXPO_PUBLIC_MODEL_API_URL;

export async function predictRisk(features) {
  if (!API_URL) {
    throw new Error('MODEL_NOT_CONNECTED');
  }
  const response = await fetch(`${API_URL.replace(/\/$/, '')}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ features }),
  });
  if (!response.ok) throw new Error(`Prediction service error: ${response.status}`);
  const data = await response.json();
  if (!['Low', 'Moderate', 'High'].includes(data.risk_level)) {
    throw new Error('Invalid model response');
  }
  return data;
}
