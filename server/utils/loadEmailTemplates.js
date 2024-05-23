import fs from 'fs';

export const signupEmailTemplate = fs.readFileSync(
  './public/email_templates/signup/index.html',
);

export const requestPasswordResetEmailTemplate = fs.readFileSync(
  './public/email_templates/request_password/index.html',
);

export const passordUpdatedEmailTemplate = fs.readFileSync('./public/email_templates/password_updated/index.html');

export function renderEmailTemplate(emailTemplate, config = {}) {
  let renderedEmailTemplate = emailTemplate
    .toString()
    .replace('$USER_NAME$', config.name ?? '')
    .replace('$CLICK_LINK$', config.clickLink ?? '')    
    .replace('$VERIFICATION_CODE$', config.verificationCode ?? '')
    .replace('$VERIFICATION_CODE$', config.verificationCode ?? '');

  return renderedEmailTemplate;
}
