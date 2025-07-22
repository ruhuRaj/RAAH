import axios from "axios";

export const apiConnector = async (method, url, body = null, token = null, isMultipart = false) => {
  try {
    const headers = {};

    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (isMultipart) headers["Content-Type"] = "multipart/form-data";

    const config = { method, url, headers };
    if (method === "GET") {
      config.params = body;
    } else {
      config.data = body;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("API Call Error", error);
    throw new Error(error.response?.data?.message || "API request failed");
  }
};
