import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, 
  IonFab, IonFabButton, IonIcon, IonSearchbar, IonButtons, IonButton, 
  IonSegment, IonSegmentButton, IonAvatar, IonBadge,
  AlertController, ActionSheetController, NavController 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, chatbubblesOutline, settingsOutline, personOutline } from 'ionicons/icons';
import { FirebaseService } from '../services/firebase';
import { ThemeService } from '../services/theme';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonSearchbar,
    IonButtons, IonButton, IonSegment, IonSegmentButton, IonAvatar, IonBadge
  ]
})
export class Tab1Page implements OnInit {
  segment: 'rooms' | 'users' = 'rooms';
  searchQuery = '';

  rooms: any[] = [];
  filteredRooms: any[] = [];

  users: any[] = [];
  filteredUsers: any[] = [];

  constructor(
    private fb: FirebaseService,
    private themeService: ThemeService,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private nav: NavController,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ add, chatbubblesOutline, settingsOutline, personOutline });
  }

  ngOnInit() {
    this.fb.listenRooms((data) => {
      this.zone.run(() => {
        this.rooms = data;
        this.applyFilter();
        this.cdr.detectChanges();
      });
    });

    this.fb.listenUsers((data) => {
      this.zone.run(() => {
        const myUid = this.fb.auth.currentUser?.uid;
        this.users = data.filter(u => u.uid !== myUid);
        this.applyFilter();
        this.cdr.detectChanges();
      });
    });
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value?.toLowerCase() || '';
    this.applyFilter();
  }

  applyFilter() {
    this.filteredRooms = this.rooms.filter(r =>
      r.name?.toLowerCase().includes(this.searchQuery)
    );
    this.filteredUsers = this.users.filter(u =>
      u.name?.toLowerCase().includes(this.searchQuery)
    );
  }

  // cambiar tema
  async openThemeSelector() {
    const current = this.themeService.getCurrentTheme();
    const buttons: any[] = this.themeService.themes.map(t => ({
      text: current === t.id ? `${t.label}  ✓` : t.label,
      handler: () => {
        this.themeService.applyTheme(t.id);
      }
    }));
    buttons.push({ text: 'Cancelar', role: 'cancel' });

    const sheet = await this.actionSheetCtrl.create({
      header: 'Personalizar Tema de Colores',
      buttons
    });
    await sheet.present();
  }

  async newRoom() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Sala Grupal',
      inputs: [
        { name: 'name', placeholder: 'Nombre de la sala' },
        { name: 'desc', placeholder: 'Descripción breve' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: (data) => {
            if (data.name) {
              const user = this.fb.currentUser$.value;
              this.fb.createRoom(data.name, data.desc || '', user?.name || 'Usuario');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  openRoom(room: any) {
    this.nav.navigateForward(`/chat-room/${room.id}`, { state: { roomName: room.name } });
  }

  // chat privado
  openDirectChat(otherUser: any) {
    const myUid = this.fb.auth.currentUser?.uid || 'anon';
    const directRoomId = 'dm_' + [myUid, otherUser.uid].sort().join('_');
    this.nav.navigateForward(`/chat-room/${directRoomId}`, {
      state: { roomName: otherUser.name }
    });
  }
}