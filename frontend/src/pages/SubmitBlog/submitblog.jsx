import styles from './submitblog.module.css';
import {useState} from 'react';
import {SubmitBlogs} from '../../api/internal';
import {useSelector} from 'react-redux';
import TextInput from '../../components/TextInput/textinput';
import {useNavigate} from 'react-router-dom';

function Submitblog () {
    const navigate = useNavigate();

    const [title,setTitle] = useState('');
    const [content,setContent] = useState('');
    const [photo,setPhoto] = useState('');

    const author = useSelector(state => state.user._id);

    const getPhoto = (e) => {
        const files = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(files);
        reader.onloadend = () => {
            setPhoto(reader.result);
        }
    }

    const submitHandler = async() => {

        const data = {
            author, title, content, photo
        };


        const response = await SubmitBlogs(data);

        if (response.status === 201) {

            navigate("/");
        }
    };

    return (

        <div className={styles.createblogwrapper}>
            <div className={styles.header}>
                Create a Blog
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

                {photo !== '' ? <img src = {photo} width={150} height={150} /> : " "}
            </div>

            <button className={styles.submitbutton} onClick = {submitHandler} disabled={title === '' || content === '' || photo === ''}> Submit </button>


        </div>
    )


}

export default Submitblog;