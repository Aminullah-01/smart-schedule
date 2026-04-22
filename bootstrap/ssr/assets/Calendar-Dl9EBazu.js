import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-DBeoVqMY.js";
import { Head, Link } from "@inertiajs/react";
import "./ApplicationLogo-BjuNSEVu.js";
import "@headlessui/react";
import "react";
function Calendar({ monthLabel, previousMonth, nextMonth, eventsByDate }) {
  const dateKeys = Object.keys(eventsByDate).sort();
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold tracking-[0.2em] text-teal-700", children: "PLANNING VIEW" }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold leading-tight text-slate-900", children: "Calendar" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-500", children: monthLabel })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("calendar", { month: previousMonth }),
              className: "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400",
              children: "Previous Month"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("calendar", { month: nextMonth }),
              className: "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400",
              children: "Next Month"
            }
          )
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Calendar" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "card-lift p-6", children: [
          dateKeys.length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500", children: "No events scheduled for this month." }),
          /* @__PURE__ */ jsx("div", { className: "space-y-5", children: dateKeys.map((dateKey) => /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-slate-800", children: (/* @__PURE__ */ new Date(`${dateKey}T00:00:00`)).toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric"
              }) }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-500", children: [
                eventsByDate[dateKey].length,
                " event(s)"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid gap-3 md:grid-cols-2", children: eventsByDate[dateKey].map((event) => /* @__PURE__ */ jsxs("article", { className: "rounded-lg border border-slate-200 bg-white p-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-900", children: event.title }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: event.category }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-slate-700", children: event.timeLabel }),
              /* @__PURE__ */ jsx("span", { className: "mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600", children: event.priority })
            ] }, event.id)) })
          ] }, dateKey)) })
        ] }) }) })
      ]
    }
  );
}
export {
  Calendar as default
};
