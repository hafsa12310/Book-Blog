import {Navigate} from 'react-router-dom';

function protect ({isAuth,children}) { 

    if (isAuth) {
        return children;
    }

    else {
        return <Navigate to='/login' />;
    }



}

export default protect;