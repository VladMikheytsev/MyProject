// api.js

const API_BASE = 'https://warehouse-vlad.ngrok.io';

export async function fetchWarehouses() {
  const res = await fetch(`${API_BASE}/warehouses`);
  if (!res.ok) throw new Error('Failed to fetch warehouses');
  return res.json();
}

export async function fetchItems() {
  const res = await fetch(`${API_BASE}/items`);
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
}

export async function fetchItemTypes() {
  const res = await fetch(`${API_BASE}/item-types`);
  if (!res.ok) throw new Error('Failed to fetch item types');
  return res.json();
}

export async function fetchUser() {
  const res = await fetch(`${API_BASE}/user`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}
