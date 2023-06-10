import { FastifyInstance } from 'fastify';
import { GraphQLString } from 'graphql';
import { typeOfUser } from './typeOfUser';
import { updateUser } from './updateUser';

export const updateUserConfig = {
  type: typeOfUser,
  args: {
    user: { type: updateUser },
    userId: { type: GraphQLString }
  },
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    const user = await fastify.db.users.findOne({key: 'id', equals: args.userId});
    if (user === null) throw fastify.httpErrors.notFound('User not found');

    const changeUser = await fastify.db.users.change(args.userId, args.user);
    return changeUser;
  }
};