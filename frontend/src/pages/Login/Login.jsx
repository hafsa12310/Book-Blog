import { useState } from 'react';
import styles from './login.module.css';
import TextInput from '../../components/TextInput/textinput';
import loginschema from '../../schemas/loginschema';
import {useFormik} from 'formik';
import {login} from '../../api/internal';
import {setUser} from '../../store/userslice'; //to set the state of the user
import {useDispatch} from "react-redux"; //to write the state of the user
import {useNavigate} from "react-router-dom";

function Login () {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error,setError] =useState('');
    

    const handleLogin = async () => {

        const data = {
            username: values.username, 
            password: values.password
        }
        const response = await login(data);

        if (response.status === 200) { //if login successful
            //1.setUser
            const user = {
                _id: response.data.user._id,
                email: response.data.user.email,
                username: response.data.user.username,
                auth: response.data.auth //used this intead of response.data.user.auth as it wasnt in accordance with the backend
            }

            dispatch (setUser(user));
            //2. redirect to home page
                //after dispatching navigate the user to home page
                navigate ('/');

        }

        else if (response.code === 'ERR_BAD_REQUEST') {

            //display error message
            setError (response.response.data.message);


        }
    }

    const {values, touched, handleBlur, handleChange, errors} = useFormik({
        initialValues : {
            username:'',
            password:''
        },

        validationSchema: loginschema
    });

    return (

        <div className={styles.loginwrapper}>

            <div className={styles.loginheader}>

                Log in to your account
                <TextInput
                    type= "text"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="username"
                    error= {errors.username && touched.username ? 1:undefined}
                    errormessage = {errors.username}
                
                />
                <TextInput
                    type= "password"
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="password"
                    error= {errors.password && touched.password ? 1:undefined}
                    errormessage = {errors.password}
                />
                <div><button className={styles.loginpagebutton} onClick={handleLogin} disabled={!values.username || !values.password || errors.username || errors.password }>Log In</button></div>
                <div><span> Dont have an account? <button className={styles.createacc} onClick={ () => navigate('/signup')} >Register</button></span>{error!=='' ? <p className ={styles.ermsg}>{error}</p>:''}</div>

            </div> 
        </div>
    ); 

}

export default Login;