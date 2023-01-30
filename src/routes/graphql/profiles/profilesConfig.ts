import { GraphQLString, GraphQLList } from "graphql";
import { FastifyInstance } from "fastify";
import { typeOfProfile } from "./typeOfProfile";

export const profileConfig = {
  type: typeOfProfile,
  args: {
    id: { type: GraphQLString }
  },
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    const profile = await fastify.db.profiles.findOne({ key: 'id', equals: args.id });
    if (profile === null) throw fastify.httpErrors.notFound('Profile not found');
    return profile;
  }
};

export const profilesConfig = {
  type: new GraphQLList(typeOfProfile),
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    const profiles = await fastify.db.profiles.findMany();
    return profiles;
  }
};