import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    const profile = await fastify.db.profiles.findMany();
    return profile;
  });

  fastify.get('/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profiles = await fastify.db.profiles.findOne({ key: 'id', equals: request.params.id });
      if (profiles === null) throw fastify.httpErrors.notFound('Profile not found');
      return profiles;
    }
  );

  fastify.post('/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: request.body.memberTypeId });
        if (memberType === null) throw fastify.httpErrors.notFound('Member types not found');

        const user = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId });
        if (user === null) throw fastify.httpErrors.badRequest();

        const profile = await fastify.db.profiles.findOne({ key: 'userId', equals: request.body.userId });
        if (profile) throw fastify.httpErrors.badRequest('User already has a profile');

        const createProfile = await fastify.db.profiles.create(request.body);
        return createProfile;
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
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({ key: 'id', equals: request.params.id });
      if (profile === null) throw fastify.httpErrors.notFound('Profile not found');

      await fastify.db.profiles.delete(request.params.id);
      return profile;
    }
  ); ``

  fastify.patch('/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        const profile = await fastify.db.profiles.findOne({ key: 'id', equals: request.params.id });
        if (profile === null) throw fastify.httpErrors.notFound('Profile not found');

        if (request.body.memberTypeId !== undefined) {
          const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: request.body.memberTypeId });
          if (memberType === null) throw fastify.httpErrors.notFound('Member types not found');
        }

        const changeProfile = await fastify.db.profiles.change(request.params.id, request.body);
        return changeProfile;
      } catch {
        throw fastify.httpErrors.badRequest();
      }
    }
  );
};

export default plugin;
