const API_BASE_URL = 'http://localhost:8080/api';

export async function fetchClients() {
  const response = await fetch(`${API_BASE_URL}/clients`);
  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }
  return response.json();
}

export async function searchClients(query: string, segment?: string, region?: string) {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (segment && segment !== 'all') params.append('segment', segment);
  if (region && region !== 'all') params.append('region', region);
  
  const response = await fetch(`${API_BASE_URL}/clients/search?${params}`);
  if (!response.ok) {
    throw new Error('Failed to search clients');
  }
  return response.json();
}

export async function fetchClientById(id: string) {
  const response = await fetch(`${API_BASE_URL}/clients/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch client');
  }
  return response.json();
}

export async function fetchAnalytics() {
  const response = await fetch(`${API_BASE_URL}/analytics`);
  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }
  return response.json();
}

export async function predictIncome(clientId: string, features?: Record<string, any>) {
  const response = await fetch(`${API_BASE_URL}/predict/income`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      features: features || {}
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to predict income');
  }
  return response.json();
}

export async function searchClient(query: string) {
  const response = await fetch(`${API_BASE_URL}/clients/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search client');
  }
  const data = await response.json();
  return (data && Array.isArray(data) && data.length > 0) ? data[0] : null;
}