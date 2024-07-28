import { redirect } from "@sveltejs/kit";
const baseUrl = import.meta.env.BASE_URL;

export async function getData(endpoint: string, options?: { body?: {}, method?: "GET" | "POST" }) {
  console.log(options?.body)
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include',
    method: options?.method ?? "GET",
    body: options?.body ? JSON.stringify(options?.body) : undefined
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw redirect(302, '/account');
    } else {
      let errorData;
      try {
        errorData = await response.json() as any;
      } catch (error) {
        throw new Error(response.statusText);
      }
      throw new Error(errorData.message || response.statusText);
    }
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error('Failed to parse JSON response');
  }
}
