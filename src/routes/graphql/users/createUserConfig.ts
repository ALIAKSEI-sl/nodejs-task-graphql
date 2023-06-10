import { FastifyInstance } from "fastify";
import { createUser } from './createUser';
import { typeOfUser } from './typeOfUser';

export const createUserConfig = {
  type: typeOfUser,
  args: {
    user: { type: createUser }
  },
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    const user = await fastify.db.users.create(args.user);
    return user;
  }
};