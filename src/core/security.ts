/**
 * Utilitários de segurança para sanitização e validação de dados
 */

/**
 * Sanitiza strings para prevenção de XSS básico em renderizações dinâmicas
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validação segura de formato de e-mail (RFC 5322 simplificado)
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Validação de força de senha para integridade de segurança
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  message: string;
} {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      score: 1,
      message: 'A senha deve conter no mínimo 8 caracteres.',
    };
  }

  let score = 0;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score < 3) {
    return {
      isValid: false,
      score,
      message: 'A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.',
    };
  }

  return {
    isValid: true,
    score,
    message: 'Senha adequada aos critérios de segurança.',
  };
}

/**
 * Verifica se um token expirou baseado em timestamp
 */
export function isTokenExpired(expiresAt: number, bufferSeconds: number = 30): boolean {
  const currentTime = Date.now();
  const bufferMs = bufferSeconds * 1000;
  return currentTime >= expiresAt - bufferMs;
}
