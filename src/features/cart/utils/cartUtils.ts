export const calculateTotalForProduct = (price: number, quantiy: number) => {
    return price * quantiy;
}

export const getCardType = (number: string) => {
    const sanitized = number.replace(/\s/g, '');
    if (sanitized.startsWith("4")) return 'visa';
    if (/^5[1-5]/.test(sanitized)) return 'mastercard';
    return 'unknown';
};

export function formatCardNumber(value: string): string {
  const onlyDigits = value.replace(/\D/g, '');
  const formatted = onlyDigits.match(/.{1,4}/g)?.join(' ') ?? '';

  return formatted;
}

export function formatExpireDate(value: string): string {
  const onlyDigits = value.replace(/\D/g, '');
  const formatted = onlyDigits.match(/.{1,2}/g)?.join('/') ?? '';

  return formatted;
}
