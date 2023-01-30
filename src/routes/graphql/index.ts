import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLSchema } from 'graphql';
import { graphqlBodySchema, graphqlQuerySchema, graphqlMutationSchema } from './schema';

const schema = new GraphQLSchema({
  query: graphqlQuerySchema,
  mutation: graphqlMutationSchema
});

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
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