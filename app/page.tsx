"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [lang, setLang] = useState("");
  const [english, setEnglish] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);

  interface History {
    english: string;
    lang: string;
  }

  const [history, setHistory] = useState<History[]>([]);

  async function query(data: { inputs: string }) {
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/icep0ps/marian-finetuned-kde4-en-to-rw",
        data,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MODEL_API_TOKEN}`,
          },
        }
      );
      setErrors("");
      return response.data;
    } catch (error) {
      throw new Error("error occured " + error);
    }
  }

  const translate = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (english === "") {
      setEmpty(true);
      setLoading(false);
    } else {
      setEmpty(false);
      query({ inputs: english })
        .then((response) => {
          setLoading(false);
          setLang(response[0].generated_text);
          setHistory((prevHistory) => [
            ...prevHistory,
            { english: english, lang: response[0].generated_text },
          ]);
        })
        .catch((error) => {
          setLoading(false);
          setErrors("Error occured" + error);
        });
    }
    //typeWriter(lang)
  };

  const handleEnglishChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEnglish(e.target.value);
  };

  const typeWriter = (text: string) => {
    var speed = 50;
    var i = 0;
    if (i < text.length) {
      const langElement = document.getElementById("lang");
      if (langElement) {
        langElement.innerHTML += text.charAt(i);
      }
      i++;
      setTimeout(typeWriter, speed);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gradient-to-b from-cyan-500 to-blue-500  justify-center gap-10 items-center">
      <div className=" flex flex-col w-fit justify-center items-center bg-white/50 p-4 rounded-lg backdrop-blur-sm">
        <div className="flex flex-row justify-center items-center gap-6 w-full mt-5">
          <div className="flex flex-row items-center gap-4 w-full">
            <div className="flex gap-2 w-52 border-2 border-black p-2 rounded-md">
              <Image
                src={"/assets/english.png"}
                width={50}
                height={50}
                alt="British Flag"
              />
              <h1 className="text-xl">English</h1>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                />
              </svg>
            </div>
            <div className="flex gap-2 border-2 border-black p-2 rounded-md w-52">
              <Image
                src={"/assets/burundi.png"}
                width={50}
                height={50}
                alt="British Flag"
              />
              <h1 className="text-xl">Kirundi</h1>
            </div>
            <button
              type="submit"
              onClick={translate}
              className=" p-1 w-52 h-12 bg-cyan-500 backdrop-blur-sm rounded-md border-2 border-cyan-500 shadow-2xl ob text-xl text-white"
            >
              Translate
            </button>
          </div>
        </div>
        <div className="space-y-3 mt-2">
          <div>
            <form onSubmit={translate} className="flex items-center space-x-5">
              <textarea
                name="english"
                id="english"
                cols={85}
                rows={5}
                placeholder="Enter Text"
                className="border-2 border-black rounded-lg opacity-75 p-2"
                onChange={handleEnglishChange}
              ></textarea>
            </form>
          </div>
          <div>
            <form action="">
              <textarea
                name="lang"
                id="lang"
                cols={85}
                rows={5}
                className="border-2 border-black rounded-lg opacity-75 p-2"
                value={loading === true ? "Translating..." : lang}
                placeholder="Translation"
                readOnly
              ></textarea>
            </form>
          </div>
          {errors && (
            <div className="text-red-500">
              <span>Server was done try again</span>
            </div>
          )}
          {empty && (
            <div className="text-red-500">
              <span>Please enter some text</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col bg-white/50 backdrop-blur-md p-4 rounded-lg h-96 w-80 overflow-y-auto overflow-x-hidden ">
        <h1 className="font-primary">Previous Translations:</h1>
        {history.map((item, index) => (
          <div key={index} className="row">
            <h1 className="text-lg font-primary italic mt-3">
              {item.english} :
            </h1>
            <h1 className="text-lg font-bold ">{item.lang}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
