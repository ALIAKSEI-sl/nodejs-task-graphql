import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql';
import { graphqlBodySchema } from './schema';

const schemaQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberType: queryMemberType,
    memberTypes: queryMemberTypes,
    user: queryUser,
    users: queryUsers,
    profile: queryProfile,
    profiles: queryProfiles,
    post: queryPost,
    posts: queryPosts
  }
});

const schemaMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: queryCreateUser,
    updateUser: queryUpdateUser,
    createProfile: queryCreateProfile,
    updateProfile: queryUpdateProfile,
    createPost: queryCreatePost,
  }
});

const schema = new GraphQLSchema({
  query: schemaQuery,
  mutation: schemaMutation
});

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post('/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const { query, variables } = request.body;

      return await graphql({
        schema,
        source: query!,
        variableValues: variables,
        contextValue: fastify
      });
    }
  );
};

export default plugin;
