import { GraphQLString, GraphQLList, GraphQLNonNull } from 'graphql';
import { FastifyInstance } from "fastify";
import { typeOfMemberType } from './typeOfMemberType';

export const memberTypeConfig = {
  type: typeOfMemberType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: args.id });
    if (memberType === null) throw fastify.httpErrors.notFound('Member type not found');
    return memberType;
  }
};

export const memberTypesConfig = {
  type: new GraphQLList(typeOfMemberType),
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    const memberTypes = await fastify.db.memberTypes.findMany();
    return memberTypes;
  }
};