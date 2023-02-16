import {Layout} from "./components/Layout";
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { YMaps } from "@pbe/react-yandex-maps";
import {MainPage} from "./pages/MainPage";
import {useEffect, useRef} from "react";
import {getAccessToken} from "./utils";
import UsersStore from './store/users'
import {ProfilePage} from "./pages/ProfilePage";
import {CreateEventPage} from "./pages/CreateEventPage";
import {EditProfilePage} from "./pages/EditProfilePage";
import {EventPage} from "./pages/EventPage";
import {ModeratorPage} from "./pages/ModeratorPage";
import {CatalogPage} from "./pages/CatalogPage";

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
            <YMaps query={{apikey: '57b11092-fc53-4fef-938c-739ae9dc9c90'}}>
                <Layout>
                    <Routes>
                        <Route exact path="/" element={<MainPage/>}/>
                        <Route exact path="/user/:id/" element={<ProfilePage/>}/>
                        <Route exact path="/create_event" element={<CreateEventPage/>}/>
                        <Route exact path="/edit_profile" element={<EditProfilePage/>}/>
                        <Route exact path="/event/:id" element={<EventPage/>}/>
                        <Route exact path="/moderation" element={<ModeratorPage/>}/>
                        <Route exact path="/catalog" element={<CatalogPage/>}/>
                    </Routes>
                </Layout>
            </YMaps>
        </BrowserRouter>
    );
}

export default App;