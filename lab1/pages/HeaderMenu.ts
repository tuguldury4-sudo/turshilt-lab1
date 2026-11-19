import { Page, Locator, expect } from '@playwright/test';

/** Page Object — нэвтэрсний дараах бүх хуудсанд нийтлэг байдаг бургер цэс */
export class HeaderMenu {
  readonly page: Page;

  readonly openMenuButton: Locator;
  readonly logoutButton: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });

    /*
     * ЖИЧ: 2026-09 үед saucedemo цэсний элементүүдээ өөрчилсөн.
     * Өмнө нь энгийн <a> холбоос байсан тул getByRole('link') ажилладаг байсан бол
     * одоо <a href="#" role="button"> болсон — өөрөөр хэлбэл accessibility-ийн хувьд
     * ТОВЧ гэж зарлагдаж байна. Тиймээс локаторыг 'button' role руу шинэчлэв.
     *
     * Энэ бол UI автомат тестийн бодит амьдралын жишээ: тест унасан нь тестийн алдаа
     * биш, тестлэж буй ПРОГРАМ өөрчлөгдсөний шинж байв. Page Object ашигласны ачаар
     * 12 тест бүрийг биш, зөвхөн энэ нэг файлыг л засахад хангалттай болсон.
     */
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.resetButton = page.getByRole('button', { name: 'Reset App State' });
  }

  /**
   * Бургер цэсийг нээх.
   *
   * Цэс нь 0.5 секундын CSS transition-той бөгөөд хаалттай үедээ `aria-hidden="true"`
   * байдаг. WebKit (Safari) дээр анимацийн явцад хийсэн товшилт хааяа алдагддаг тул
   * цэс ҮНЭХЭЭР нээгдсэн эсэхийг шалгаж, нээгдээгүй бол дахин оролддог болгов.
   *
   * expect(...).toPass() нь Playwright-ийн албан ёсны "тогтвортой болтол давтах" арга —
   * `waitForTimeout(1000)` гэж сохроор хүлээхээс хамаагүй найдвартай, хурдан.
   */
  async openMenu() {
    await expect(async () => {
      // Цэс хаалттай үед Logout нь aria-hidden дотор байдаг тул role-оор олдохгүй —
      // яг үүнийг ашиглан "нээлттэй эсэх"-ийг шалгаж байна.
      if (!(await this.logoutButton.isVisible())) {
        await this.openMenuButton.click();
      }
      await this.logoutButton.click({ trial: true, timeout: 2000 });
    }).toPass({ timeout: 15000, intervals: [300, 700, 1500] });
  }

  /** Системээс гарах — тест бүрийг цэвэр төлөвт төгсгөнө (Алхам 5) */
  async logout() {
    await this.openMenu();
    await this.logoutButton.click();

    // Гарсны дараа нэвтрэх хуудас нээгдсэнийг шалгана
    await expect(this.page).toHaveURL('https://www.saucedemo.com/');
    await expect(this.page.getByRole('button', { name: 'Login' })).toBeVisible();
  }
}
