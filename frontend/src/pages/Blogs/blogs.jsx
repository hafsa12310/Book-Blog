import styles from './blogs.module.css';
import React, { useEffect, useState } from 'react';
import Loader from '../../components/Loader/loader';
import { getAllBlogs } from '../../api/internal';
import {useNavigate} from 'react-router-dom';

function Blog () {

    const navigate = useNavigate();

    const [blogs,setBlogs] = useState([]);

    useEffect (() => {
        //IIFE

        (async function getBlogs() {

            const response = await getAllBlogs();

            if (response.status === 200)
            {
                setBlogs(response.data.blogs);
            }
        }) ();

        setBlogs([]);
    },[] );

    if (blogs.length === 0) {
        return <Loader  text="blogs"/>
    }

    return (

        <div className={styles.blogswrapper}>
            {blogs.map((blog) => (

                <div key={blog._id} className={styles.blog} onClick = {() => navigate(`/blog/${blog._id}`)}>
                    <h2>{blog.title}</h2>
                    <img src={blog.photo}/>
                    <p>{blog.content}</p>
                </div>

            ))}
        </div>
    )

           
                

}

export default Blog;