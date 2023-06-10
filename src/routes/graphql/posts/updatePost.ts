import { GraphQLString, GraphQLInputObjectType } from 'graphql';

export const updatePost = new GraphQLInputObjectType({
  name: 'UpdatePost',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString }
  })
});