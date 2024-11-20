import { z } from 'zod';

export const AccountCreateFormSchema = z.object({
  email: z
    .string({
      required_error: '이메일을 입력해 주세요.',
      invalid_type_error: 'Email must be a string.',
    })
    .email({ message: '이메일을 입력해 주세요.' })
    .min(1, { message: '이메일을 입력해 주세요.' })
    .max(30, { message: '이메일을 입력해 주세요.' }),
  nickname: z
    .string({
      required_error: '닉네임을 입력해 주세요.',
      invalid_type_error: 'Nickname must be a string.',
    })
    .min(1, { message: '닉네임을 입력해 주세요.' })
    .max(30, { message: '닉네임을 입력해 주세요.' }),
  password: z
    .string({
      required_error: '비밀번호를 입력해 주세요.',
      invalid_type_error: 'Password must be a string.',
    })
    .min(1, { message: '비밀번호를 입력해 주세요.' })
    .max(255, { message: '비밀번호를 입력해 주세요.' }),
  oAuthId: z
    .string({
      required_error: '임시 OAuthId 값을 입력해 주세요.',
      invalid_type_error: 'OAuthId must be a string.',
    })
    .min(1, { message: '임시 OAuthId 값을 입력해 주세요.' })
    .max(100, { message: '임시 OAuthId 값을 입력해 주세요.' }),
});
