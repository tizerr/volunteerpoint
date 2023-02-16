import styled from 'styled-components'
import {Link} from "react-router-dom";
import eventPlaceholder from '../img/eventPlaceholder.png'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faXmark} from "@fortawesome/free-solid-svg-icons";
import {getAccessToken} from "../utils";
import EventsStore from '../store/events'
import {toJS} from "mobx";

export const EventThumbnail = ({event, moderation=false, show_status=false}) => {
  function moderate(e, choice) {
    e.preventDefault();
    fetch('http://127.0.0.1:5000/moderation/resolve', {
        method: 'POST',
        body: JSON.stringify({event_id: event.id, choice: choice, accessToken: getAccessToken()})
    }).then(r => r.json())
        .then(json => {
          console.log(event.id, toJS(EventsStore.moderationEvents), EventsStore.moderationEvents.indexOf(event.id))
        EventsStore.moderationEvents.splice(EventsStore.moderationEvents.map(v => v.id).indexOf(event.id), 1);
        event.is_published = Boolean(choice);
        event.was_moderated = true;
    });
  }
  let status;
  if (! event.was_moderated) status = 'ожидайте'
  else if (event.is_published) status = 'опубликовано'
  else status = 'отклонено'
  return (
      <Container to={'/event/' + event.id}>
        <Img src={event.img_path ? ('http://127.0.0.1:5000/' + event.img_path) : eventPlaceholder}/>
        <Info>
          <Title>{event.name}</Title>
          <Desc>{event.description.slice(0, 150) + (event.description.length > 150 ? '...' : '')}</Desc>
          <Row><Date>{event.date_start} - {event.date_end}</Date>{!show_status ||<Status status={status}>Статус модерации: {status}</Status>}</Row>
        </Info>
        {!moderation ||
            <ModerationButtons>
              <ButtonYes><FontAwesomeIcon icon={faCheck} onClick={(e) => moderate(e, 1)}/></ButtonYes>
              <ButtonNo><FontAwesomeIcon icon={faXmark} onClick={(e) => moderate(e, 0)}/></ButtonNo>
            </ModerationButtons>
        }
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
  width: 7rem;
  height: 7rem;
  margin-right: 3rem;
  flex-shrink: 0;
`
const Info = styled.div`
  flex-grow: 1;
`
const Title = styled.h3`
  font-size: 1.5rem;
`
const Desc = styled.p`
  margin: 1rem 0 0;
  word-wrap: anywhere;
`
const Date = styled.div`
  margin: 1rem 0 0;
  font-size: 1rem;
`
const Status = styled.div`
  margin: 1rem 0 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.status === 'ожидайте' ? 'black' : (props.status === 'опубликовано' ? '#08a708' : '#d23a18')}
`
const Row = styled.div`
  display: flex;
  justify-content: space-between;
`
const ModerationButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 1rem;
  pointer-events: none;
  cursor: default;
`
const ButtonYes = styled.button`
  color: #08a708;
  font-size: 1.5rem;
  border: 0;
  border-radius: 1rem;
  outline: none;
  width: 3rem;
  height: 3rem;
  background-color: #8fe98f;
  transition: background-color 0.15s ease-in;
  :hover {
    background-color: #5cea5c;
  }
  cursor: pointer;
  pointer-events: all;
`
const ButtonNo = styled(ButtonYes)`
  color: #d23a18;
  font-size: 1.8rem;
  background-color: #eaa191;
  :hover {
    background-color: #e67f66;
  }
`