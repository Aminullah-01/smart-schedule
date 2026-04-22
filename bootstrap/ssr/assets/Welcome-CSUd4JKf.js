import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { A as ApplicationLogo } from "./ApplicationLogo-BjuNSEVu.js";
import { Head, Link } from "@inertiajs/react";
function Welcome({ auth }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Smart Scheduler" }),
    /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen overflow-hidden pb-14 text-slate-900", children: [
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -left-20 top-24 h-64 w-64 rounded-full bg-teal-200/60 blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-200/55 blur-3xl" }),
      /* @__PURE__ */ jsxs("header", { className: "relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7", children: [
        /* @__PURE__ */ jsxs(Link, { href: "/", className: "fade-up flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(ApplicationLogo, { className: "h-11 w-11 object-contain" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold tracking-tight text-slate-900", children: [
              "Smart",
              /* @__PURE__ */ jsx("span", { className: "text-teal-600", children: "Schedule" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-700", children: "Plan with less noise, act with precision." })
          ] })
        ] }),
        /* @__PURE__ */ jsx("nav", { className: "fade-up flex items-center gap-2", children: auth.user ? /* @__PURE__ */ jsx(
          Link,
          {
            href: route("dashboard"),
            className: "rounded-lg border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900",
            children: "Open Dashboard"
          }
        ) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("login"),
              className: "rounded-lg border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900",
              children: "Sign In"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: route("register"),
              className: "rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700",
              children: "Get Started"
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("main", { className: "relative mx-auto w-full max-w-6xl px-6", children: [
        /* @__PURE__ */ jsxs("section", { className: "grid items-start gap-10 pb-14 pt-4 lg:grid-cols-[1.15fr_0.85fr] lg:pt-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "fade-up space-y-6", children: [
            /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full border border-teal-200 bg-teal-50 px-4 py-1 text-xs font-semibold tracking-[0.16em] text-teal-800", children: "BUILT FOR FOCUS" }),
            /* @__PURE__ */ jsx("h1", { className: "max-w-3xl text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl", children: "Organize events, resolve conflicts, and deliver reminders from one clean command center." }),
            /* @__PURE__ */ jsx("p", { className: "max-w-2xl text-base text-slate-600 sm:text-lg", children: "Smart Scheduler gives teams a reliable timeline with conflict detection, notification history, and API-first integrations that stay easy to maintain." }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 pt-1", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: auth.user ? route("dashboard") : route("register"),
                  className: "rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700",
                  children: auth.user ? "Go to Dashboard" : "Create Account"
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "/api-docs",
                  className: "rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900",
                  children: "View API Docs"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "fade-up card-lift grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-1", children: [
            /* @__PURE__ */ jsxs("article", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold tracking-[0.14em] text-slate-500", children: "SCHEDULE HEALTH" }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-semibold text-slate-900", children: "98%" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-600", children: "On-time event starts in the last 7 days." })
            ] }),
            /* @__PURE__ */ jsxs("article", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold tracking-[0.14em] text-slate-500", children: "ACTIVE REMINDERS" }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-semibold text-slate-900", children: "24" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-600", children: "Email and SMS channels configured." })
            ] }),
            /* @__PURE__ */ jsxs("article", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 lg:col-span-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold tracking-[0.14em] text-slate-500", children: "AUTOMATION" }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-lg font-semibold text-slate-900", children: "Recurring events + queue-ready jobs" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-600", children: "Launch quickly with authentication, events, and notifications endpoints." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("section", { className: "fade-up grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [
          {
            title: "Conflict-Aware Planning",
            body: "Detect overlapping time slots before events are created, not after confusion starts."
          },
          {
            title: "Reliable Notifications",
            body: "Coordinate reminders across channels and keep a visible activity trail."
          },
          {
            title: "API-First Structure",
            body: "Use token authentication and clean endpoints to integrate web or mobile clients."
          }
        ].map((feature, index) => /* @__PURE__ */ jsxs(
          "article",
          {
            className: "card-lift p-5",
            style: { animationDelay: `${120 + index * 80}ms` },
            children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-slate-900", children: feature.title }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-600", children: feature.body })
            ]
          },
          feature.title
        )) })
      ] })
    ] })
  ] });
}
export {
  Welcome as default
};
