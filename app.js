import Fastify from 'fastify';
import { mercurius } from 'mercurius';
import connectDB from './database.js';
import { schema } from './src/graphql/schema.js';
import { resolvers } from './src/graphql/resolvers.js';
import Contact from './src/models/contactModel.js';
import fastifyView from '@fastify/view';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration des chemins pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Création de l'instance Fastify
const fastify = Fastify({
    logger: true,
    ajv: {
        customOptions: {
            removeAdditional: false,
            useDefaults: true,
            coerceTypes: false,
            allErrors: true
        }
    }
});

// Gestion des erreurs globales
fastify.setErrorHandler(function (error, request, reply) {
    // On s'assure d'avoir un code d'erreur valide
    const statusCode = error.statusCode || 500;
    
    this.log.error(error);
    
    reply
        .code(statusCode)
        .send({
            statusCode,
            error: 'Une erreur est survenue',
            message: error.message || 'Erreur interne du serveur'
        });
});

// Fonction de démarrage de l'application
const start = async () => {
    try {
        // Connexion à MongoDB
        await connectDB();

        // Configuration du moteur de vue EJS
        await fastify.register(fastifyView, {
            engine: {
                ejs: ejs
            },
            root: path.join(__dirname, 'src', 'pages'),
            viewExt: 'ejs'
        });

        // Configuration CORS
        await fastify.register(import('@fastify/cors'), {
            origin: true,
            methods: ['POST', 'GET', 'OPTIONS']
        });

        // Configuration de GraphQL
        await fastify.register(mercurius, {
            schema,
            resolvers,
            graphiql: true,
            path: '/graphql',
            context: (request, reply) => {
                return {
                    request,
                    reply
                };
            },
            errorHandler: (error, request, reply) => {
                // Gestion spécifique des erreurs GraphQL
                const statusCode = error.errors?.[0]?.extensions?.code || 500;
                const message = error.errors?.[0]?.message || 'Erreur GraphQL';
                
                reply
                    .code(statusCode)
                    .send({
                        statusCode,
                        error: 'Erreur GraphQL',
                        message
                    });
            }
        });

        // Route pour la page d'accueil
        fastify.get('/', async (request, reply) => {
            try {
                // Récupérer tous les contacts
                const contacts = await Contact.find();
                
                return reply.view('home.ejs', {
                    title: 'Accueil - Fastify/MongoDB',
                    contacts: contacts,
                    isAdmin: false
                });
            } catch (error) {
                fastify.log.error(error);
                return reply.view('home.ejs', {
                    title: 'Accueil - Fastify/MongoDB',
                    contacts: [],
                    error: 'Erreur lors de la récupération des contacts',
                    isAdmin: false
                });
            }
        });

        // Démarrage du serveur
        try {
            await fastify.listen({ 
                port: process.env.PORT || 8080, 
                host: '0.0.0.0' 
            });
            console.log(`Serveur démarré sur http://localhost:${process.env.PORT || 8080}`);
            console.log(`Interface GraphQL disponible sur http://localhost:${process.env.PORT || 8080}/graphql`);
        } catch (err) {
            fastify.log.error(err);
            process.exit(1);
        }

    } catch (err) {
        fastify.log.error('Erreur au démarrage du serveur:', err);
        process.exit(1);
    }
};

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
    console.error('Erreur non gérée:', err);
    process.exit(1);
});

start();


