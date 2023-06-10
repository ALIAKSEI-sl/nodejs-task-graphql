import { GraphQLList, GraphQLString} from "graphql";
import { FastifyInstance } from "fastify";
import { typeOfUser } from "./typeOfUser";

export const userConfig = {
  type: typeOfUser,
  args: {
    id: { type: GraphQLString }
  },
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    const user = await fastify.db.users.findOne({ key: 'id', equals: args.id });
    if (user === null) throw fastify.httpErrors.notFound('User not found');
    return user;
  }
};

export const usersConfig = {
  type: new GraphQLList(typeOfUser),
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    const users = await fastify.db.users.findMany();
    return users;
  }
};