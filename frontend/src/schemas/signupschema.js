import * as yup from 'yup';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const errmsg = 'password must have uppercase and lower case letters and digits'; 

const signupschema = yup.object().shape({

    name:yup.string().max(30).required('name is required'),
    email:yup.string().email('enter a valid email').required('email is required'),
    username:yup.string().min(5).max(30).required('username is required'),
    password:yup.string().min(8).max(25).matches(passwordPattern, {message: errmsg }).required('password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')],'Passwords must match').required('password is required')
    
});

export default signupschema;