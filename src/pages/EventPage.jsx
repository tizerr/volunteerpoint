import styled from 'styled-components'
import UsersStore from "../store/users";
import EventsStore from "../store/events";
import {observer} from "mobx-react";
import eventPlaceholder from '../img/eventPlaceholder.png'
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {getAccessToken} from "../utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {EventThumbnail} from "../components/EventThumbnail";
import {UserThumbnail} from "../components/UserThumbnail";


export const EventPage = observer(() => {

  let {id} = useParams();
  id = Number(id);

  function participate() {
    fetch('http://127.0.0.1:5000/participate_event', {
      method: 'POST',
      body: JSON.stringify({id: id, accessToken: getAccessToken()})
    }).then(r => r.json).then(json => {
      EventsStore.cuParticipatedInds.push(id)
      UsersStore.currentUser.participated_ids.push(id)
      event.participants_id.push(UsersStore.currentUser.id)
    });
  }

  function leave() {
    fetch('http://127.0.0.1:5000/leave_event', {
      method: 'POST',
      body: JSON.stringify({id: id, accessToken: getAccessToken()})
    }).then(r => r.json).then(json => {
      EventsStore.cuParticipatedInds.splice(EventsStore.cuParticipatedInds.indexOf(id), 1)
      UsersStore.currentUser.participated_ids.splice(UsersStore.currentUser.participated_ids.indexOf(id), 1)
      event.participants_id.splice(event.participants_id.indexOf(UsersStore.currentUser.id), 1)
    });
  }

  useEffect(() => {
    if (!EventsStore.events.find(e => e.id === id)) EventsStore.loadEventById(id);
  }, []);
  const event = EventsStore.events.find(e => e.id === id);
  if (event) {
    if (!UsersStore.users.find(u => u.id === event.author_id)) UsersStore.loadUser(event.author_id);
  }
  const author = UsersStore.users.find(u => u.id === event.author_id);
  const isParticipated = UsersStore.currentUser.participated_ids?.includes(event?.id)
  const isAuthor = author?.id === UsersStore.currentUser.id

  let participants;
  if (author && author.id === UsersStore.currentUser.id && !participants) {
    UsersStore.loadParticipants(event.id);
    participants = UsersStore.users.filter(v => v.participated_ids?.includes(event.id))
    console.log(participants)
  }

  return event ? (
      <Container>
        <Row>
          <Img src={event.img_path ? ('http://127.0.0.1:5000/' + event.img_path) : eventPlaceholder}/>
          <div>
            <Title>{event.name}</Title>
            <Address>{event.address}</Address>
            <Date>{event.date_start} - {event.date_end}</Date>
            {author ? <Name>Автор: {author.username}</Name> : <></>}
            {author ? <Email>Контактные данные: {author.email}</Email> : <></>}
            <Members>Участников: {event.participants_id.length || '0'}</Members>
          </div>
        </Row>
        <Desc>{event.description}</Desc>
        {!isAuthor ? (isParticipated ?
                <Row><Participated>Вы участвуете <FontAwesomeIcon icon={faCheck}/></Participated><ButtonLeave
                    onClick={leave}>Отказаться от участия</ButtonLeave></Row>
                :
                <Button onClick={participate}>Принять участие</Button>)
            :
            <><MembersListTitle>Список участников:</MembersListTitle>{participants?.map(i => <UserThumbnail key={i.id} user={i}/>)}</>
        }
      </Container>
  ) : <div>Мероприятие не найдено</div>
});

const Container = styled.div`
  padding: 3rem 0;
  width: 55%;
  margin-right: auto;
  margin-left: auto;
`

const Img = styled.img`
  width: 15rem;
  height: 15rem;
  margin-right: 3rem;
`

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
`
const Name = styled.div`
  font-size: 1.25rem;
  margin-top: 1rem;
`
const Email = styled.div`
  font-size: 1.25rem;
`
const Row = styled.div`
  display: flex;
`
const Address = styled.div`
  margin: 0.75rem 0 0;
  font-size: 1.3rem;
`
const Date = styled.div`
  margin: 0.25rem 0 0;
  font-size: 1.3rem;
`
const Members = styled.div`
  margin: 0.75rem 0 0;
  font-size: 1.3rem;
`
const Desc = styled.div`
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 4rem;
  word-break: break-word; 
`
const Participated = styled.div`
  color: #10b210;
  font-size: 1.75rem;
  margin-right: 1rem;
`
const MembersListTitle = styled.div`
  font-size: 1.75rem;
  margin-bottom: 1rem;
`
const Button = styled.button`
  font-size: 1.5rem;
  background-color: #d1d1d1;
  outline: none;
  border: 0;
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease-in;

  :hover {
    background-color: #a6a6a6;
  }
`

const ButtonLeave = styled.button`
  font-size: 1.4rem;
  background-color: #d1d1d1;
  outline: none;
  border: 0;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease-in;

  :hover {
    background-color: #a6a6a6;
  }
`