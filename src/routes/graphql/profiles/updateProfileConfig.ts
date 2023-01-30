import { FastifyInstance } from "fastify";
import { GraphQLString } from "graphql";
import { typeOfProfile } from "./typeOfProfile";
import { updateProfile } from "./updateProfile";

export const updateProfileConfig = {
  type: typeOfProfile,
  args: {
    profileId: { type: GraphQLString },
    profile: { type: updateProfile }
  },
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    const profile = await fastify.db.profiles.findOne({key: 'id', equals: args.profileId.id });
    if (profile === null) throw fastify.httpErrors.notFound('Profile not found');

    const changeProfile = await fastify.db.profiles.change(args.profileId.id, args.profile);
    return changeProfile;
  }
};