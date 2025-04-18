import React, { useState, useCallback, useRef } from "react";
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
  { code: "en-gb", name: "English (UK)" },
  { code: "en-us", name: "English (US)" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "it", name: "Italian" },
  { code: "pt-pt", name: "Portuguese (EU)" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
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
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const swapLanguages = () => {
    const oldSourceLang = sourceLang;
    const oldTargetLang = targetLang;
    const oldSourceText = sourceText;
    const oldTranslatedText = translatedText;

    setSourceLang(oldTargetLang);
    setTargetLang(oldSourceLang);

    setSourceText(oldTranslatedText);
    setTranslatedText(oldSourceText);

    setCharacterCount(oldTranslatedText.length);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (oldTranslatedText) {
      debounceTimer.current = setTimeout(() => {
        translateText(
          oldTranslatedText,
          oldTargetLang.code,
          oldSourceLang.code,
        );
      }, 100);
    }

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

        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
          if (text.length > 0) {
            translateText(text, sourceLang.code, targetLang.code);
          } else {
            setTranslatedText("");
          }
        }, 500);
      }
    },
    [sourceLang.code, targetLang.code],
  );

  const translateText = async (
    text: string,
    fromLang: string,
    toLang: string,
  ) => {
    setError("");
    setTranslatedText("");
    setLoading(true);

    try {
      const normalizedFromLang = fromLang.toUpperCase();
      const normalizedToLang = toLang.toUpperCase();

      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          sourceLang: normalizedFromLang,
          targetLang: normalizedToLang,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Translation failed");
      }

      const data = await response.json();
      setTranslatedText(data.translatedText);
    } catch (error) {
      console.error("Translation error:", error);
      setError("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSourceLangChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newLang = languages.find((l) => l.code === event.target.value)!;
    setSourceLang(newLang);
    if (sourceText) {
      translateText(sourceText, newLang.code, targetLang.code);
    }
  };

  const handleTargetLangChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newLang = languages.find((l) => l.code === event.target.value)!;
    setTargetLang(newLang);
    if (sourceText) {
      translateText(sourceText, sourceLang.code, newLang.code);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.languageControls}>
          <select
            value={sourceLang.code}
            onChange={handleSourceLangChange}
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
            onChange={handleTargetLangChange}
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
