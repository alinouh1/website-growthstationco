import { pics } from "../../../assets/images/pages";

const p = (i) => pics[i % pics.length];

// المفتاح = id الفصل في data.js
export const aboutImages = { why: p(10), different: p(11), serve: p(12) };
