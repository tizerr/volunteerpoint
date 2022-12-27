import styled from 'styled-components'
import {NavLink} from "react-router-dom";
import {useState} from "react";
import {Login} from "./Login";
import {Register} from "./Register";
import UsersStore from '../store/users'
import {observer} from "mobx-react";

export const Layout = observer((props) => {
  let [hiddenLogin, setHiddenLogin] = useState(true);
  let [hiddenRegister, setHiddenRegister] = useState(true);
  return (
      <>
        <Login hidden={hiddenLogin} onChange={(register) => {setHiddenLogin(!hiddenLogin); if (register) setHiddenRegister(!hiddenRegister)}}/>
        <Register hidden={hiddenRegister} onChange={() => setHiddenRegister(!hiddenRegister)}/>
        <Container>
          <Header>
            <HeaderContainer>
              <CustomNavLink to='/catalog'>каталог</CustomNavLink>
              <CustomNavLink underline='true' to='/'>Volunteer Point</CustomNavLink>
              {UsersStore.currentUser ?
                  <CustomNavLink to={`/user/${UsersStore.currentUser.id}`}>профиль</CustomNavLink> :
                  <Button onClick={() => setHiddenLogin(!hiddenLogin)}>войти</Button>
              }

            </HeaderContainer>
          </Header>
          <Main>
            {props.children}
          </Main>
        </Container>
        <Footer>
          Ilya 2022
        </Footer>
      </>
  )
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const CustomNavLink = styled(NavLink)`
  font-size: 1.5rem;
  color: white;
  text-decoration: none;

  ::after {
    display: ${props => props.underline ? 'block' : 'none'};
    content: '';
    background-color: #fff;
    width: 100%;
    height: 0.1rem;
  }
`

const Header = styled.header`
  padding: 1rem 0;
  background-color: #272727;
`

const Main = styled.main`
  flex: 1 1 auto;
  display: flex;
`

const Footer = styled.footer`
  background-color: #272727;
  color: white;
  padding: 1rem 2rem;
`

const HeaderContainer = styled.div`
  width: 40%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  @media (max-width: 800px) {
    width: 60%;
  }
  @media (max-width: 600px) {
    width: 80%;
  }
`

const Button = styled.button`
  font-size: 1.5rem;
  color: white;
  text-decoration: none;
  background-color: transparent;
  outline: 0;
  border: 0;
  cursor: pointer;
`