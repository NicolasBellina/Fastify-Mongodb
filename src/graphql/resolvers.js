import Contact from '../models/contactModel.js';

export const resolvers = {
    Query: {
        contacts: async () => {
            try {
                return await Contact.find();
            } catch (error) {
                throw new Error(`Erreur lors de la récupération des contacts: ${error}`);
            }
        },
        contact: async (_, { id }) => {
            try {
                return await Contact.findById(id);
            } catch (error) {
                throw new Error(`Erreur lors de la récupération du contact: ${error}`);
            }
        }
    },

    Mutation: {
        createContact: async (_, { input }) => {
            try {
                const contact = new Contact(input);
                return await contact.save();
            } catch (error) {
                throw new Error(`Erreur lors de la création du contact: ${error}`);
            }
        },
        updateContact: async (_, { id, input }) => {
            try {
                return await Contact.findByIdAndUpdate(
                    id,
                    input,
                    { new: true, runValidators: true }
                );
            } catch (error) {
                throw new Error(`Erreur lors de la mise à jour du contact: ${error}`);
            }
        },
        deleteContact: async (_, { id }) => {
            try {
                await Contact.findByIdAndDelete(id);
                return true;
            } catch (error) {
                throw new Error(`Erreur lors de la suppression du contact: ${error}`);
                return false;
            }
        }
    }
}; 