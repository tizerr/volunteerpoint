import {makeAutoObservable, toJS} from "mobx";
import {useYMaps} from "@pbe/react-yandex-maps";

class UsersStore {

  users = [];
  currentUser = {};
  currentPosition = [56.751490, 37.622232];

  constructor() {
    makeAutoObservable(this);
  }

  resetCU() {
    this.currentUser = {}
  }

  addUsers(users) {
    const ids = this.users.map(x => x.id);
    for (const i of users) {
      if (!ids.includes(i.id)) {
        this.users.push(i);
      }
    }
  }

  loadCurrentPosition(ymap) {
      ymap.geolocation.get({
        provider: 'browser',
      }).then(res => {
        const coords = res.geoObjects.position
        this.currentPosition = [coords[0], coords[1]];
        // console.log(coords)
      }, err => {
        this.currentPosition = [56.751490, 37.622232];
      });
  }

  loadCurrentUser(token) {
    fetch(`http://127.0.0.1:5000/auth/currentuser`, {
      method: 'POST',
      body: JSON.stringify({'accessToken': token})
    }).then(r => r.json())
      .then(json => {
            this.currentUser = json['user'] || {};
          }
      )
  }

  loadUser(id) {
    fetch(`http://127.0.0.1:5000/user/${id}`)
        .then(r => r.json())
        .then(json => {
              this.addUsers([json])
            }
        )
  }
  loadParticipants(id) {  // event_id
    fetch(`http://127.0.0.1:5000/events/${id}/participants`)
        .then(r => r.json())
        .then(json => {
              this.addUsers(json)
            }
        )
  }
}

export default new UsersStore();