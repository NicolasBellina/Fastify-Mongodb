import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Construction de l'URI de connexion MongoDB
const MONGODB_URI = `mongodb+srv://Nicolas:Gordon72@cluster0.adg0q.mongodb.net/nicolasbellina72`;

console.log('Configuration de la base de données MongoDB:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

const connectDB = async () => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        await mongoose.connect(MONGODB_URI, options);
        console.log('✅ Connexion à MongoDB réussie.');
    } catch (err) {
        console.error('❌ Erreur de connexion MongoDB:', err);
        process.exit(1);
    }
};

export default connectDB;