import { configureStore } from "@reduxjs/toolkit";

import user from './userslice';

const store = configureStore({

    reducer: {user}

});

export default store;

