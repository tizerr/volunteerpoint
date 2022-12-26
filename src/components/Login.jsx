import styled from 'styled-components'
import {UsersStore} from "../store/users";
import {useRef, useState} from "react";

async function login(credentials) {
  return fetch('127.0.0.1:5000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }).then(data => data.json())
}

export const Login = (props) => {
  const unameRef = useRef(null);
  const pwdRef = useRef(null);

  const handleSubmit = async e => {
      e.preventDefault();
      const resp = await login({ username: unameRef.current.value, password: pwdRef.current.value})
      if ('accessToken' in resp) {
        localStorage.setItem('accessToken', resp['accessToken']);
        window.location.href = "/";
      }
  }
  return (
      <BgPanel hidden={props.hidden}>
        <FormContainer>
          <ExitButtonContainer><ExitButton onClick={() => props.onChange()}>X</ExitButton></ExitButtonContainer>
          <Form>
            <div>
              <H2>Авторизация</H2>
              <Input ref={unameRef} placeholder='Имя пользователя'/>
              <Input ref={pwdRef} placeholder='Пароль'/>
              <CheckboxContainer><Checkbox type="checkbox"/><label>Остаться в системе</label></CheckboxContainer>
            </div>
            <div>
              <SubmitButton type='submit' onClick={handleSubmit}>Войти в аккаунт</SubmitButton>
              <RegisterButton type='button' onClick={() => {props.onChange(true); }}>Ещё нет аккаунта? Перейти к созданию</RegisterButton>
            </div>
          </Form>
        </FormContainer>
      </BgPanel>
  )
}

const BgPanel = styled.div`
  background-color: rgba(0, 0, 0, .5);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: ${props => props.hidden ? 'none' : 'flex'};
`

const FormContainer = styled.div`
  background-color: white;
  z-index: 3;
  width: 60%;
  height: 70%;
  border-radius: 1rem;
`

const ExitButton = styled.button`
  font-size: 1.5rem;
  border: 0;
  outline: 0;
  background-color: transparent;
  margin: 0.5rem 1rem 0;
  :hover {
    color: grey;
  }
`
const ExitButtonContainer = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
  height: 5%;
`
const Form = styled.form`
  padding: 0 3rem 3rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 95%;
`
const Input = styled.input`
  display: block;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  height: 4rem;
  font-size: 1.5rem;
  outline: 0;
  padding: 0.3rem 0.5rem;
  border-radius: 0.3rem;
  border: 0.1rem solid black;
  :not(:last-child) {
    margin-bottom: 2.5rem;
  }
`
const H2 = styled.h2`
  font-size: 3rem;
  font-weight: 500;
  width: 100%;
  text-align: center;
  margin-bottom: 1.5rem;
`

const CheckboxContainer = styled.div`
  font-size: 1.5rem;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
`
const Checkbox = styled.input`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.75rem;
`
const SubmitButton = styled.button`
  margin: 2rem auto 2rem;
  background-color: #272727;
  display: block;
  color: white;
  padding: 1rem 5rem;
  font-size: 1.5rem;
  border-radius: 0.5rem;
`

const RegisterButton = styled.button`
  background-color: transparent;
  margin-left: auto;
  margin-right: auto;
  display: block;
  color: #272727;
  font-size: 1.2rem;
  outline: 0;
  border: 0;
  text-decoration: underline;
  cursor: pointer;
  :hover {
    color: gray;
  }
`