import styled from 'styled-components'
import {useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import UsersStore from "../store/users";
import EventsStore from "../store/events";
import {observer} from "mobx-react";
import {getAccessToken} from "../utils";
import {EventThumbnail} from "../components/EventThumbnail";
import {toJS} from "mobx";
import qe from "styled-components";


export const CatalogPage = observer(() => {
  EventsStore.loadTopEvents();
  const top = EventsStore.events.filter(v => EventsStore.topEventsIds.includes(v.id));

  const [qe, setQe] = useState([]);
  const [searched, setSearched] = useState(false);
  const searchRef = useRef(null);

  function search(e) {
    e.preventDefault();
    const query = searchRef.current.value;
    if (query === '') {
      setSearched(false);
      return;
    }
    console.log(query)
    fetch('http://127.0.0.1:5000/search', {
      method: 'POST',
      body: JSON.stringify({query: query})
    }).then(r => r.json()).then(json => {
      setQe(json);
      EventsStore.addEvents(json);
      setSearched(true);
    })
  }
  return (
      <Container>
        <SearchForm>
          <Search ref={searchRef}/>
          <SearchButton onClick={search} type='button'>Найти</SearchButton>
        </SearchForm>
        {(top && !searched) ? (
            <>
              <Title>Наиболее популярные события:</Title>
              {top.map(e => <EventThumbnail key={e.id} event={e}/>)}
            </>
        ) : (qe.length ? (
                <>{qe.map(e => <EventThumbnail key={e.id} event={e}/>)}</>
            ) : <Nothing>По вашему запросу ничего не найдено</Nothing>

        )
        }
      </Container>
  )
});

const Container = styled.div`
  padding: 3rem 0;
  width: 60%;
  margin-right: auto;
  margin-left: auto;
`
const SearchForm = styled.form`
  width: 100%;
  display: flex;
  font-size: 2rem;
  margin-bottom: 2rem;
`
const Search = styled.input`
  flex-grow: 1;
  font-size: inherit;
  border-radius: 0;
  outline: 0;
  padding: 0 .75rem;
  border: 2px solid #b7b7b7;
  border-right: 0;
`
const SearchButton = styled.button`
  width: 7rem;
  font-size: inherit;
  background-color: #272727;
  outline: 0;
  border: 0;
  padding: 0.5rem;
  color: white;
`
const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
`
const Nothing = styled.div`
  font-size: 1.5rem;
  margin-top: 1.5rem;
`