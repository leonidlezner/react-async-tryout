import axios, { CanceledError } from "axios";
import { useEffect, useState, useRef } from "react";

export default function JokeGenerator({ language }) {
  const abortController = useRef(null);
  const isMounted = useRef(false);
  const [isBusy, setIsBusy] = useState(false);

  const [joke, setJoke] = useState({
    setup: "",
    delivery: "",
  });

  async function getData() {
    const result = await axios.get(
      `http://localhost:8080/api/joke?lang=${language}`,
      {
        signal: abortController.current.signal,
      }
    );

    return result.data;
  }

  const loadNextJoke = async () => {
    abortController.current = new AbortController();

    setIsBusy(true);

    try {
      let data = await getData();

      if (isMounted.current) {
        setJoke({
          setup: data["setup"],
          delivery: data["delivery"],
        });

        setIsBusy(false);
      }
    } catch (error) {
      if (error instanceof CanceledError === false) {
        setIsBusy(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    loadNextJoke();

    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [language]);

  function handleNext() {
    loadNextJoke();
  }

  return (
    <div>
      <h1>Jokes in "{language}"</h1>
      <div className="my-2 border p-2">
        {isBusy && !joke.setup ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p className="text-xl">{joke.setup}</p>
            <p>{joke.delivery}</p>
          </div>
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={isBusy}
        className="rounded-sm bg-blue-400 px-3 py-1 shadow-md disabled:bg-gray-400 disabled:shadow-sm"
      >
        Next {isBusy && <span>⏳</span>}
      </button>
    </div>
  );
}
