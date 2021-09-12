import "isomorphic-fetch";

export default async function fetcher(url, init) {
  const response = await fetch(
    url,
    init && {
      ...init,
      body: JSON.stringify(init.body),
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    }
  );

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.status = response.status;
    try {
      error.message = await response.text();
    } catch {}
    throw error;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}
