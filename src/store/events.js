import {makeAutoObservable, toJS} from "mobx";
import {getAccessToken} from "../utils";

class EventsStore {

  events = [];
  cuOrganizedInds = [];
  cuParticipatedInds = [];
  moderationEvents = [];
  topEventsIds = []

  constructor() {
    makeAutoObservable(this);
  }

  resetCU() {
    this.cuOrganizedInds = [];
    this.cuParticipatedInds = [];
  }

  addEvents(events) {
    const ids = this.events.map(x => x.id);
    for (const i of events) {
      if (!ids.includes(i.id)) {
        this.events.push(i);
      }
    }
  }

  loadCUOrganizedEvents(token) {
    fetch(`http://127.0.0.1:5000/events/organized`, {
      method: 'POST',
      body: JSON.stringify({'accessToken': token})
    }).then(r => r.json())
        .then(json => {
          if (json.length) {
            this.addEvents(json)
            this.cuOrganizedInds.push(...json.map(e => e.id).filter(id => !this.cuOrganizedInds.includes(id)));
          }
        });
  }

  loadCUParticipatedEvents(token) {
    fetch(`http://127.0.0.1:5000/events/participated`, {
      method: 'POST',
      body: JSON.stringify({'accessToken': token})
    }).then(r => r.json())
        .then(json => {
          if (json.length) {
            this.addEvents(json)
            this.cuParticipatedInds.push(...json.map(e => e.id).filter(id => !this.cuParticipatedInds.includes(id)));
          }
        });
  }

  loadEvents(position, scale) {
    fetch(`http://127.0.0.1:5000/events`, {
      method: 'POST',
      body: JSON.stringify({position: position, scale: scale})
    }).then(r => r.json())
        .then(json => {
              this.addEvents(json);
            }
        )
  }

  loadModerationEvents() {
    fetch(`http://127.0.0.1:5000/events/moderation`, {
      method: 'POST',
      body: JSON.stringify({accessToken: getAccessToken()})
    }).then(r => r.json())
        .then(json => {
              if (!json) return;
              const ids = this.moderationEvents.map(x => x.id)
              for (const e of json) {
                if (!ids.includes(e.id))
                  this.moderationEvents.push(e);
              }
            }
        )
  }

  loadEventById(id) {
    fetch(`http://127.0.0.1:5000/events/${id}`, {
      method: 'POST',
      body: JSON.stringify({})
    }).then(r => r.json())
        .then(json => {
              this.addEvents([json]);
            }
        )
  }
  loadTopEvents() {
    fetch(`http://127.0.0.1:5000/events/top`, {
      method: 'POST',
      body: JSON.stringify({})
    }).then(r => r.json())
        .then(json => {
              this.addEvents(json);
              for (const e of json) {
                if (! this.topEventsIds.includes(e.id)) {
                  this.topEventsIds.push(e.id)
                }
              }
            }
        )
  }
}

export default new EventsStore();