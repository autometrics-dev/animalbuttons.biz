# animalbuttons.biz

A sample app integrated with a Python API that has function-level Prometheus metrics.

This is the frontend for the app. For the API code, see: [autometrics-demo-python-fastapi-animals](https://github.com/autometrics-dev/autometrics-demo-python-fastapi-animals/tree/pyconuk)


## Live Demo

- This app: [animalbuttons.biz](https://animalbuttons.biz)
- The API: [api.animalbuttons.biz](https://api.animalbuttons.biz)
- Autometrics Explorer: [explorer.animalbuttons.biz](https://explorer.animalbuttons.biz)
- Prometheus dashboard: [prometheus.animalbuttons.biz](https://prometheus.animalbuttons.biz)

## Running the example locally with a Python Web Service

### Running locally

1. `npm install` in project root
2. `VITE_API_URL=http://localhost:8080 npm run dev` in project root
3. Clone and launch the web service (you will need [this repo](https://github.com/autometrics-dev/autometrics-demo-python-fastapi-animals/tree/pyconuk))
4. Launch Prometheus and the Autometrics Explorer UI (`am start :8080`)



