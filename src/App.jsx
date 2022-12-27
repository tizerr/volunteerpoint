import {Layout} from "./components/Layout";
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { YMaps } from "@pbe/react-yandex-maps";
import {MainPage} from "./pages/MainPage";
import {useEffect} from "react";
import {getAccessToken} from "./utils";
import UsersStore from './store/users'
import {ProfilePage} from "./pages/ProfilePage";

function App() {
    useEffect(() => {
      async function inner() {
        if (getAccessToken()) {
          await UsersStore.loadCurrentUser(getAccessToken());
        }
      }
      inner();
    }, [])
    return (
        <BrowserRouter>
            <YMaps>
                <Layout>
                    <Routes>
                        <Route exact path="/" element={<MainPage/>}/>
                        <Route exact path="/user/:id" element={<ProfilePage/>}/>
                    </Routes>
                </Layout>
            </YMaps>
        </BrowserRouter>
    );
}

export default App;