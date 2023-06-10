import { GraphQLString, GraphQLInputObjectType, GraphQLNonNull } from 'graphql';

export const createUser = new GraphQLInputObjectType({
  name: 'CreateUser',
  fields: () => ({
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  })
});