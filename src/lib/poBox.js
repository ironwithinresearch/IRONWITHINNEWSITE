// We ship UPS, which cannot deliver to PO Boxes. Same pattern as the backend
// mu-plugin iw-no-pobox.php — keep the two in step.
const PO_BOX = /\b(?:p\s*\.?\s*o\s*\.?\s*(?:box\b|b\.?(?=\s*#?\s*\d|\s*$))|post\s*(?:office\s*)?box\b|postal\s*box\b)|^\s*box\s*#?\s*\d/i;

export const PO_BOX_MESSAGE = 'We ship with UPS, which can’t deliver to PO Boxes. Please enter a street address.';

export const isPoBox = (...lines) => lines.some(l => l && PO_BOX.test(String(l)));
