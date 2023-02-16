import styled from 'styled-components'
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus, faGear, faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons'
import userPlaceholder from '../img/userPlaceholder.png'
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import UsersStore from "../store/users";
import EventsStore from "../store/events";
import {observer} from "mobx-react";
import {getAccessToken} from "../utils";
import {EventThumbnail} from "../components/EventThumbnail";
import {toJS} from "mobx";


export const ProfilePage = observer(() => {
  const [activeBtn, setActiveBtn] = useState(0);
  const {id} = useParams();
  let cu = UsersStore.currentUser;
  if (cu.id !== Number(id)) {
    cu = UsersStore.users.find(v => v.id === Number(id));
  }
  const author = cu === UsersStore.currentUser;
  const navigate = useNavigate();

  function logout() {
    UsersStore.resetCU();
    EventsStore.resetCU();
    localStorage.removeItem('accessToken');
    navigate('/');
  }

  function edit() {
    navigate('/edit_profile');
  }

  function parseAge(age) {
    const num = age.toString();

    if (['2', '3', '4'].includes(num[num.length - 1]) && num[num.length - 2] !== '1')
      return age + ' года';
    else if (num[num.length - 1] === '1' && num[num.length - 2] !== '1')
      return age + ' год';
    else
      return age + ' лет';
  }

  useEffect(() => {
    EventsStore.loadCUOrganizedEvents(getAccessToken());
    EventsStore.loadCUParticipatedEvents(getAccessToken());
  }, [])

  const organizedEvents = EventsStore.events.filter((v) => EventsStore.cuOrganizedInds.includes(v.id));
  const participatedEvents = EventsStore.events.filter((v) => EventsStore.cuParticipatedInds.includes(v.id));

  return (
      <Container>
        <Row>
          <Avatar src={cu?.img_path ? ('http://127.0.0.1:5000/' + cu.img_path) : userPlaceholder} alt='avatar'/>
          <Info>
            <Name>{cu?.username}</Name>
            <CityAge>{`${cu?.address || 'Адрес не указан'}, ${cu?.age ? parseAge(cu.age) : 'возраст не указан'}`}</CityAge>
            <DateCreated>Дата создания аккаунта: {cu?.date_created}</DateCreated>
          </Info>
          {!author || (
              <ButtonGroup>
                <SettingsButton onClick={edit}><FontAwesomeIcon icon={faGear}/></SettingsButton>
                <ExitButton onClick={logout}><FontAwesomeIcon icon={faArrowRightFromBracket}/></ExitButton>
              </ButtonGroup>
          )}
        </Row>
        <About>
          {cu?.description || 'Нет описания'}
        </About>
        {!author || <>
          <Switch>
            <SwitchBtn active={activeBtn === 0} onClick={() => {
              setActiveBtn(0)
            }}>Посещаемые события</SwitchBtn>
            <SwitchBtn active={activeBtn === 1} onClick={() => {
              setActiveBtn(1)
            }}>Организуемые события</SwitchBtn>
          </Switch>
          {
            activeBtn === 0 ? (
                <Offset>{participatedEvents.map(e => <EventThumbnail key={e.id} event={e}/>)}</Offset>
            ) : (
                <>
                  <CustomLink to={'/create_event'}>Создать <FontAwesomeIcon icon={faPlus}/></CustomLink>
                  <>{organizedEvents.map(e => <EventThumbnail key={e.id} event={e} show_status={true}/>)}</>
                </>
            )
          }
        </>
        }
      </Container>
  )
});

const Container = styled.div`
  padding: 3rem 0;
  width: 50%;
  margin-right: auto;
  margin-left: auto;
`

const Avatar = styled.img`
  width: 10rem;
  height: fit-content;
  margin-right: 3rem;
`

const Info = styled.h2`
  width: 85%;
`

const Name = styled.div`
  font-size: 2.5rem;
  font-weight: 600;
`

const CityAge = styled.div`
  font-size: 1.65rem;
  font-weight: 400;
  color: #555;
`

const Row = styled.div`
  display: flex;
`

const About = styled.div`
  margin-top: 2rem;
  font-size: 1.35rem;
  word-break: break-word;
`

const CustomLink = styled(Link)`
  font-size: 1.3rem;
  text-decoration: none;
  color: #000;
  margin-left: auto;
  display: block;
  width: fit-content;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  transition: color 0.1s ease-in;

  :hover {
    color: gray;
  }
`

const Switch = styled.div`
  background-color: #f5f5f5;
  margin-top: 3rem;
  display: flex;
  justify-content: space-between;
`
const SwitchBtn = styled.div`
  font-size: 1.5rem;
  width: 50%;
  text-align: center;
  height: 100%;
  padding: 1rem 1rem;
  background: ${props => props.active ? '#d1d1d1' : 'inherit'};
  transition: background-color 0.1s ease-in;
`
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  align-items: end;
`

const SettingsButton = styled.button`
  height: 2.5rem;
  width: 2.5rem;
  margin: 1rem 0;
  border: 0;
  outline: 0;
  background-color: #D1D1D1FF;
  border-radius: 0.25rem;
  font-size: 1.25rem;
  color: white;
  transition: background-color 0.2s ease-in;

  :hover {
    background-color: #a6a6a6;
  }
`
const ExitButton = styled(SettingsButton)`
  margin: 0 0 1rem;
`
const Offset = styled.div`
  padding-top: 2rem;
`
const DateCreated = styled.div`
  font-size: 1.5rem;
  font-weight: 400;
  margin-top: .5rem;
`