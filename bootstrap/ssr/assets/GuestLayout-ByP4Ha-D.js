import { jsx, jsxs } from "react/jsx-runtime";
import { A as ApplicationLogo } from "./ApplicationLogo-BjuNSEVu.js";
import { Link } from "@inertiajs/react";
function Guest({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen flex-col items-center justify-center px-4 py-10", children: /* @__PURE__ */ jsxs("div", { className: "fade-up w-full max-w-md", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-0 flex flex-col items-center justify-center p-8", children: /* @__PURE__ */ jsxs(Link, { href: "/", className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsx(ApplicationLogo, { className: "h-20 w-20 object-contain shadow-sm" }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold tracking-tight text-slate-900", children: [
          "Smart",
          /* @__PURE__ */ jsx("span", { className: "text-teal-600", children: "Schedule" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-500", children: "Plan Smart. Stay Ahead." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "card-lift overflow-hidden px-6 py-6 sm:rounded-2xl", children })
  ] }) });
}
export {
  Guest as G
};
