import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { themeSettings } from './theme';
import Login from "./pages/Login"
import ProfilePage from './pages/ProfilePage';
import NewStory from './pages/NewStory';
import Topic from "./pages/Topic";
import StoriesFilter from './pages/StoriesFilter';
import SearchResults from './pages/SearchResults';
import Settings from "./pages/Settings";
import ImagesStories from "./pages/ImagesStories";
function App() {

  const theme = useSelector( (state) => state.theme );
  const isAuth = Boolean(useSelector((state) => state.token))
  const finalTheme = useMemo( () => createTheme(themeSettings(theme)), [theme]);
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={finalTheme}>
          <CssBaseline>
            <Routes>
              <Route path="/" element={ <Home/> } />
              <Route path="/login" element={ isAuth ? <Navigate to="/"/> : <Login /> } />
              <Route path="/user/:thisUserId" element={ <ProfilePage />} />
              <Route path="/newstory" element={ isAuth ? <NewStory/> : <Navigate to="/login"/> } />
              <Route path="/newstory/response/:response" element={ isAuth ? <NewStory/> : <Navigate to="/login"/>} />
              <Route path="/search/:choice/:keyword" element={ <SearchResults/> } />
              <Route path="/topic/:topic" element={ <Topic/> } />
              <Route path="/agree" element={isAuth ? <StoriesFilter isAgree={true} isDisagree={false} /> : <Navigate to="/login"/> }/>
              <Route path="/disagree" element={isAuth ? <StoriesFilter isAgree={false} isDisagree={true} /> : <Navigate to="/login"/>} />
              <Route path="/settings" element={isAuth ? <Settings/> : <Navigate to="/login"/> } />
              <Route path="/images" element={<ImagesStories/>} />
            </Routes>
          </CssBaseline>
        </ThemeProvider>
     </BrowserRouter>
        
    </div>
  )
}

export default App;
