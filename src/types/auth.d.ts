export interface IRefreshTokenPayload {
  id: number
  uid: number
  iat: number
  exp: number
}

export type IAccessTokenPayload = Omit<IRefreshTokenPayload, 'id'>
