import { ACCOUNT_CREATION_TEMPLATE, notificationEnabledEmailTemplate, VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_OTP_TEMPLATE } from '../../controllers/emailTemplates.js';

describe('Email Templates', () => {
  test('ACCOUNT_CREATION_TEMPLATE includes fullname', () => {
    const html = ACCOUNT_CREATION_TEMPLATE('Alice');
    expect(html).toContain('Alice');
    expect(html).toContain('Welcome to Shop Hub');
  });

  test('notificationEnabledEmailTemplate toggles content based on enabled flag', () => {
    const enabledHtml = notificationEnabledEmailTemplate('Bob', 'news', true);
    expect(enabledHtml).toContain('enabled');
    expect(enabledHtml).toContain('Bob');

    const disabledHtml = notificationEnabledEmailTemplate('Carol', 'alerts', false);
    expect(disabledHtml).toContain('disabled');
    expect(disabledHtml).toContain('Carol');
  });

  test('VERIFICATION_EMAIL_TEMPLATE contains code and name', () => {
    const html = VERIFICATION_EMAIL_TEMPLATE('Dana', '123456');
    expect(html).toContain('123456');
    expect(html).toContain('Dana');
  });

  test('PASSWORD_RESET_OTP_TEMPLATE contains otp and name', () => {
    const html = PASSWORD_RESET_OTP_TEMPLATE('Eve', '654321');
    expect(html).toContain('654321');
    expect(html).toContain('Eve');
  });
});
