import { NavLink } from 'react-router-dom';
import styles from '../Navbar/navbar.module.css';
import {useSelector} from 'react-redux';
import {signout} from '../../api/internal';
import {resetUser} from '../../store/userslice';
import {useDispatch} from 'react-redux';

function Navbar() {

    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) =>state.user.auth);

    const handleSignout = async () =>
    {
        await signout();
        dispatch(resetUser());
    }

    return (
        <>
            <nav className={styles.navbar}>
                <NavLink
                    to='/'
                    className={`${styles.logo} ${styles.inactiveStyle}`} >Book Blog</NavLink>
                <NavLink to='/' className={({ isActive }) => isActive ? styles.activeStyle : styles.inactiveStyles} >Home</NavLink>
                <NavLink to='latest' className={({ isActive }) => isActive ? styles.activeStyle : styles.inactiveStyles} >Latest Books</NavLink>
                <NavLink to='blogs' className={({ isActive }) => isActive ? styles.activeStyle : styles.inactiveStyles} >Blogs</NavLink>
                <NavLink to='submit' className={({ isActive }) => isActive ? styles.activeStyle : styles.inactiveStyles}>Submit a Blog</NavLink>
                {isAuthenticated ? <div><NavLink><button className={styles.signoutbutton} onClick={handleSignout}>Sign Out</button></NavLink></div> : <div><NavLink to='login' className={({ isActive }) => isActive ? styles.activeStyle : styles.inactiveStyles}><button className={styles.loginbutton} >Login</button></NavLink>
                <NavLink to='signup' className={({ isActive }) => isActive ? styles.activeStyle : styles.inactiveStyles}><button className={styles.signupbutton}>Sign Up</button></NavLink></div>}

            </nav>
            <div className={styles.separator}></div>
        </>
    );
}

export default Navbar;