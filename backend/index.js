import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import supabase from './config/supabaseClient.js';

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

app.get('/api/preguntas', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('preguntas')
            .select('*');

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Error al obtener preguntas:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/preguntas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data: pregunta, error: preguntaError } = await supabase
            .from('preguntas')
            .select('*')
            .eq('id', id)
            .single();
            
        if (preguntaError) throw preguntaError;
        
        const { data: respuestas, error: respuestasError } = await supabase
            .from('respuestas')
            .select('*')
            .eq('pregunta_id', id)
            .order('votos', { ascending: false });
            
        if (respuestasError) throw respuestasError;
        
        res.json({
            pregunta,
            respuestas
        });
    } catch (error) {
        console.error('Error al obtener la pregunta y respuestas:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/votar', async (req, res) => {
    try {
        const { respuestaId } = req.body;
        
        if (!respuestaId) {
            return res.status(400).json({ error: 'El ID de respuesta es obligatorio' });
        }
        
        const { data: respuesta, error: checkError } = await supabase
            .from('respuestas')
            .select('votos')
            .eq('id', respuestaId)
            .single();
            
        if (checkError) {
            if (checkError.code === 'PGRST116') {
                return res.status(404).json({ error: 'Respuesta no encontrada' });
            }
            throw checkError;
        }
        
        const { data, error } = await supabase
            .from('respuestas')
            .update({ votos: respuesta.votos + 1 })
            .eq('id', respuestaId)
            .select()
            .single();
            
        if (error) throw error;
        
        res.json({ 
            message: 'Voto registrado exitosamente', 
            respuesta: data 
        });
    } catch (error) {
        console.error('Error al registrar voto:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/resultados', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('respuestas')
            .select('id, respuesta, votos')
            .order('votos', { ascending: false });
            
        if (error) throw error;
        
        res.json(data);
    } catch (error) {
        console.error('Error al obtener resultados:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});