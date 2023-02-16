import styled from 'styled-components'
import {useNavigate} from "react-router-dom";
import {useRef} from "react";
import UsersStore from '../store/users'
import {getAccessToken} from "../utils";
import {observer} from "mobx-react";

const editProfile = (data) => {
  fetch('http://127.0.0.1:5000/edit_profile', {
    method: 'POST',
    body: data,
  }).then(r => r.json()).then(r => {
    UsersStore.currentUser = r['user'];
  });
}

export const EditProfilePage = observer(() => {
  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    formData.append('accessToken', getAccessToken());
    editProfile(formData);
    navigate(`/user/${UsersStore.currentUser.id}`)
  }
  return (
      <Container>
        <H2>Изменить профиль</H2>
        <form ref={formRef}>
          <Group>
            <Label>Имя пользователя</Label>
            <Input name='username' defaultValue={UsersStore.currentUser?.username || ''}/>
          </Group>
          <Group>
            <Label>Адрес</Label>
            <Input name='address' defaultValue={UsersStore.currentUser?.address || ''}/>
          </Group>
          <Group>
            <Label>Возраст</Label>
            <Input name='age' defaultValue={UsersStore.currentUser?.age || ''}/>
          </Group>
          <Group>
            <Label>Описание</Label>
            <TextArea name='description' defaultValue={UsersStore.currentUser?.description || ''}/>
          </Group>
          <Group>
            <Label>Изображение</Label>
            <File type='file' name='file'/>
          </Group>
          <Button type='submit' onClick={handleSubmit}>Изменить</Button>
        </form>
      </Container>
  )
});

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
  margin-bottom: 2rem;
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
  height: 10rem;
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
const File = styled.input`
  border: 0;
  display: block;
  font-size: 1.1rem;
  margin-top: 0.5rem;
`
