import styles from './updateblog.module.css';
import {useState,useEffect} from 'react';
import {getBlogById} from '../../api/internal';
import { useNavigate,useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TextInput from '../../components/TextInput/textinput';
import { updateBlog } from '../../api/internal';


function UpdateBlog () {

    const navigate = useNavigate();

    const params = useParams();
    const blogId = params.id;

    const [title,setTitle] = useState('');
    const [content,setContent] = useState('');
    const [photo,setPhoto] = useState('');

    const getPhoto = (e) => {
        const files = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(files);
        reader.onloadend = () => {
            setPhoto(reader.result);
        };
    };

    const author = useSelector(state => state.user_id);

    const updateHandler = async() => {

        //http:backend_server:port/storage/filemname.png
        //base64 form
        let data;
        if (photo.includes('http')) //if phot has http as a substring then that means that the user doesnt want to update the photo
        {
            data = {
                author, title, content, blogId
            }
        }

        else {

            data = {
                author, title, content, photo, blogId
            };
        }


        const response = await updateBlog(data);

        if (response.status === 200) {

            navigate("/");
        }
    };

    useEffect(() => {
        async function getBlogDetails () {

            const response = await getBlogById(blogId);
            if (response.status === 200) {
                setTitle(response.data.blog.title)
                setContent(response.data.blog.content)
                setPhoto(response.data.blog.photo)
            }
        }
        getBlogDetails();
    }, []);

    return (
        <div className={styles.createblogwrapper}>
            <div className={styles.header}>
                Edit Your Blog
            </div>

            <TextInput
                type = "text"
                name = "title"
                placeholder = "title"
                value = {title}
                onChange = {(e) => setTitle(e.target.value)}
                style = {{width : '60%'}}

            
            />
            <textarea
                className={styles.content}
                placeholder = "Your content goes here..."
                maxLength={400}
                value= {content}
                onChange = {(e) => setContent(e.target.value)}

            />
            <div className={styles.photoprompt}>
                <p>Choose a photo</p>
                <input
                    type = "file"
                    name = "photo"
                    id = "photo"
                    accept = 'image/png, image/jpg, image/jpeg'
                    onChange = {getPhoto}
                
                />

                <img src = {photo} width={150} height={150} /> 
            </div>

            <button className={styles.updatebutton} onClick = {updateHandler}> Update </button>


        </div>
    )

}

export default UpdateBlog;