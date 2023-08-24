import axios from 'axios';
const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;
//const BOOKS_API_KEY = process.env.REACT_APP_BOOKS_API_KEY;


const NEWS_API_ENDPOINT = `https://newsapi.org/v2/everything?q=novels&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;

const BOOKS_API_ENDPOINT = `http://openlibrary.org/subjects/love.json?published_in=1500-1600`;

export const getNews = async () => {

    let response;

    try {

        response = await axios.get (NEWS_API_ENDPOINT);
        response = response.data.articles.slice(0,15); //to display 15 articles only
    }

    catch (error) {
        return error;
    }

    return response;
};

export const getBooks = async () => {

    try {
        const response = await axios.get(BOOKS_API_ENDPOINT);
        console.log('Response:', response.data); // Log the entire response
        if (response.data.works && Array.isArray(response.data.works)) {
            return response.data.works;
        } else {
            console.error('Invalid response format:', response.data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
};