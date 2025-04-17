import React, { useState, useCallback } from "react";
import styles from "./Translator.module.css";
import { uiClick } from "@/utils/sound";
import {
  IconCopy,
  IconVolume,
  IconSwitch2,
  IconLanguage,
} from "@tabler/icons-react";
import Image from "next/image";

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: "pl", name: "Polish" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
];

const Translator: React.FC = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sourceLang, setSourceLang] = useState<Language>(languages[0]);
  const [targetLang, setTargetLang] = useState<Language>(languages[1]);
  const [characterCount, setCharacterCount] = useState(0);
  const maxCharacters = 500;

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
    uiClick.play();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    uiClick.play();
  };

  const speakText = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
    uiClick.play();
  };

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = event.target.value;
      if (text.length <= maxCharacters) {
        setSourceText(text);
        setCharacterCount(text.length);
        if (text.length > 0) {
          handleTranslate(undefined, text);
        } else {
          setTranslatedText("");
        }
      }
    },
    [],
  );

  const handleTranslate = async (
    event?: React.FormEvent,
    textToTranslate: string = sourceText,
  ) => {
    if (event) {
      event.preventDefault();
    }
    if (!textToTranslate.trim()) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          textToTranslate,
        )}&langpair=${sourceLang.code}|${targetLang.code}`,
      );

      if (!response.ok) {
        throw new Error("Translation API error");
      }

      const data = await response.json();
      setTranslatedText(data.responseData.translatedText);
    } catch (error) {
      setError("Translation failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.languageControls}>
          <select
            value={sourceLang.code}
            onChange={(e) =>
              setSourceLang(languages.find((l) => l.code === e.target.value)!)
            }
            className={styles.languageSelect}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          <button onClick={swapLanguages} className={styles.swapButton}>
            <IconSwitch2 size={24} />
          </button>

          <select
            value={targetLang.code}
            onChange={(e) =>
              setTargetLang(languages.find((l) => l.code === e.target.value)!)
            }
            className={styles.languageSelect}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.logoContainer}>
          <Image
            src="/images/fluently-clean-wh.png"
            alt="Fluently Logo"
            width={120}
            height={40}
            className={styles.logo}
          />
        </div>
      </div>

      <div className={styles.translationArea}>
        <div className={styles.textSection}>
          <textarea
            placeholder={`Enter text in ${sourceLang.name}`}
            value={sourceText}
            onChange={handleInputChange}
            className={styles.textarea}
          />
          <div className={styles.textControls}>
            <span className={styles.charCount}>
              {characterCount}/{maxCharacters}
            </span>
            <button
              onClick={() => speakText(sourceText, sourceLang.code)}
              className={styles.iconButton}
              title="Listen"
            >
              <IconVolume size={20} />
            </button>
            <button
              onClick={() => copyToClipboard(sourceText)}
              className={styles.iconButton}
              title="Copy"
            >
              <IconCopy size={20} />
            </button>
          </div>
        </div>

        <div className={styles.textSection}>
          <textarea
            placeholder="Translation"
            value={translatedText}
            readOnly
            className={`${styles.textarea} ${styles.translatedText}`}
          />
          <div className={styles.textControls}>
            <button
              onClick={() => speakText(translatedText, targetLang.code)}
              className={styles.iconButton}
              title="Listen"
            >
              <IconVolume size={20} />
            </button>
            <button
              onClick={() => copyToClipboard(translatedText)}
              className={styles.iconButton}
              title="Copy"
            >
              <IconCopy size={20} />
            </button>
          </div>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default Translator;
