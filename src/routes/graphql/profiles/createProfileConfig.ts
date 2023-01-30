import { FastifyInstance } from 'fastify';
import { typeOfProfile } from './typeOfProfile';
import { createProfile } from './createProfile';

export const createProfileConfig = {
  type: typeOfProfile,
  args: {
    profile: { type: createProfile }
  },
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    const user = await fastify.db.users.findOne({key: 'id', equals: args.profile.userId });
    if (user === null) throw fastify.httpErrors.badRequest('User not found');

    const userProfile = await fastify.db.profiles.findOne({key: 'userId', equals: args.profile.userId });
    if (userProfile !== null) throw fastify.httpErrors.badRequest('Profile already exists');

    const memberType = await fastify.db.memberTypes.findOne({key: 'id', equals: args.profile.memberTypeId});
    if (memberType === null) throw fastify.httpErrors.badRequest('Member type not found');

    const profile = await fastify.db.profiles.create(args.profile);
    return profile;
  }
};