import { z } from 'zod';

export const NicknameChangeFormSchema = z.object({
  newNickname: z
    .string({
      required_error: '새로운 닉네임을 입력해 주세요.',
      invalid_type_error: 'Nickname must be a string.',
    })
    .min(1, { message: '새로운 닉네임을 입력해 주세요.' })
    .max(30, { message: '새로운 닉네임을 입력해 주세요.' }),
});
