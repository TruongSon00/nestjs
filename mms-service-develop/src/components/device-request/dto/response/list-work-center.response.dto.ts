import { Expose } from 'class-transformer';

export class LeaderResponse {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  fullName: string;
}

export class ListWorkCenterResponse {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  leader: LeaderResponse;
}
