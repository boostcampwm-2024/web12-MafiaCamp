import test, { expect } from '@playwright/test';

test.describe('OpenVidu 연동 테스트', () => {
  test('게임 시작 테스트', async ({ browser }) => {
    // 카메라 및 마이크 권한 허용 설정
    const context = await browser.newContext({
      permissions: ['camera', 'microphone'],
    });

    // 페이지 생성
    const page = await context.newPage();

    // 로비 페이지로 이동
    await page.goto('http://localhost:3000/lobby');

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

    // 게임방 입장하기
    await page.getByText('참가하기').last().click();
    // await page.waitForURL(/\/game\/[a-zA-z0-9-]+[?capacity=\d]+/);

    await expect(page.getByRole('button', { name: '게임 시작' })).toBeVisible();
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 게임 시작하기
    // await page.getByRole('button', { name: '게임 시작' }).click();
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // await expect(page.getByText('오디오')).toBeVisible();
    // await expect(page.getByText('카메라')).toBeVisible();
  });
});
