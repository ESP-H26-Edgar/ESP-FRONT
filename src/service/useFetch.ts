const baseurl = "https://raceportal.edwrdledgar.me/";

const useFetch = () => {
  const GET = async <T>(url: string): Promise<T | undefined> => {
    try {
      const response = await fetch(`${baseurl}${url}`, {
        credentials: "include",
      });
      return handleResponse<T>(response);
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  };

  const POST = async <T, T1 = T>(
    url: string,
    body: T,
  ): Promise<T1 | undefined> => {
    try {
      const response = await fetch(`${baseurl}${url}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      return handleResponse<T1 | undefined>(response);
    } catch (error) {
      console.error("Error posting:", error);
      throw error;
    }
  };

  const DELETE = async (url: string): Promise<void> => {
    try {
      const response = await fetch(`${baseurl}${url}`, {
        method: "DELETE",
        credentials: "include",
      });
      await handleResponse(response);
    } catch (error) {
      console.error("Error deleting:", error);
      throw error;
    }
  };

  const PUT = async <T, T1 = T>(
    url: string,
    body: T,
  ): Promise<T1 | undefined> => {
    try {
      const response = await fetch(`${baseurl}${url}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      return handleResponse<T1>(response);
    } catch (error) {
      console.error("Error putting:", error);
      throw error;
    }
  };

  const PATCH = async <T>(url: string, body: T): Promise<void | undefined> => {
    try {
      const response = await fetch(`${baseurl}${url}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error patching:", error);
      throw error;
    }
  };

  async function handleResponse<T>(response: Response): Promise<T | undefined> {
    if (!response.ok) {
      const message = await response.text();
      const error: any = new Error(message);
      error.status = response.status;
      throw error;
    }
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    } else {
      return (await response.text()) as unknown as T;
    }
  }

  return { GET, POST, PATCH, DELETE, PUT };
};

export default useFetch;
