import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return await fastify.db.users.findMany();
  });

  fastify.get('/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({ key: 'id', equals: request.params.id });
      if (user === null) throw fastify.httpErrors.notFound('User not found');
      return user;
    }
  );

  fastify.post('/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const user = fastify.db.users.create(request.body);
        return user;
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
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({ key: 'id', equals: request.params.id });
      if (user === null) throw fastify.httpErrors.badRequest('User not found');

      const followers = await fastify.db.users.findMany({ key: 'subscribedToUserIds', inArray: request.params.id });

      await Promise.all(followers.map(async follower => {
        const indexUserDelete = follower.subscribedToUserIds.indexOf(request.params.id);
        follower.subscribedToUserIds.slice(indexUserDelete, 1);

        await fastify.db.users.change(follower.id, { subscribedToUserIds: follower.subscribedToUserIds });
      }))

      const posts = await fastify.db.posts.findMany({ key: 'userId', equals: request.params.id });

      await Promise.all(posts.map(async post => {
        await fastify.db.posts.delete(post.id);
      }))
      
      const profiles = await fastify.db.profiles.findOne({ key: 'userId', equals: request.params.id });
      if (profiles !== null) await fastify.db.profiles.delete(profiles.id);

      fastify.db.users.delete(request.params.id);
      
      return user;
    }
  );

  fastify.post('/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({ key: 'id', equals: request.params.id });
      const userSubscribeTo = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId });
      if (user === null || userSubscribeTo === null) throw fastify.httpErrors.notFound('User not found');

      const userAlreadySubscribeTo = userSubscribeTo.subscribedToUserIds.includes(request.params.id);
      if (userAlreadySubscribeTo) return userSubscribeTo;

      const changeUser = await fastify.db.users.change(request.body.userId,
        { subscribedToUserIds: user.subscribedToUserIds.concat(request.params.id) },
      );
      return changeUser;
    }
  );

  fastify.post('/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({ key: 'id', equals: request.params.id });
      const userUnsubscribeFrom = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId });
      if (user === null || userUnsubscribeFrom === null) throw fastify.httpErrors.notFound('User not found');

      const userUnsubscribeFromUser = userUnsubscribeFrom.subscribedToUserIds.includes(request.params.id);
      if (!userUnsubscribeFromUser) throw fastify.httpErrors.badRequest("You aren't following this user");

      const indexUserSubscribe = userUnsubscribeFrom.subscribedToUserIds.indexOf(request.params.id);
      userUnsubscribeFrom.subscribedToUserIds.splice(indexUserSubscribe, 1);
      const changeUser = await fastify.db.users.change(request.body.userId, { subscribedToUserIds: userUnsubscribeFrom.subscribedToUserIds });
      return changeUser;
    }
  );

  fastify.patch('/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        const user = await fastify.db.users.findOne({ key: 'id', equals: request.params.id });
        if (user === null) throw fastify.httpErrors.notFound('User not found');

        const changeUser = await fastify.db.users.change(request.params.id, request.body);
        return changeUser;
      } catch {
        throw fastify.httpErrors.badRequest();
      }
    }
  );
};

export default plugin;
