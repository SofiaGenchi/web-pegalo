declare module '#pegalo-repository' {
  export const findSession: typeof import('./repository-cloudflare').findSession;
  export const findUser: typeof import('./repository-cloudflare').findUser;
  export const createInitialUser: typeof import('./repository-cloudflare').createInitialUser;
  export const createSession: typeof import('./repository-cloudflare').createSession;
  export const deleteSession: typeof import('./repository-cloudflare').deleteSession;
  export const countAttempt: typeof import('./repository-cloudflare').countAttempt;
  export const readContent: typeof import('./repository-cloudflare').readContent;
  export const writeContent: typeof import('./repository-cloudflare').writeContent;
}
declare module '#pegalo-runtime' {
  export const adminEnabled: boolean;
  export const setupSecret: typeof import('./runtime-cloudflare').setupSecret;
  export const bucket: typeof import('./runtime-cloudflare').bucket;
  export const rateLimitSource: typeof import('./runtime-cloudflare').rateLimitSource;
}
