class SessionStore {
    findSession(id: any) {}
    saveSession(id: any, session: any) {}
    findAllSessions() {}
  }
  
export default class InMemorySessionStore extends SessionStore {
  sessions: any;

  constructor() {
    super();
    this.sessions = new Map();
  }

  findSession(id: any) {
    return this.sessions.get(id);
  }

  saveSession(id: any, session: any) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}