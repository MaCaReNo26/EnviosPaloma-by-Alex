import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonInput, IonButton, NavController, ToastController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonItem, IonInput, IonButton]
})
export class LoginPage {
  isRegister = false;
  name = '';
  email = '';
  password = '';

  constructor(private fb: FirebaseService, private nav: NavController, private toast: ToastController) {}

  async submit() {
    try {
      if (this.isRegister) {
        await this.fb.register(this.email, this.password, this.name);
      } else {
        await this.fb.login(this.email, this.password);
      }
      this.nav.navigateRoot('/tabs/tab1');
    } catch (e: any) {
      const t = await this.toast.create({ message: 'Error: ' + e.message, duration: 2500, color: 'danger' });
      t.present();
    }
  }
}