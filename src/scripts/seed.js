import mongoose from 'mongoose';
import Contact from '../models/contactModel.js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = `mongodb+srv://Nicolas:Gordon72@cluster0.adg0q.mongodb.net/nicolasbellina72`;

const seedDatabase = async () => {
    try {
        // Lire le fichier contacts.json
        const contactsFile = await readFile(
            path.join(__dirname, '../../contacts.json'),
            'utf-8'
        );
        const newContacts = JSON.parse(contactsFile);

        // Connexion à MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connexion à MongoDB réussie.');

        // Récupérer les contacts existants
        const existingContacts = await Contact.find();
        
        // Fusionner les contacts existants avec les nouveaux contacts
        const mergedContacts = [...existingContacts];
        
        // Ajouter uniquement les nouveaux contacts qui n'existent pas déjà
        for (const newContact of newContacts) {
            const exists = existingContacts.some(
                existing => 
                    existing.email === newContact.email || 
                    (existing.nom === newContact.nom && existing.telephone === newContact.telephone)
            );
            
            if (!exists) {
                mergedContacts.push(newContact);
            }
        }

        // Supprimer tous les contacts
        await Contact.deleteMany({});
        console.log('🗑️ Anciennes données supprimées.');

        // Insérer les contacts fusionnés
        const createdContacts = await Contact.insertMany(mergedContacts);
        console.log('📝 Données fusionnées insérées:', createdContacts);

        console.log('✨ Seeding terminé avec succès!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors du seeding:', error);
        process.exit(1);
    }
};

seedDatabase(); 