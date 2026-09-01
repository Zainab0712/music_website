// (function (root, factory) {
//   const api = factory();
//   if (typeof module !== 'undefined' && module.exports) {
//     module.exports = api;
//   }
//   root.normalizeVolume = api.normalizeVolume;
// })(typeof globalThis !== 'undefined' ? globalThis : this, function () {
//   function normalizeVolume(value) {
//     const numericValue = Number(value);
//     if (!Number.isFinite(numericValue)) return 0;
//     return Math.min(1, Math.max(0, numericValue / 100));
//   }

//   return { normalizeVolume };
// });
