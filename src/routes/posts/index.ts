import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    const posts = await fastify.db.posts.findMany();
    return posts;
  });

  fastify.get('/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const post = await fastify.db.posts.findOne({ key: 'id', equals: request.params.id });
      if (post === null) throw fastify.httpErrors.notFound('Post not found');
      return post;
    }
  );

  fastify.post('/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        const user = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId });
        if (user === null) throw fastify.httpErrors.badRequest('User not found');

        const post = await fastify.db.posts.create(request.body);
        return post;
      } catch {
        throw fastify.httpErrors.badRequest();
      }
    }
  );

  fastify.delete('/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const post = await fastify.db.posts.findOne({ key: 'id', equals: request.params.id });
      if (post === null) throw fastify.httpErrors.badRequest('Post not found');

      const remotePost = await fastify.db.posts.delete(request.params.id);
      return remotePost;
    }
  );

  fastify.patch('/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        const post = await fastify.db.posts.findOne({key: 'id', equals: request.params.id});
        if (post === null) throw fastify.httpErrors.notFound('Post not found');
      
        const editedPost = await fastify.db.posts.change(request.params.id, request.body);
        return editedPost;
      } catch {
        throw fastify.httpErrors.badRequest();
      }
    }
  );
};

export default plugin;
