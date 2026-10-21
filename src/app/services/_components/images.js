import { pics } from "../../../assets/images/pages";

// غيّر الرقم لتبديل الصورة (0 = img-01). لو الصور أقل من المطلوب بتتكرر تلقائي.
const p = (i) => pics[i % pics.length];

export const serviceImages = {
  strategy: p(0), branding: p(1), content: p(2), social: p(3), media: p(4),
  ads: p(5), web: p(6), ecommerce: p(7), mobile: p(8), uiux: p(9),
};
