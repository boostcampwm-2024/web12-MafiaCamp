// export type OpenViduRoleType = 'SUBSCRIBER' | 'PUBLISHER' | 'MODERATOR';

export const OpenViduRoleType = {
    SUBSCRIBER: 'SUBSCRIBER',
    PUBLISHER: 'PUBLISHER',
    MODERATOR: 'MODERATOR'
} as const;
  
export type OpenViduRoleType = (typeof OpenViduRoleType)[keyof typeof OpenViduRoleType];