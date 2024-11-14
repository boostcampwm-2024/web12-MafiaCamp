import test, { expect } from '@playwright/test';

test.describe('로비 페이지 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 로비 페이지로 이동
    await page.goto('http://localhost:3000/lobby');
  });

  test('로비 페이지 이동 테스트', async ({ page }) => {
    await expect(page.getByText('닉네임 설정하기')).toBeVisible();
  });

  test('게임방 만들기 테스트', async ({ page }) => {
    // 닉네임 설정
    await page.getByRole('textbox').fill('Test_Nickname');
    await page.getByRole('button', { name: '등록하기' }).click();

    // 방 만들기
    await page.getByRole('button', { name: '방 만들기' }).click();
    await page.getByLabel('방 이름').fill('Test_Room');
    await page.getByLabel('인원 수').selectOption('8');
    await page
      .locator('form')
      .getByRole('button', { name: '방 만들기' })
      .click();

    await expect(page.getByText('Test_Room').last()).toBeVisible();
  });
});
