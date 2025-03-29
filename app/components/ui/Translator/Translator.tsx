import React, { useState } from 'react';
import styles from './Translator.module.css';

const Translator: React.FC = () => {
  const [polishText, setPolishText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPolishText(event.target.value);
  };

  const handleTranslate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(polishText)}&langpair=pl|en`
      );
      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Error from translation API:', errorDetails);
        throw new Error('Translation API error');
      }

      const data = await response.json();
      setEnglishText(data.responseData.translatedText);
    } catch (error) {
      setError('Translation failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleTranslate} className={styles.form}>
        <input
          type="text"
          placeholder="Enter Polish text"
          value={polishText}
          onChange={handleInputChange}
          className={styles.input}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </form>
      {error && <div className={styles.error}>{error}</div>}
      {englishText && (
        <div className={styles.result}>
          <strong>Translation:</strong> {englishText}
        </div>
      )}
    </div>
  );
};

export default Translator;
