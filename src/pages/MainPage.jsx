import styled from 'styled-components'
import {Map} from "@pbe/react-yandex-maps";

export const MainPage = () => {
    return (
        <Container>
            <Map defaultState={{ center: [55.75, 37.57], zoom: 9 }} width='65%' height='100%'/>
            <Info></Info>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-grow: 1;
`

const Info = styled.div`
    background-color: #EBECF0; 
    width: 35%; 
`

