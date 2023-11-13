import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../Assets/ai.jpeg';
import { Configuration, OpenAIApi } from 'openai';



const configuration = new Configuration({
  apiKey: '',
});
const openai = new OpenAIApi(configuration);

export const ImageGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [image_url, setImage_url] = useState('/');
  const [inputValue, setInputValue] = useState(''); // State to store input value

  async function fetchData() {
    if (inputValue === '') return 0;
    try {
      setIsLoading(true);
      const response = await openai.createImage({
        prompt: inputValue,
        n: 1,
        size: '512x512',
      });
      setImage_url(response.data.data[0].url);
      setIsLoading(false);
      setErrorText('');
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.status === 400) {
        setErrorText("Error: Bad prompt. Please check your prompt.\nIt violates OpenAI's Terms of Service");
      } else {
        setErrorText('An error occurred. Please try again.');
      }
      console.log(error.message);
      console.log(error.response.status);
      console.log(error.response.data);
    }
  }

  let inputRef = useRef(null);

  return (
    <div className="ai-image-generator">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <div className="header">AI Image <span>Generator</span></div>
      <div className="img-loading">
        <div className="image">
          <img src={image_url === '/' ? default_image : image_url} alt="" />
          <div className="loading">
            <div className={isLoading ? 'loading-bar-full' : 'loading-bar'}></div>
            <div className={isLoading ? 'loading-text' : 'display-none'}>Loading..</div>
          </div>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe the image you want to see"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Update input value on change
        />
        <div className="generate-btn" onClick={() => fetchData()}>
          Generate
        </div>
      </div>

      {errorText && (
        <div className="error-message">
          <p style={{ color: 'red' }}>{errorText}</p>
        </div>
      )}
    </div>
  );
};
