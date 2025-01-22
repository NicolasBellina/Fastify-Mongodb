export const schema = `
  type Contact {
    id: ID!
    nom: String!
    email: String
    telephone: String
    adresse: String
  }

  type Query {
    contact(id: ID!): Contact
    contacts: [Contact!]!
  }

  type Mutation {
    createContact(input: ContactInput!): Contact!
    updateContact(id: ID!, input: ContactInput!): Contact!
    deleteContact(id: ID!): Boolean!
  }

  input ContactInput {
    nom: String!
    email: String
    telephone: String
    adresse: String
  }
`; 