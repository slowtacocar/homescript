import fetcher from "@homescript/lib/fetcher";

export default async function fetchAPI(url, init) {
  try {
    return await fetcher(url, init);
  } catch (error) {
    if (error.status === 401) {
      signIn();
    }
    throw error;
  }
}
