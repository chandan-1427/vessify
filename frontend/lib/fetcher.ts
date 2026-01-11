export async function apiFetch(
  url: string,
  options?: RequestInit
) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("API Error");
  }

  return res.json();
}
