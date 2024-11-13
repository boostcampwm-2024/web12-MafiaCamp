import { AllocateJobRequest } from '../../dto/allocate.job.request';

export const ALLOCATE_USER_ROLE_USECASE = Symbol('ALLOCATE_USER_ROLE_USECASE');

export interface AllocateUserRoleUsecase {
  allocate(jobRequest: AllocateJobRequest): Promise<void>;
}
