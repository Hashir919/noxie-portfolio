import { supabase } from './supabase';

export async function uploadImage(file: File): Promise<string | null> {
  if ((supabase as any).isPlaceholder) {
     console.warn("Supabase not connected. Emulating upload.");
     return URL.createObjectURL(file); // emulate for local
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}
