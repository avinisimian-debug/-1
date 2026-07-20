/**
 * Inline script injected in <head> before paint to prevent
 * locale/dir/theme flash on first load (SSR/hydration mismatch).
 */
export const I18N_BOOTSTRAP_SCRIPT = `(function(){try{var t=localStorage.getItem("stazai-theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark");var l=localStorage.getItem("meetscribe-locale");var loc=["en","he","ar","es","fr","ru"];var rtl=["he","ar"];if(!l||loc.indexOf(l)===-1){var b=(navigator.language||"en").split("-")[0];l=loc.indexOf(b)!==-1?b:"en"}document.documentElement.lang=l;document.documentElement.dir=rtl.indexOf(l)!==-1?"rtl":"ltr"}catch(e){}})();`;
