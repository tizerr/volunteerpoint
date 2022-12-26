import {makeAutoObservable} from "mobx";

export class UsersStore {

  users = []

  constructor() {
      makeAutoObservable(this);
  }

  loadUser(id) {
      fetch(`127.0.0.1:5000/users/${id}`)
          .then(r => r.json())
          .then(json => {
            this.users = [...this.users, json]
          }
      )

  }
}
