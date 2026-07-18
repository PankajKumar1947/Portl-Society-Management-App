export function getBaseEmailTemplate(
  title: string,
  contentHtml: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #FAF9F5;
            font-family: 'Inter', 'Outfit', Arial, sans-serif;
            color: #252833;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #FFFFFF;
            border: 1px solid #ECE8DD;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          }
          .header {
            background-color: #252833;
            padding: 24px;
            text-align: center;
            border-bottom: 4px solid #D9F20F;
          }
          .header h1 {
            color: #FFFFFF;
            margin: 0;
            font-size: 24px;
            letter-spacing: 1px;
          }
          .content {
            padding: 40px 32px;
            line-height: 1.6;
          }
          .footer {
            background-color: #F5F4EF;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #5E6573;
            border-top: 1px solid #ECE8DD;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
          </div>
          <div class="content">
            ${contentHtml}
          </div>
          <div class="footer">
            <p>This is an automated email from Portl. Please do not reply directly.</p>
            <p>&copy; ${new Date().getFullYear()} Portl. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
