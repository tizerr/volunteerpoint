import styled from 'styled-components'
import {NavLink} from "react-router-dom";

export const Layout = (props) => {
    return (
        <>
        <Container>
            <Header>
                <HeaderContainer>
                    <CustomNavLink to='/catalog'>каталог</CustomNavLink>
                    <CustomNavLink underline to='/'>Volunteer Point</CustomNavLink>
                    <CustomNavLink to='/profile'>профиль</CustomNavLink>
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
}

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
`