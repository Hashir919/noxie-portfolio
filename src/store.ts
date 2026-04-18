import { create } from 'zustand';
import { supabase } from './lib/supabase';

// Helper for initial dummy data so app doesn't break if Supabase isn't connected
const DEFAULT_GLOBAL_SETTINGS = {
  site_title: 'NOXIE DIGITAL ART',
  meta_description: 'Digital Artist Portfolio',
  accent_color: '#9a8cff',
  bg_color: '#0f0e13',
  text_main_color: '#f4f4f5',
  text_dim_color: '#a1a1aa',
  font_family: 'Inter',
  nav_links: [
    { name: 'Home', href: '/', enabled: true },
    { name: 'Portfolio', href: '/portfolio', enabled: true },
    { name: 'About', href: '/about', enabled: true },
    { name: 'Contact', href: '/contact', enabled: true }
  ]
};

const DEFAULT_HOMEPAGE = {
  heading: 'THE\nNOXIE\nWORLD',
  subtext: 'Transform Your Space with Soft Digital Art.\nDigital art is redefining the way we experience emotion and character.',
  bottom_text: 'Exploring the quiet moments of life through celestial light and softness.',
  hero_image: '',
  side_image: '',
  crystal_image: '',
  button_text: 'READ PROFILE',
  button_link: '/about'
};

const DEFAULT_ABOUT = {
  heading: 'CREATING\nSOFT REALITY',
  bio_text: 'Based in Tokyo, specializing in digital illustration that focuses on the interplay between light and emotion. Every piece is a story told in silence.',
  profile_image: '',
  experience: '5+ YEARS',
  clients: '50+ WORLDWIDE'
};

interface AppState {
  globalSettings: any;
  homepage: any;
  about: any;
  portfolio: any[];
  categories: any[];
  authSession: any;
  loading: boolean;
  
  fetchData: () => Promise<void>;
  updateGlobalSettings: (data: any) => Promise<void>;
  updateHomepage: (data: any) => Promise<void>;
  updateAbout: (data: any) => Promise<void>;
  fetchAuthSession: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  globalSettings: DEFAULT_GLOBAL_SETTINGS,
  homepage: DEFAULT_HOMEPAGE,
  about: DEFAULT_ABOUT,
  portfolio: [],
  categories: [],
  authSession: null,
  loading: true,

  fetchAuthSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({ authSession: session });
    
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ authSession: session });
    });
  },

  fetchData: async () => {
    set({ loading: true });
    
    try {
      if ((supabase as any).isPlaceholder) {
         set({ loading: false });
         return; // Using default data if no url setup
      }

      // Fetch global settings
      const { data: globalSettings } = await supabase.from('global_settings').select('*').single();
      // Fetch homepage
      const { data: homepage } = await supabase.from('homepage_content').select('*').single();
      // Fetch about
      const { data: about } = await supabase.from('about_content').select('*').single();
      // Fetch portfolio
      const { data: portfolio } = await supabase.from('portfolio_works').select('*').order('display_order', { ascending: true });
      // Fetch categories
      const { data: categories } = await supabase.from('categories').select('*');

      set({ 
        globalSettings: globalSettings || get().globalSettings,
        homepage: homepage || get().homepage,
        about: about || get().about,
        portfolio: portfolio || [],
        categories: categories || [],
        loading: false
      });

    } catch (e) {
      console.error('Error fetching data', e);
      set({ loading: false });
    }
  },

  updateGlobalSettings: async (data) => {
    try {
      const { error } = await supabase.from('global_settings').update(data).eq('id', 1);
      if (error) throw error;
      set({ globalSettings: { ...get().globalSettings, ...data } });
    } catch (e) {
      console.error('Error updating settings', e);
      throw e;
    }
  },

  updateHomepage: async (data) => {
    try {
      const { error } = await supabase.from('homepage_content').update(data).eq('id', 1);
      if (error) throw error;
      set({ homepage: { ...get().homepage, ...data } });
    } catch (e) {
      console.error('Error updating homepage', e);
      throw e;
    }
  },

  updateAbout: async (data) => {
    try {
      const { error } = await supabase.from('about_content').update(data).eq('id', 1);
      if (error) throw error;
      set({ about: { ...get().about, ...data } });
    } catch (e) {
      console.error('Error updating about', e);
      throw e;
    }
  }

}));
