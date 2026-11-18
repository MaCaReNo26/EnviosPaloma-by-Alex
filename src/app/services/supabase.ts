import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.key);
  }

  // historial de mensajes
  async getMessages(roomId: string) {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });
    return data || [];
  }

  // mensajes en tiempo real
  subscribeToMessages(roomId: string, callback: (msg: any) => void) {
    return this.supabase
      .channel(`room-${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        callback(payload.new);
      })
      .subscribe();
  }

  // enviar mensaje - texto, imagen o documento
  async sendMessage(messageData: any) {
    const { data, error } = await this.supabase
      .from('messages')
      .insert([messageData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // eliminar mensaje 
  async deleteMessage(messageId: number) {
    await this.supabase.from('messages').delete().eq('id', messageId);
  }

  // subir imagen o documento
  async uploadFile(file: Blob | File, fileName: string): Promise<string> {
    const path = `${Date.now()}_${fileName}`;
    const { error } = await this.supabase.storage
      .from('chat-files')
      .upload(path, file);
    if (error) throw error;

    const { data } = this.supabase.storage.from('chat-files').getPublicUrl(path);
    return data.publicUrl;
  }
}