import { z } from 'zod';

export const RoomCreateFormSchema = z.object({
  title: z
    .string({
      required_error: '방 이름을 입력해 주세요.',
      invalid_type_error: 'Title must be a string.',
    })
    .min(1, { message: '방 이름을 입력해 주세요.' })
    .max(30, { message: '방 이름의 길이는 30자 이하여야 합니다.' }),
  capacity: z
    .string({
      required_error: '인원 수를 선택해 주세요.',
      invalid_type_error: 'Capacity must be a string.',
    })
    .min(1, { message: '인원 수를 선택해 주세요.' }),
});
