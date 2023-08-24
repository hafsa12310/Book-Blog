import styles from './blogdetails.module.css';
import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {getBlogById, deleteBlog, postComment, getCommentsById} from '../../api/internal';
import {useNavigate} from 'react-router-dom';
import Loader from '../../components/Loader/loader';
import CommentList from '../../components/CommentList/CommentList';

function BlogDetails () {

    const [blog,setBlog] = useState([]);
    const [comments,setComments] = useState([]);
    const [ownsBlog,setownsBlog] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [reload,setReload] = useState(false);
    
    const navigate = useNavigate();

    const params = useParams();
    const blogId = params.id;

    const username = useSelector(state=>state.user.username); //to get the username of the current user
    const userid = useSelector(state=>state.user._id);

    useEffect(() => {
        async function getBlogDetails () {
            const CommentResponse = await getCommentsById(blogId);
            if (CommentResponse.status === 200) {
                setComments(CommentResponse.data.data);
            }

            const blogResponse = await getBlogById(blogId);
            if (blogResponse.status === 200) {
                //set ownership
                setownsBlog (username === blogResponse.data.blog.authorUsername );
                setBlog(blogResponse.data.blog);
            }
        }
        getBlogDetails();
    },[reload])

    const postCommentHandler = async () => {
        const data = {
            author: userid,
            blog: blogId,
            content: newComment
        }

        const response = await postComment (data);
        
        if (response.status === 201) {

            setNewComment("");
            setReload(!reload);
        }
    }

    const delBlogHandler = async () => {
        const response = await deleteBlog(blogId);

        if (response.status === 200) {
            navigate("/");
        }
    }

    if (blog.length === 0) {
        return <Loader text="blog details"/>
    }

    return (
        <div className={styles.detailswrapper}>
            <div className={styles.left}>
                <h1 className={styles.title}>{blog.title}</h1>
                <div className={styles.meta}>
                    <p>@{blog.authorUserName + " on " + new Date(blog.createdAt).toDateString()}</p>
                </div>
                <div className={styles.photo}>
                    <img src={blog.photo} width={250} height={250} />
                </div>

                <p className={styles.content}>{blog.content}</p>
                {
                    ownsBlog && (
                        <div className={styles.controls}>
                            <button className={styles.edit} onClick={() => {navigate(`blog-update/${blog._id}`)}}>
                                Edit
                            </button>

                            <button className={styles.delete} onClick={delBlogHandler}>
                                Delete
                            </button>
                        </div>
                    )
                }
            </div>
            <div className={styles.right}>

                <div className={styles.commentswrapper}>
                    <CommentList comments={comments} />
                    <div className={styles.postComment} onClick={postCommentHandler}>
                        <input
                            className={styles.inputfield}
                            placeholder='comment goes here...'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button className={styles.postButton}>Post</button>
                    </div>
                </div>
            </div>

        </div>
    )



}

export default BlogDetails;