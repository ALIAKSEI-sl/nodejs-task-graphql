import { FastifyInstance } from "fastify";
import { createPost } from './createPost';
import { typeOfPost } from "./typeOfPost";

export const createPostConfig = {
  type: typeOfPost,
  args: {
    post: { type: createPost }
  },
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    const user = await fastify.db.users.findOne({key: 'id', equals: args.post.userId});
    if (user === null) throw fastify.httpErrors.badRequest('User not found');

    const post = await fastify.db.posts.create(args.post);
    return post;
  }
};