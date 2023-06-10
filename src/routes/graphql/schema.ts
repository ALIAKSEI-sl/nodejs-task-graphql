import { GraphQLObjectType } from 'graphql';
import { memberTypeConfig, memberTypesConfig } from './member-types/memberTypesConfig';
import { userConfig, usersConfig } from './users/usersConfig';
import { profileConfig, profilesConfig } from './profiles/profilesConfig';
import { postConfig, postsConfig } from './posts/postsConfig';
import { createUserConfig } from './users/createUserConfig';
import { updateUserConfig } from './users/updateUserConfig';
import { createProfileConfig } from './profiles/createProfileConfig';
import { updateProfileConfig } from './profiles/updateProfileConfig';
import { createPostConfig } from './posts/createPostConfig';
import { updatePostConfig } from './posts/updatePostConfig';
import { updateMemberTypeConfig } from './member-types/updateMemberTypesConfig';

export const graphqlBodySchema = {
  type: 'object',
  properties: {
    mutation: { type: 'string' },
    query: { type: 'string' },
    variables: {
      type: 'object',
    },
  },
  oneOf: [
    {
      type: 'object',
      required: ['query'],
      properties: {
        query: { type: 'string' },
        variables: {
          type: 'object',
        },
      },
      additionalProperties: false,
    },
    {
      type: 'object',
      required: ['mutation'],
      properties: {
        mutation: { type: 'string' },
        variables: {
          type: 'object',
        },
      },
      additionalProperties: false,
    },
  ],
} as const;

export const graphqlQuerySchema = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberType: memberTypeConfig,
    memberTypes: memberTypesConfig,
    user: userConfig,
    users: usersConfig,
    profile: profileConfig,
    profiles: profilesConfig,
    post: postConfig,
    posts: postsConfig
  }
});

export const graphqlMutationSchema = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: createUserConfig,
    updateUser: updateUserConfig,
    createProfile: createProfileConfig,
    updateProfile: updateProfileConfig,
    createPost: createPostConfig,
    updatePost: updatePostConfig,
    updateMemberType: updateMemberTypeConfig
  }
});