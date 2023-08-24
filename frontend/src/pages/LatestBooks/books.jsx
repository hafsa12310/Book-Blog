import styles from './books.module.css';
import React, { useEffect, useState } from 'react';
//import {useEffect, useState} from 'redux';
import Loader from '../../components/Loader/loader';
import { getBooks } from '../../api/external';


function Books() {

    const [data,setData] = useState({ works: [] });

    useEffect (() => {
        //IIFE

        (async function getLatestBooks() {
            try {
                const response = await getBooks();
                if (Array.isArray(response)) {
                    setData({ works: response }); // Set the response as works array
                } else {
                    console.error('Invalid response format:', response);
                }
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        })();
    }, []);

    

    if (data.length === 0) 
    {
        return <Loader  text="latest books"/>
    }

    return (
        <table className={styles.table}>
            <thead>
                <tr className={styles.tableheadingrow}>
                    <th>
                        Title
                    </th>
                    <th>
                        Edition Count
                    </th>
                    <th>
                        Author
                    </th>
                </tr>
            </thead>
            <tbody>
            {data.works.map((book) => (
                <tr key={book.key} className={styles.tabledata}>
                    <td>{book.title ? book.title : 'Title Not Available'}</td>
                    <td>{book.edition_count ? book.edition_count : 'Edition Count Not Available'}</td>
                    <td>{book.authors && book.authors[0]?.name ? book.authors[0].name : 'Author Not Available'}</td>
                </tr>
            ))}

            </tbody>
        </table>
    );


}

export default Books;