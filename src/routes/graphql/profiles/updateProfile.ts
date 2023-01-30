import { GraphQLString, GraphQLInputObjectType, GraphQLInt } from 'graphql';

export const updateProfile = new GraphQLInputObjectType({
  name: 'UpdateProfile',
  fields: () => ({
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    userId: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
  })
});