import {Layout} from "./components/Layout";
import {UsersStore} from "./store/users";
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { YMaps } from "@pbe/react-yandex-maps";
import {MainPage} from "./pages/MainPage";


function App() {
    return (
        <BrowserRouter>
            <YMaps>
                <Layout>
                    <Routes>
                        <Route exact path="/" element={<MainPage/>}/>
                    </Routes>
                </Layout>
            </YMaps>
        </BrowserRouter>
    );
}

export default App;