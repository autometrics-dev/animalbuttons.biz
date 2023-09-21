const baseUrl = import.meta.env.VITE_API_URL ?? undefined;

export async function api(animalName) {
  return fetch(`/${animalName}`, {
    mode: "cors",
    baseUrl
  }).then(async (response, fetchError) => {
    if (fetchError) {
      return { error: fetchError };
    }

    if (!response.ok) {
      return { error: { message: "Error from API" } };
    }

    try {
      const data = await response.json();
      return { data };
    } catch (jsonError) {
      return {
        error: jsonError,
      };
    }
  });
}