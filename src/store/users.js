import {makeAutoObservable} from "mobx";

class UsersStore {

  users = [];
  currentUser = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  loadCurrentUser(token) {
    fetch(`http://127.0.0.1:5000/auth/currentuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'accessToken': token})
    }).then(r => r.json())
      .then(json => {
            this.currentUser = json;
          }
      )
  }

  loadUser(id) {
    fetch(`http://127.0.0.1:5000/users/${id}`)
        .then(r => r.json())
        .then(json => {
              this.users = [...this.users, json];
            }
        )
  }
}

export default new UsersStore();