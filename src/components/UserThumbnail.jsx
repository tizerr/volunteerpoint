import styled from 'styled-components'
import {Link} from "react-router-dom";
import userPlaceholder from '../img/eventPlaceholder.png'

export const UserThumbnail = ({user}) => {
  console.log(user)
  return (
      <Container to={'/user/' + user.id}>
        <Img src={user.img_path ? ('http://127.0.0.1:5000/' + user.img_path) : userPlaceholder}/>
        <Info>
          <Row><Title>{user.username}</Title><Address>{user.address || 'Адрес не указан'}</Address></Row>
          <Desc>{user.description || 'Описание не указано'}</Desc>
        </Info>
      </Container>
  )
}

const Container = styled(Link)`
  color: inherit;
  text-decoration: none;
  border-radius: .5rem;
  width: 100%;
  display: flex;
  background-color: rgb(247, 247, 247);
  padding: 1rem 2rem 1rem 1rem;

  :not(:last-child) {
    margin-bottom: 2rem;
  }
`
const Img = styled.img`
  width: 5rem;
  height: 5rem;
  margin-right: 3rem;
  flex-shrink: 0;
`
const Info = styled.div`
`
const Title = styled.h3`
  font-size: 1.5rem;
  margin-right: 1rem;
`
const Desc = styled.p`
  margin: 1rem 0 0;
  word-wrap: anywhere;
`
const Address = styled.div`
  font-size: 1rem;
  height: fit-content;
`
const Row = styled.div`
  display: flex;
  align-items: center;
`