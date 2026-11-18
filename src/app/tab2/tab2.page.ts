import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, 
  IonButton, IonAvatar, IonSelect, IonSelectOption, NavController, ToastController 
} from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { FirebaseService } from '../services/firebase';
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonItem, IonInput, IonButton, IonAvatar, IonSelect, IonSelectOption
  ]
})
export class Tab2Page implements OnInit {
  user: any = { name: '', bio: '', avatar: '', status: 'En línea' };

  constructor(
    private fb: FirebaseService, private sb: SupabaseService, 
    private nav: NavController, private toast: ToastController
  ) {}

  ngOnInit() {
    this.fb.currentUser$.subscribe(u => { if (u) this.user = { ...u }; });
  }

  async changeAvatar() {
    const img = await Camera.getPhoto({ quality: 50, resultType: CameraResultType.Uri });
    if (img.webPath) {
      const blob = await (await fetch(img.webPath)).blob();
      this.user.avatar = await this.sb.uploadFile(blob, 'avatar.jpg');
    }
  }

  async saveProfile() {
    await this.fb.updateUserProfile(this.user.uid, {
      name: this.user.name,
      bio: this.user.bio,
      avatar: this.user.avatar,
      status: this.user.status
    });
    const t = await this.toast.create({ message: 'Perfil actualizado', duration: 2000, color: 'success' });
    t.present();
  }

  async logout() {
    await this.fb.logout();
    this.nav.navigateRoot('/login');
  }
}