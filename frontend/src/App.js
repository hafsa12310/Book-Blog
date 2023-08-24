import Navbar from './components/Navbar/navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer/footer';
import Home from './pages/Home/home';
import styles from './App.module.css';
import Protected from './components/Protected/protected';
import Error from './pages/Error/error';
import Login from './pages/Login/Login';
import {useSelector} from 'react-redux';
import Signup from './pages/SignUp/Signup';
import Books from './pages/LatestBooks/books';
import Blogs from './pages/Blogs/blogs';
import Submitblog from './pages/SubmitBlog/submitblog';
import BlogDetails from './pages/BlogDetails/blogdetails';
import UpdateBlog from './pages/UpdateBlog/updateblog';


function App() {

  const isAuth = useSelector((state)=> state.user.auth);
  return (

    <div className={styles.container}>
      <BrowserRouter>
        <div className={styles.layout}>
          <Navbar />

          <Routes>

            <Route

              path='/'
              exact
              element={

                <div className={styles.main}>
                  <Home />
                </div>
              }

            />

            <Route

              path='latest'
              exact
              element={

                <div className={styles.main}>
                  <Books />
                </div>
              }
            />

            <Route

              path='blogs'
              exact
              
              element={
                <Protected isAuth={isAuth}>
                <div className={styles.main}>
                  <Blogs />
                </div>
                </Protected>
              }
            />

            <Route

              path='blog/:id'
              exact
              
              element={
                <Protected isAuth={isAuth}>
                <div className={styles.main}>
                  <BlogDetails />
                </div>
                </Protected>
              }
            />

            <Route

              path='blog-update/:id'
              exact

              element={
                <Protected isAuth={isAuth}>
                <div className={styles.main}>
                  <UpdateBlog />
                </div>
                </Protected>
              }
            />

            <Route

              path='submit'
              exact
              element={
                <Protected isAuth={isAuth}>
                <div className={styles.main}> 
                  <Submitblog />
                </div>
                </Protected>
              }
            />

            <Route

              path='login'
              exact
              element={

                <div className={styles.main}>
                  <Login />
                </div>
              }
            />

            <Route

              path='signup'
              exact
              element={
                <div className={styles.main}>
                  <Signup />
                </div>
              }
            />
          

            <Route 
              path='*'
              element={
                <div className={styles.main}>
                  <Error />
                </div>
              }
            
            />

          </Routes>



          <Footer />
        </div>

      </BrowserRouter>
    </div>
  );
}

export default App;
