import { useState, useCallback, useReducer } from "react";
import { motion } from "framer-motion";

import { api } from "./client";
import GitHubIcon from "./github-mark-white.svg"

function useRabbit({ addLoading, addAnimal }) {
  const [info, setInfo] = useState({ loading: false });

  const getRabbit = async () => {
    setInfo((i) => ({ ...i, loading: true }));
    addLoading();
    const { data, error } = await api("rabbit");

    if (error) {
      console.log(error);
      addAnimal("❔");
      setInfo({ error, loading: false });
      return;
    }
    addAnimal(data.message);
    setInfo({ data, loading: false });
  };

  return { request: getRabbit, info };
}

function usePanda({ addAnimal, addLoading }) {
  const [info, setInfo] = useState({ loading: false });

  const getPanda = async () => {
    setInfo((i) => ({ ...i, loading: true }));
    addLoading();

    const { data, error } = await api("panda");

    if (error) {
      console.log(error);
      addAnimal("❔");
      setInfo({ error, loading: false });
      return;
    }
    addAnimal(data.message);
    setInfo({ data, loading: false });
  };

  return { request: getPanda, info };
}

function useAnimalsState() {
  const [animalState, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "addAnimal": {
          const firstLoadingIndex = state.animals.findIndex((a) => !a.animal);
          let newAnimals = [...state.animals];
          if (firstLoadingIndex > -1) {
            newAnimals[firstLoadingIndex] = action.payload;
          } else {
            newAnimals = [action.payload, ...state.animals];
          }
          return {
            ...state,
            animals: newAnimals,
          };
        }
        case "addLoading":
          return {
            ...state,
            animals: [action.payload, ...state.animals],
          };
      }
      return state;
    },
    { animals: [] }
  );

  const addAnimal = useCallback((animal) => {
    dispatch({
      type: "addAnimal",
      payload: {
        animal,
        id: createUniqueId(),
      },
    });
  }, []);

  const addLoading = useCallback(() => {
    dispatch({
      type: "addLoading",
      payload: {
        id: createUniqueId(),
      },
    });
  }, []);

  return { animalState, addAnimal, addLoading };
}

function App() {
  const { animalState, addAnimal, addLoading } = useAnimalsState();

  const rabbit = useRabbit({ addAnimal, addLoading });
  const panda = usePanda({ addAnimal, addLoading });

  const { animals } = animalState;
  const hasAnimals = animals.length > 0;

  const hadError = animals?.some(a => a.animal === "❔")

  return (
    <div>
      <nav>
        <GitHubCorner />
      </nav>
      <main>
        <header>
          <h1>animalbuttons.biz</h1>
          <p>the best website on the Internet to click or tap animal buttons</p>
        </header>
        <div className="button-group">
          <button onClick={rabbit.request}>🐰 Rabbit</button>
          <button onClick={panda.request}>🐼 Panda</button>
        </div>

        <div className="animals">
          <h2>
            {hasAnimals ? (
              <>
                here is a list of animals you have clicked or tapped on this
                Internet website
              </>
            ) : (
              <>
                please click on the animal buttons to see all the times you
                clicked or tapped on animal buttons
              </>
            )}
          </h2>
          <div className="animals-grid">
            {hasAnimals &&
              animals.map(({ animal, id }) => (
                <Animal key={id} name={animal} />
              ))}
          </div>
        </div>
        {rabbit?.info?.error && (
          <>
            <h2>there was an error getting your rabbit</h2>
            <pre>{JSON.stringify(rabbit.info.error, null, 2)}</pre>
          </>
        )}
        {(panda?.info?.error || hadError) && (
          <>
            <h2>there was an error getting your panda</h2>
            <pre>{panda?.info?.error?.message ?? "oepsies"}</pre>
            <iframe
              src="https://giphy.com/embed/KmhQ8F3EGsSxG"
              width="370"
              height="280"
              frameBorder="0"
              className="giphy-embed"
              allowFullScreen
            ></iframe>
            <p>
              <a href="https://giphy.com/gifs/love-cute-pandas-KmhQ8F3EGsSxG">
                via GIPHY
              </a>
            </p>
          </>
        )}
      </main>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
const Animal = ({ name }) => {
  if (!name) {
    return (
      <motion.span
        initial={{ scale: .2 }}
        animate={{ scale: 1, }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="animal"
      >
        🤔
      </motion.span>
    );
  }

  return (
    <motion.span
      initial={{ rotate: 0, scale: 1 }}
      animate={{ rotate: 360, scale: 1.5 }}
      className="animal"
    >
      {name}
    </motion.span>
  );
};

function GitHubCorner() {
  return (
    <a
      className="github-corner"
      href="https://github.com/autometrics-dev/animalbuttons.biz"
    >
        <img src={GitHubIcon} alt="GitHub" />       
      </a>
  )
}

function createUniqueId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export default App;
