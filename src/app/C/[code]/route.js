import { coaPageResponse } from '@/lib/coaPage';

/* Short vial-label QR form, printed on labels from 26 Oct 2026:

     HTTPS://IRONWITHIN.IO/C/AOD-9604-10MG

   It's all upper case so the QR can use alphanumeric mode, which fits the URL
   into a smaller grid with more error correction. On a 12 mm code wrapped round
   a vial, that's what makes it scan. The slug is lower-cased here and resolved
   exactly like /coas/<slug>. Printed labels can't be recalled, so this route
   is permanent. */

export function GET(request, { params }) {
  return coaPageResponse(decodeURIComponent(params.code).toLowerCase());
}
