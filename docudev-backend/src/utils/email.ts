import { Resend } from 'resend'
import { IUser } from '../models/User'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async (email: IUser['email'], code: IUser['code']) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: `${email}`,
    subject: 'Recuperación de contraseña',
    html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperación de Contraseña</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    line-height: 1.6;
                    color: #cbd5e1;
                    background-color: #0f172a;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #1e293b;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                                        padding: 30px 20px;
                    text-align: center;
                }
                h1 {
                    color: #f1f5f9;
                    margin-top: 0;
                    font-size: 26px;
                    font-weight: 700;
                }
                .code-container {
                    margin: 30px auto;
                    padding: 15px;
                    background-color: #0f172a;
                    border-radius: 8px;
                    border: 1px solid #334155;
                    width: fit-content;
                }
                .code {
                    font-family: monospace;
                    font-size: 36px;
                    font-weight: bold;
                    letter-spacing: 6px;
                    color: #34d399;
                }
                .instructions {
                    margin-bottom: 30px;
                    color: #cbd5e1;
                }
                .button {
                    display: inline-block;
                    background-color: #34d399;
                    color: #0f172a !important;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 4px;
                    font-weight: 600;
                    margin-top: 20px;
                    font-size: 16px;
                }
                .button:hover {
                    background-color: #33ecbb !important;
                    color: #0f172a !important;
                    }
                .warning {
                    margin-top: 30px;
                    padding: 15px;
                    background-color: #064e3b;
                    border-left: 4px solid #34d399;
                    text-align: left;
                    font-size: 14px;
                    color: #f1f5f9;
                    border-radius: 4px;
                }
                p {
                    margin: 16px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Recuperar contraseña</h1>
                <p class="instructions">Hemos recibido una solicitud para restablecer tu contraseña. Utiliza el siguiente código de verificación para completar el proceso:</p>
                
                <div class="code-container">
                    <div class="code">${code}</div>
                </div>
                
                <p class="instructions">Este código expirará en una hora. Si no solicitaste un cambio de contraseña, puedes ignorar este mensaje.</p>
                
                <a href="http://localhost:5173/recover-password?email=${encodeURIComponent(
                  email
                )}" class="button">Ir a recuperar contraseña</a>
                
                <div class="warning">
                    <strong>Importante:</strong> Por seguridad, nunca compartas este código con nadie. Nuestro equipo nunca te pedirá este código por teléfono o email.
                </div>
            </div>
        </body>
        </html>
        `
  })
}
