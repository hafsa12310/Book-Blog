import styles from './error.module.css';
import {Link} from'react-router-dom';

function Error() {

    return <div className = {styles.err}>
        <div className = {styles.errheader} > 
        Error 404- Page Not Found
        </div>
            <div className = {styles.errbody}>
                Go back to 
                    <Link  to='/' className = {styles.homelink}>
                        Home 
                    </Link>
                
                Page
            </div>
    </div>;
}

export default Error;