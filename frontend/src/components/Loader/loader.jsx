import { BallTriangle } from 'react-loader-spinner';
import styles from './loader.module.css';

function Loader ({text}) {

    return(
        <div className={styles.loaderwrapper}>
                Loading <h2>{text}</h2>
                <BallTriangle 
                height={80}
                width={80}
                radius={1}
                color="#4fa94d"
                
                />
        </div>
    )
}

export default Loader;