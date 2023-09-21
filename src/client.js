const baseUrl = import.meta.env.VITE_API_URL ?? undefined;

export async function api(animalName) {
  console.log("hi api", baseUrl);
  const url = `${baseUrl}/${animalName}`;
  return fetch(url, { mode: "cors" })
    .then(async (response, fetchError) => {
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
    })
    .catch((err) => {
      return { error: err };
    });
}
