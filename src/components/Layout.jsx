import styled from 'styled-components'
import {NavLink} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {Login} from "./Login";
import {Register} from "./Register";
import UsersStore from '../store/users'
import {observer} from "mobx-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey} from "@fortawesome/free-solid-svg-icons";

export const Layout = observer((props) => {
  let [hiddenLogin, setHiddenLogin] = useState(true);
  let [hiddenRegister, setHiddenRegister] = useState(true);

  const mainRef = useRef(null);

  useEffect(() => {
    const header = document.getElementById('header');
    mainRef.current.style.marginTop = getComputedStyle(header).height
  }, [])

  return (
      <>
        <Login hidden={hiddenLogin} onChange={(register) => {
          setHiddenLogin(!hiddenLogin);
          if (register) setHiddenRegister(!hiddenRegister)
        }}/>
        <Register hidden={hiddenRegister} onChange={() => setHiddenRegister(!hiddenRegister)}/>
        <Container>
          <Header id='header'>
            <HeaderContainer>
              <CustomNavLink to='/catalog'>каталог</CustomNavLink>
              <CustomNavLink underline='true' to='/'>Volunteer Point</CustomNavLink>
              {typeof UsersStore.currentUser?.id !== 'undefined' ?
                  <CustomNavLink to={`/user/${UsersStore.currentUser.id}`}>профиль</CustomNavLink> :
                  <Button onClick={() => setHiddenLogin(!hiddenLogin)}>войти</Button>
              }
            </HeaderContainer>
            {! UsersStore.currentUser?.is_moderator ||
                <ModeratorLink to='/moderation'><FontAwesomeIcon icon={faKey}/></ModeratorLink>
            }
          </Header>
          <Main ref={mainRef}>
            {props.children}
          </Main>
          <Footer>
            <span>VolunteerPoint® 2022-2023</span>
            <span>Контактная информация: info@volunteerpoint.ru</span>
          </Footer>
        </Container>
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
const ModeratorLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  justify-self: end;
  font-size: 1.5rem;
  margin-right: 1rem;
`

const Header = styled.header`
  padding: 1rem 0;
  background-color: #272727;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-wrap: nowrap;
`

const Main = styled.main`
  flex: 1 1 auto;
  display: flex;
`

const Footer = styled.footer`
  background-color: #272727;
  color: white;
  padding: 1rem 2rem;
  z-index: 2;
  display: flex;
  justify-content: space-between;
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
  justify-self: center;
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