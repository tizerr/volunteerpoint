import {Layout} from "./components/Layout";
import {Provider} from "react-redux";
import {store} from "./store";
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { YMaps } from "@pbe/react-yandex-maps";
import {MainPage} from "./pages/MainPage";


function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <YMaps>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<MainPage/>}/>
                        </Routes>
                    </Layout>
                </YMaps>
            </BrowserRouter>
        </Provider>
    );
}

export default App;