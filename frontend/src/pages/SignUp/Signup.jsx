import { useState } from 'react';
import styles from './signup.module.css';
import TextInput from '../../components/TextInput/textinput';
import signupschema from '../../schemas/signupschema';
import {useFormik} from 'formik';
import {setUser} from '../../store/userslice'; //to set the state of the user
import {useDispatch} from "react-redux"; //to write the state of the user
import {useNavigate} from "react-router-dom";
import {signup} from '../../api/internal';

function Signup () {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error,setError] =useState('');

    const handleSignup = async () => {

        const data = {
            name:values.name,
            username: values.username,
            email: values.email, 
            password: values.password,
            confirmPassword: values.confirmPassword
        }
        const response = await signup(data);

        if (response.status === 201) { //if login successful
            //1.setUser
            const user = {
                _id: response.data.user._id,
                email: response.data.user.email,
                username: response.data.user.username,
                auth: response.data.auth //used this intead of response.data.user.auth as it wasnt in accordance with the backend
            };

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
            name:'',
            email:'',
            username:'',
            password:'',
            confirmPassword:''
        },

        validationSchema: signupschema
    });

    return (

        <div className={styles.signupwrapper}>

            <div className={styles.signupheader}>

                Create an account
                <TextInput
                    type= "text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="name"
                    error= {errors.name && touched.name ? 1:undefined}
                    errormessage = {errors.name}
                
                />
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
                    type= "text"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="email"
                    error= {errors.email && touched.email ? 1:undefined}
                    errormessage = {errors.email}
                />

<TextInput
                    type= "password"
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="pasword"
                    error= {errors.password && touched.password ? 1:undefined}
                    errormessage = {errors.password}
                />

<TextInput
                    type= "password"
                    value={values.confirmPassword}
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="confirmPassword"
                    error= {errors.confirmPassword && touched.confirmPassword ? 1:undefined}
                    errormessage = {errors.confirmPassword}
                />
                <div><button className={styles.signuppagebutton} onClick={handleSignup} disabled= {!values.username || !values.password || !values.confirmPassword || !values.name || !values.email || errors.username || errors.password || errors.confirmPassword || errors.name || errors.email}>SignUp</button></div>
                <div><span> Already have an account? <button className={styles.log} onClick={ () => navigate('/login')} >Login</button></span>{error!=='' ? <p className ={styles.ermsg}>{error}</p>:''}</div>

            </div> 
        </div>
    );

}

export default Signup;