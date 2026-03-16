/**
 * BurnFeed Google Apps Script receiver.
 *
 * Before deploying:
 * 1) Replace FORM_ID with your Google Form ID.
 * 2) Replace the ENTRY IDs with your actual Google Form entry IDs.
 * 3) Deploy as a Web App with access set to "Anyone".
 * 4) Paste the Web App URL into data.js on your site.
 */

const FORM_ID = 'PASTE_YOUR_GOOGLE_FORM_ID_HERE';

const FIELD_MAP = {
  submittedAt: 'entry.1111111111',
  q1: 'entry.2222222221',
  q2: 'entry.2222222222',
  q3: 'entry.2222222223',
  q4: 'entry.2222222224',
  q5: 'entry.2222222225',
  q6: 'entry.2222222226',
  q7: 'entry.2222222227',
  q8: 'entry.2222222228',
  q9: 'entry.2222222229',
  q10: 'entry.2222222230',
  resultId: 'entry.3333333331',
  resultName: 'entry.3333333332'
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const url = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;

    const payload = {};
    payload[FIELD_MAP.submittedAt] = data.submittedAt || '';
    payload[FIELD_MAP.q1] = data.answers?.q1 || '';
    payload[FIELD_MAP.q2] = data.answers?.q2 || '';
    payload[FIELD_MAP.q3] = data.answers?.q3 || '';
    payload[FIELD_MAP.q4] = data.answers?.q4 || '';
    payload[FIELD_MAP.q5] = data.answers?.q5 || '';
    payload[FIELD_MAP.q6] = data.answers?.q6 || '';
    payload[FIELD_MAP.q7] = data.answers?.q7 || '';
    payload[FIELD_MAP.q8] = data.answers?.q8 || '';
    payload[FIELD_MAP.q9] = data.answers?.q9 || '';
    payload[FIELD_MAP.q10] = data.answers?.q10 || '';
    payload[FIELD_MAP.resultId] = String(data.resultId || '');
    payload[FIELD_MAP.resultName] = data.resultName || '';

    UrlFetchApp.fetch(url, {
      method: 'post',
      payload,
      muteHttpExceptions: true
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
