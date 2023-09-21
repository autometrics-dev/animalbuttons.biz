export async function api(animalName) {
  return fetch(`/${animalName}`, {
    mode: "cors"
  }).then(async (response, error) => {
    if (error) {
      return { error }
    }

    if (!response.ok) {
      return { error: { message: "Error from API" } }
    }

    try {
      const data = await response.json();
      return { data };
    } catch (jsonError) {
      return {
        error: jsonError
      }
    }
  })
}