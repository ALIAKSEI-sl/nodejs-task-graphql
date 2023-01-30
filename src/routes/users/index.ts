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
    const users = await fastify.db.users.findMany();
    return users;
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

      const following = await fastify.db.users.findMany({ key: 'subscribedToUserIds', inArray: request.params.id });
      await Promise.all(following.map(async follower => {
        const indexUserDelete = follower.subscribedToUserIds.indexOf(request.params.id);
        follower.subscribedToUserIds.splice(indexUserDelete, 1);
        await fastify.db.users.change(follower.id, { subscribedToUserIds: follower.subscribedToUserIds });
      }))

      const posts = await fastify.db.posts.findMany({ key: 'userId', equals: request.params.id });

      await Promise.all(posts.map(async post => {
        await fastify.db.posts.delete(post.id);
      }))

      const profile = await fastify.db.profiles.findOne({ key: 'userId', equals: request.params.id });
      if (profile !== null) await fastify.db.profiles.delete(profile.id);

      const remoteUser = fastify.db.users.delete(request.params.id);
      return remoteUser;
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
        { subscribedToUserIds: userSubscribeTo.subscribedToUserIds.concat(request.params.id) },
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

      const indexFollower = userUnsubscribeFrom.subscribedToUserIds.indexOf(request.params.id);
      userUnsubscribeFrom.subscribedToUserIds.splice(indexFollower, 1);
      const editedUser = await fastify.db.users.change(request.body.userId, { subscribedToUserIds: userUnsubscribeFrom.subscribedToUserIds });
      return editedUser;
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

        const editedUser = await fastify.db.users.change(request.params.id, request.body);
        return editedUser;
      } catch {
        throw fastify.httpErrors.badRequest();
      }
    }
  );
};

export default plugin;
