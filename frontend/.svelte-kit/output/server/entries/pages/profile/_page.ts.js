import { r as redirect } from "../../../chunks/index.js";
const baseUrl = "http://mustafar:3000";
async function fetchData(endpoint, options = {}) {
  const response = await fetch(`${baseUrl}${endpoint}`, options);
  if (!response.ok) {
    const message = await response.json();
    if (!message) {
      throw new Error(response.statusText);
    } else {
      throw new Error(message.error);
    }
  }
  return response.json();
}
async function accessRestriced() {
  const fetchOptions = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  };
  const result = await fetchData("/", fetchOptions);
  return result;
}
const load = async ({ parent, data }) => {
  try {
    const result = await accessRestriced();
    return result;
  } catch (error) {
    redirect(301, "/account");
  }
};
export {
  load
};
