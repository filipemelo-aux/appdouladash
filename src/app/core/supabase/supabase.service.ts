import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  public readonly supabase: SupabaseClient;
  public readonly supabaseUrl = environment.supabaseUrl;
  public readonly supabaseKey = environment.supabaseKey;

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }
}
