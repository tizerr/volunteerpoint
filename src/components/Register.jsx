import styled from 'styled-components'
import {UsersStore} from "../store/users";
import {useRef} from "react";

async function registerUser(credentials) {
  return fetch('http://localhost:5000/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials)
  }).then(data => [data.json(), data.status])
}

export const Register = (props) => {
  const unameRef = useRef(null);
  const emailRef = useRef(null);
  const pwdRef = useRef(null);
  const pwd2Ref = useRef(null);

  const handleSubmit = async e => {
    e.preventDefault();
    // td: validation
    const [resp, status] = await registerUser({ username: unameRef.current.value, email: emailRef.current.value, password: pwdRef.current.value})
    console.log(resp);
    if (status === 201) {
      props.onChange()
    }
  }
  return (
      <BgPanel hidden={props.hidden}>
        <FormContainer>
          <ExitButtonContainer><ExitButton onClick={() => props.onChange()}>X</ExitButton></ExitButtonContainer>
          <Form>
            <H2>Регистрация</H2>
            <div>
              <Input ref={unameRef} placeholder='Имя пользователя'/>
              <Input ref={emailRef} placeholder='Email'/>
              <Input ref={pwdRef} placeholder='Пароль'/>
              <Input ref={pwd2Ref} placeholder='Повторите пароль'/>
            </div>
            <div>
              <SubmitButton type='submit' onClick={handleSubmit}>Создать аккаунт</SubmitButton>
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
  width: 65%;
  height: 80vh;
  border-radius: 1rem;
  max-height: 700px;
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
    margin-bottom: 1.5rem;
  }
`
const H2 = styled.h2`
  font-size: 2rem;
  font-weight: 500;
  width: 100%;
  text-align: center;
  margin-bottom: 1.5rem;
`
const SubmitButton = styled.button`
  margin: 1rem auto 1rem;
  background-color: #272727;
  display: block;
  color: white;
  padding: 1rem 5rem;
  font-size: 1.5rem;
  border-radius: 0.5rem;
`
