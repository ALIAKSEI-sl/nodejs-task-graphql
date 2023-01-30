import { GraphQLString } from 'graphql';
import { updateMemberType } from './updateMemberType';
import { typeOfMemberType } from './typeOfMemberType';
import { FastifyInstance } from 'fastify';

export const updateMemberTypeConfig = {
  type: typeOfMemberType,
  args: {
    memberTypeId: { type: GraphQLString },
    memberType: { type: updateMemberType }
  },
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: args.memberTypeId });
    if (memberType === null) throw fastify.httpErrors.badRequest('Member type not found');

    const editedMemberType = await fastify.db.memberTypes.change(args.memberTypeId, args.memberType);
    return editedMemberType;
  }
};