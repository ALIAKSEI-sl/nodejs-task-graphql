import { GraphQLInputObjectType, GraphQLInt } from 'graphql';

export const updateMemberType = new GraphQLInputObjectType({
  name: 'UpdateMemberType',
  fields: () => ({
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  })
});