import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY 

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Conexión a la base de datos exitosa');

export default supabase;