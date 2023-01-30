import {GraphQLID, GraphQLInt, GraphQLObjectType} from 'graphql';

export const typeOfMemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: GraphQLID },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }
});