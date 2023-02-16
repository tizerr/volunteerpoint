import styled from 'styled-components'
import {Map, Placemark, SearchControl, useYMaps} from "@pbe/react-yandex-maps";
import EventsStore from '../store/events'
import {useEffect, useRef, useState} from "react";
import UsersStore from "../store/users";
import {observer} from "mobx-react";
import eventPlaceholder from "../img/eventPlaceholder.png";
import {Link} from "react-router-dom";

export const MainPage = observer(() => {
  const mapRef = useRef(null);
  const [ymaps, setYmaps] = useState(null);

  const placemarkClick = (eClick, e) => {
    setActiveEvent(e);
  }

  useEffect(() => {
    if (ymaps) {
      UsersStore.loadCurrentPosition(ymaps);
      EventsStore.loadEvents(mapRef.current.getCenter(), mapRef.current.getZoom())
    }

  }, [ymaps])

  const onBoundsChange = () => {
    EventsStore.loadEvents(mapRef.current.getCenter(), mapRef.current.getZoom());
  }

  const events = EventsStore.events;
  // todo go to the nearest event if not in start user position
  const [activeEvent, setActiveEvent] = useState(events[0])

  return (
      <Container>
        <Map instanceRef={mapRef} modules={['geolocation', 'util.bounds']}
             state={{center: UsersStore.currentPosition, zoom: 13}}
             width='65%' height='99.99%' onLoad={ymapsInstance => setYmaps(ymapsInstance)}
             onBoundsChange={onBoundsChange}>
          <SearchControl options={{
            noPlacemark: true,
          }}/>
          {events.map(e => (
              <Placemark
                  key={e.id}
                  id={e.id}
                  geometry={[e.coord_x, e.coord_y]}
                  options={{
                    preset: 'islands#darkGreenStretchyIcon',
                  }}
                  properties={{iconContent: e.name.slice(0, 16) + (e.name.length > 15 ? '...' : '')}}
                  onClick={eClick => placemarkClick(eClick, e)}
              />
          ))}
        </Map>
        <Info>
          {activeEvent ? (
            <>
              <div>
                <InfoHeader>{activeEvent.name}</InfoHeader>
                <Group>
                  <Img src={activeEvent.img_path ? ('http://127.0.0.1:5000/' + activeEvent.img_path) : eventPlaceholder}/>
                  <div>
                    <InfoAddress><BigText>Адрес</BigText>:<br/>{activeEvent.address}</InfoAddress>
                    <InfoDate><BigText>Время проведения:</BigText><br/>с {activeEvent.date_start} по {activeEvent.date_end}</InfoDate>
                  </div>
                </Group>
                <InfoAbout><BigText>Описание:</BigText> {activeEvent.description.slice(0, 200) + (activeEvent.description.length > 200 ? '...' : '')}</InfoAbout>
              </div>
              <Button to={'/event/' + activeEvent.id}>
                Перейти к мероприятию
              </Button>
            </>
          ) : <></>}
        </Info>
      </Container>
  )
});

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  overflow-y: hidden;
`

const Info = styled.div`
  background-color: #ffffff;
  width: 35%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const InfoHeader = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  padding: 1rem 0;
  background-color: #f1f1f1;
`

const InfoAddress= styled.div`
  font-size: 1.5rem;
  padding: 0 2rem;
  margin-top: 1rem;
  flex-grow: 0;
`

const InfoDate= styled.div`
  font-size: 1.5rem;
  padding: 0 2rem;
  margin-top: 1rem;
  flex-grow: 0;
`

const InfoAbout= styled.div`
  font-size: 1.5rem;
  padding: 0 2rem;
  margin-top: 1rem;
  word-break: break-word;
`

const Img = styled.img`
  width: 15rem;
  height: 15rem;
  margin: 0 auto 0 auto;
  display: block;
`
const Group = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`
const BigText = styled.span`
  font-size: 1.7rem;
  font-weight: 500;
`
const Button = styled(Link)`
  padding: 1rem;
  color: #000;
  font-size: 1.4rem;
  text-decoration: none;
  background-color: #D1D1D1FF;
  width: fit-content;
  margin-left: auto;
  transition: background-color 0.2s ease-in;

  :hover {
    background-color: #a6a6a6;
  }
`
