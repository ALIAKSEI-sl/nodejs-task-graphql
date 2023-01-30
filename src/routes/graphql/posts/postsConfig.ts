import { GraphQLString, GraphQLList } from "graphql";
import { FastifyInstance } from "fastify";
import { typeOfPost } from "./typeOfPost";

export const postConfig = {
  type: typeOfPost,
  args: {
    id: { type: GraphQLString }
  },
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    const post = await fastify.db.posts.findOne({ key: 'id', equals: args.id });
    if (post === null) throw fastify.httpErrors.notFound('Post not found');
    return post;
  }
};

export const postsConfig = {
  type: new GraphQLList(typeOfPost),
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    const posts = await fastify.db.posts.findMany();
    return posts;
  }
};