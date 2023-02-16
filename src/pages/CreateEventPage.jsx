import styled from 'styled-components'
import {json, redirect, useNavigate} from "react-router-dom";
import {useRef} from "react";
import {useYMaps} from "@pbe/react-yandex-maps";
import EventsStore from '../store/events'
import UsersStore from '../store/users'
import {getAccessToken} from "../utils";

const createEventPage = (data) => {
  fetch('http://127.0.0.1:5000/events/create', {
    method: 'POST',
    body: data,
  }).then(r => r.json()).then(json => {
    EventsStore.cuOrganizedInds.push(json['event'].id)
    EventsStore.events.push(json['event']);
  });
}

export const CreateEventPage = () => {
  const formRef = useRef(null);
  const ymap = useYMaps(['geocode']);
  const navigate = useNavigate();

  const handleSubmit = e => {
      e.preventDefault();
      const formData = new FormData(formRef.current);
      ymap.ready(() => {
          ymap.geocode(formData.get('address').toString()).then(
              (res) => {
                const coords = res.geoObjects.get(0).geometry.getCoordinates();
                formData.append('accessToken', getAccessToken());
                formData.append('coord_x', coords[0])
                formData.append('coord_y', coords[1])
                createEventPage(formData);
                navigate('/user/' + UsersStore.currentUser.id)
              }
          );
      });

  }
  return (
      <Container>
        <H2>Создание мероприятия</H2>
        <form ref={formRef}>
          <Group>
            <Label>Название</Label>
            <Input name='name'/>
          </Group>
          <Group>
            <Label>Адрес</Label>
            <Input name='address'/>
          </Group>
          <GroupHorizontal>
            <Horizontal>
              <Label>Дата начала</Label>
              <Input name='date_start' type='datetime-local'/>
            </Horizontal>
            <Horizontal>
              <Label>Дата окончания</Label>
              <Input name='date_end' type='datetime-local'/>
            </Horizontal>
          </GroupHorizontal>
          <Group>
            <Label>Описание</Label>
            <TextArea name='description'/>
          </Group>
          <Group>
            <Label>Изображение</Label>
            <File type='file' name='file'/>
          </Group>
          <Button type='submit' onClick={handleSubmit}>Создать</Button>
        </form>
      </Container>
  )
}

const Container = styled.div`
  padding: 1rem 0;
  width: 50%;
  margin-right: auto;
  margin-left: auto;
`
const H2 = styled.h2`
  font-size: 2.5rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 2.5rem;
`
const Input = styled.input`
  font-size: 1.5rem;
  display: block;
  width: 100%;
  height: 2.5rem;
  outline: none;
  padding: .5rem .5rem;
`
const Label = styled.label`
  font-size: 1.5rem;
`
const TextArea = styled.textarea`
  font-size: 1.5rem;
  display: block;
  resize: none;
  width: 100%;
  height: 8rem;
  outline: none;
  padding: .5rem .5rem;
`
const Group = styled.div`
  width: 75%;
  margin-left: auto;
  margin-right: auto;
  :not(:last-child) {
    margin-bottom: 1.5rem;
  }
`
const GroupHorizontal = styled(Group)`
  display: flex;
  justify-content: space-between;
`
const Horizontal = styled.div`
  width: 45%;
`
const File = styled.input`
  border: 0;
  display: block;
  font-size: 1.1rem;
  margin-top: 0.5rem;
`
const Button = styled.button`
  border: none;
  background-color: #272727;
  color: white;
  margin-right: auto;
  margin-left: auto;
  height: 3rem;
  width: 14rem;
  font-size: 1.5rem;
  border-radius: 3px;
  display: block;

  :hover {
    background-color: black;
  }
`