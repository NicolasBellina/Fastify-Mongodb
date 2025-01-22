import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    email: String,
    telephone: String,
    adresse: String,
    });

export default mongoose.model('Contact', contactSchema);