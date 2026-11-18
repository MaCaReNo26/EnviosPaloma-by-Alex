import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonInput, 
  IonButton, IonIcon, IonButtons, IonBackButton, IonCard, IonCardContent, IonAvatar 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { send, camera, attach, location, trashOutline, documentOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { SupabaseService } from '../services/supabase';
import { FirebaseService } from '../services/firebase';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonFooter, IonInput, IonButton, IonIcon, IonButtons, IonBackButton, 
    IonCard, IonCardContent, IonAvatar
  ]
})
export class ChatRoomPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  roomId = '';
  roomName = 'Sala';
  messages: any[] = [];
  newMessage = '';
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute, 
    private sb: SupabaseService, 
    private fb: FirebaseService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ send, camera, attach, location, trashOutline, documentOutline });
    this.roomId = this.route.snapshot.paramMap.get('id') || '';
    this.roomName = history.state?.roomName || 'Sala de Chat';
  }

  async ngOnInit() {
    this.fb.currentUser$.subscribe((user) => {
      if (user) this.currentUser = user;
    });

    const initial = await this.sb.getMessages(this.roomId);
    this.zone.run(() => {
      this.messages = initial;
      this.cdr.detectChanges();
      this.scrollToBottom();
    });

    this.sb.subscribeToMessages(this.roomId, (msg) => {
      this.zone.run(() => {
        if (!this.messages.some(m => m.id === msg.id)) {
          this.messages.push(msg);
          this.cdr.detectChanges();
          this.scrollToBottom();
        }
      });
    });
  }

  private pushIfNotExists(msg: any) {
    if (msg && !this.messages.some(m => m.id === msg.id)) {
      this.messages.push(msg);
      this.cdr.detectChanges();
      this.scrollToBottom();
    }
  }

  private getSender() {
    if (this.currentUser) return this.currentUser;
    const authUser = this.fb.auth.currentUser;
    return {
      uid: authUser?.uid || 'anon',
      name: authUser?.email?.split('@')[0] || 'Usuario',
      avatar: `https://ui-avatars.com/api/?name=User&background=random`
    };
  }

  scrollToBottom() {
    setTimeout(() => this.content?.scrollToBottom(300), 100);
  }

  async sendText() {
    if (!this.newMessage.trim()) return;
    const textToSend = this.newMessage;
    this.newMessage = '';
    const sender = this.getSender();
    const saved = await this.sb.sendMessage({
      room_id: this.roomId,
      user_id: sender.uid,
      user_name: sender.name,
      user_avatar: sender.avatar,
      text: textToSend,
      file_type: 'text'
    });
    this.pushIfNotExists(saved);
  }

  async sendPhoto() {
    const image = await Camera.getPhoto({
      quality: 60,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });
    if (image.webPath) {
      const sender = this.getSender();
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      const url = await this.sb.uploadFile(blob, 'photo.jpg');
      const saved = await this.sb.sendMessage({
        room_id: this.roomId,
        user_id: sender.uid,
        user_name: sender.name,
        user_avatar: sender.avatar,
        file_url: url,
        file_type: 'image'
      });
      this.pushIfNotExists(saved);
    }
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const sender = this.getSender();
    const url = await this.sb.uploadFile(file, file.name);
    const saved = await this.sb.sendMessage({
      room_id: this.roomId,
      user_id: sender.uid,
      user_name: sender.name,
      user_avatar: sender.avatar,
      text: file.name,
      file_url: url,
      file_type: 'file'
    });
    this.pushIfNotExists(saved);
  }

  async sendLocation() {
    const pos = await Geolocation.getCurrentPosition();
    const sender = this.getSender();
    const saved = await this.sb.sendMessage({
      room_id: this.roomId,
      user_id: sender.uid,
      user_name: sender.name,
      user_avatar: sender.avatar,
      text: 'Ubicación compartida',
      file_type: 'location',
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    });
    this.pushIfNotExists(saved);
  }

  async deleteMsg(id: number) {
    await this.sb.deleteMessage(id);
    this.messages = this.messages.filter(m => m.id !== id);
    this.cdr.detectChanges();
  }
}