import {useState,useEffect} from 'react';
import styles from './home.module.css';
import {getNews} from '../../api/external';
import Loader from '../../components/Loader/loader';

function Home () {

    const [articles, setArticles] = useState([]);
    useEffect(() => {
        (async function newsAPIcall () {
            const response = await getNews();
            setArticles(response);
        }) (); //function defined here has to be used immediately aswell

        //cleanup function
        //resetting of state

        setArticles([])


    }, []); //empty dependency list which means that our userEffect will run when the home page will be rendered 

    const handleCardClick =  (url) => {
        
        window.open(url,"_blank"); //window object is globally available, blank parameter means that the article is opening in a separate new tab

    }

    if (articles.length === 0) {

        return <Loader  text='Loading homepage'/>
    }

        return (
            <> 
                <div className={styles.header}>
                    Latest Articles
                </div>
                <div className={styles.grid}>
                    {articles.map((article)=> 
                    
                    <div className={styles.card} key={article.url} onClick = {() => handleCardClick(article.url)}>

                        <img src={article.urlToImage}/>
                        <h3>{article.title}</h3>
                    </div>)}
                </div>
            
            </>
        ) 

}

export default Home;