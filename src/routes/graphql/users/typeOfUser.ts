import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { typeOfPost } from "../posts/typeOfPost";
import { typeOfProfile } from "../profiles/typeOfProfile";
import { typeOfMemberType } from "../member-types/typeOfMemberType";

export const typeOfUser = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLInt) },
    posts: {
      type: new GraphQLList(typeOfPost),
      resolve: async (param: any, args: any, fastify: any) => {
        const posts = await fastify.db.posts.findMany({ key: 'userId', equals: param.id });
        return posts;
      }
    },
    profile: {
      type: typeOfProfile,
      resolve: async (param: any, args: any, fastify: any) => {
        const profile = await fastify.db.profiles.findOne({ key: 'userId', equals: param.id })
        return await profile;
      }
    },
    memberType: {
      type: typeOfMemberType,
      resolve: async (param: any, args: any, fastify: any) => {
        const profile = await fastify.db.profiles.findOne({ key: 'userId', equals: param.id });
        if (profile === null) throw fastify.httpErrors.notFound();
        const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: profile.memberTypeId });
        return memberType;
      }
    }
  })
});