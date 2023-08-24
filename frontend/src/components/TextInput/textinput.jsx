import styles from './textinput.module.css';

function textinput (props) {

    return (
    <div className={styles.textinputwrapper}>
        <input {...props}/>
        {props.error && <p className={styles.errmsg}>{props.errormessage}</p>}
    </div>
    );

}

export default textinput;