import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  signOut, onAuthStateChanged, User 
} from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, getDoc, updateDoc, 
  collection, addDoc, onSnapshot, query, orderBy 
} from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private app = initializeApp(environment.firebase);
  public auth = getAuth(this.app);
  public db = getFirestore(this.app);
  public currentUser$ = new BehaviorSubject<any>(null);

  constructor() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const profile = await this.getUserProfile(user.uid);
        this.currentUser$.next({ uid: user.uid, email: user.email, ...profile });
      } else {
        this.currentUser$.next(null);
      }
    });
  }

  // registro
  async register(email: string, pass: string, name: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, pass);
    await setDoc(doc(this.db, 'users', cred.user.uid), {
      name,
      bio: 'Disponible en Envíos Paloma',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      status: 'En línea'
    });
    return cred;
  }

  // inicio de sesion
  login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  // cerrar sesion
  logout() {
    return signOut(this.auth);
  }

  // editar perfil
  async getUserProfile(uid: string) {
    const snap = await getDoc(doc(this.db, 'users', uid));
    return snap.exists() ? snap.data() : {};
  }

  async updateUserProfile(uid: string, data: { name: string; bio: string; avatar: string; status: string }) {
    await updateDoc(doc(this.db, 'users', uid), data);
    const current = this.currentUser$.value;
    this.currentUser$.next({ ...current, ...data });
  }

  // sala de chat
  createRoom(name: string, description: string, createdBy: string) {
    return addDoc(collection(this.db, 'rooms'), {
      name,
      description,
      createdBy,
      createdAt: new Date().toISOString()
    });
  }

  // salas en tiempo real
  listenRooms(callback: (rooms: any[]) => void) {
    const q = query(collection(this.db, 'rooms'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const rooms = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(rooms);
    });
  }

  // chat privado
  listenUsers(callback: (users: any[]) => void) {
    return onSnapshot(collection(this.db, 'users'), (snapshot) => {
      const users = snapshot.docs.map(d => ({ uid: d.id, ...d.data() }));
      callback(users);
    });
  }
}