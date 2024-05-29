import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(decodeURI(new URL(import.meta.url).pathname));

export const signupEmailTemplate = fs.readFileSync(
  path.join(__dirname, 'public/email_templates/signup/index.html'),
);

export const requestPasswordResetEmailTemplate = fs.readFileSync(
  path.join(__dirname, 'public/email_templates/request_password/index.html'),
);

export const passwordUpdatedEmailTemplate = fs.readFileSync(
  path.join(__dirname, 'public/email_templates/password_updated/index.html'),
);

export function renderEmailTemplate(emailTemplate, config = {}) {
  let renderedEmailTemplate = emailTemplate
    .toString()
    .replace('$USER_NAME$', config.name ?? '')
    .replace('$CLICK_LINK$', config.clickLink ?? '')    
    .replace('$VERIFICATION_CODE$', config.verificationCode ?? '')
    .replace('$VERIFICATION_CODE$', config.verificationCode ?? '');

  return renderedEmailTemplate;
}
