import { FastifyInstance } from "fastify";
import { updatePost } from './updatePost';
import { typeOfPost } from "./typeOfPost";
import { GraphQLString } from 'graphql';

export const updatePostConfig = {
  type: typeOfPost,
  args: {
    postId: { type: GraphQLString },
    post: { type: updatePost }
  },
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    const user = await fastify.db.users.findOne({key: 'id', equals: args.postId});
    if (user === null) throw fastify.httpErrors.badRequest('User not found');

    const editedPost = await fastify.db.posts.change(args.postId, args.post);
    return editedPost;
  }
};