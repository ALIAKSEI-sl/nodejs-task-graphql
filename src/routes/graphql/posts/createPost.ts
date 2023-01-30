import { GraphQLString, GraphQLInputObjectType } from 'graphql';

export const createPost = new GraphQLInputObjectType({
  name: 'CreatePost',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLString },
  })
});