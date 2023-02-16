import styled from 'styled-components'
import UsersStore from "../store/users";
import EventsStore from "../store/events";
import {useEffect} from "react";
import {EventThumbnail} from "../components/EventThumbnail";
import {observer} from "mobx-react";


export const ModeratorPage = observer(() => {
  useEffect(() => {
    EventsStore.loadModerationEvents();
  }, [])
  const events = EventsStore.moderationEvents;
  return (
      <Container>
        <Title>Страница модерации</Title>
        {events?.map(e => <EventThumbnail key={e.id} event={e} moderation={true}/>)}
      </Container>
  )
});

const Container = styled.div`
  padding: 1.5rem 0;
  width: 65%;
  margin-right: auto;
  margin-left: auto;
`
const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
`
const Row = styled.div`
  display: flex;
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
