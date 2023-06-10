import { GraphQLString, GraphQLInputObjectType, GraphQLNonNull } from 'graphql';

export const updateUser = new GraphQLInputObjectType({
  name: 'UpdateUser',
  fields: () => ({
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  })
});