import { defineConfig, devices } from '@playwright/test';

/**
 * Лаборатори №1 — Playwright тохиргоо
 * Баримт: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  /* Тестүүд хоорондоо хамааралгүй тул параллель ажиллуулна (test isolation) */
  fullyParallel: true,

  /* CI дээр санамсаргүй үлдсэн test.only байвал build-ыг унагана */
  forbidOnly: Boolean(process.env.CI),

  /* CI дээр л дахин оролдоно; локал дээр алдаа шууд харагдах нь дээр */
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  /* HTML тайлан үүсгэнэ. Ажиллуулсны дараа: npx playwright show-report */
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    /* Бүх тестийн үндсэн хаяг — page.goto('/') гэж бичихэд хангалттай болно */
    baseURL: 'https://www.saucedemo.com',

    /* saucedemo нь data-testid биш data-test атрибут хэрэглэдэг тул getByTestId-г түүнд тохируулав */
    testIdAttribute: 'data-test',

    /*
     * Trace-ийг зөвхөн УНАСАН тестэд хадгална.
     * 'on' байхад амжилттай тест бүрийн trace хадгалагдаж, тайлангийн хэмжээ
     * олон МБ болж хөөрдөг — амжилттай тестийн trace-ийг хэн ч нээж үздэггүй.
     * Алдаа мөшгих шаардлагатай үед: npx playwright test --trace on
     */
    trace: 'retain-on-failure',

    /* Мөн адил зөвхөн унасан тестийн видео, скриншот */
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  /*
   * Кросс-хөтөч тест: нэг тест 3 хөдөлгүүр дээр (Chromium, Firefox, WebKit) ажиллана.
   * Хөтөч бүр DOM, CSS, хүлээлтийг өөрөөр боловсруулдаг тул зөвхөн нэг хөтөч дээр
   * ажилласан тест бодит хэрэглэгчдийн орчныг төлөөлж чадахгүй.
   * Хөтөчүүдийг суулгах: npx playwright install
   */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }, // Safari-ийн хөдөлгүүр
    },
  ],
});
