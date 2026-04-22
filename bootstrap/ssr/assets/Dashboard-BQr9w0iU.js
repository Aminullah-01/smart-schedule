import { jsxs, jsx } from "react/jsx-runtime";
import { A as Authenticated } from "./AuthenticatedLayout-DBeoVqMY.js";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { useState, useRef, useMemo, useEffect } from "react";
import "./ApplicationLogo-BjuNSEVu.js";
import "@headlessui/react";
function Dashboard({ stats, timeline, recentNotifications }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);
  const notifiedBrowserIds = useRef(/* @__PURE__ */ new Set());
  const [ruleData, setRuleData] = useState({
    email_enabled: true,
    sms_enabled: false,
    browser_enabled: true,
    in_app_enabled: true
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
    priority: "medium",
    date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    start_time: "09:00",
    end_time: "10:00",
    is_recurring: false,
    recurrence_type: ""
  });
  const modalTitle = useMemo(
    () => editingEventId === null ? "Create Event" : "Edit Event",
    [editingEventId]
  );
  const openCreateModal = () => {
    setEditingEventId(null);
    setErrorMessage("");
    setSuccessMessage("");
    setFormData({
      title: "",
      description: "",
      category: "General",
      priority: "medium",
      date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      start_time: "09:00",
      end_time: "10:00",
      is_recurring: false,
      recurrence_type: ""
    });
    setIsModalOpen(true);
  };
  const openEditModal = (event) => {
    setEditingEventId(event.id);
    setErrorMessage("");
    setSuccessMessage("");
    setFormData({
      title: event.title,
      description: event.description ?? "",
      category: event.category,
      priority: event.priority,
      date: event.date,
      start_time: event.startTime,
      end_time: event.endTime,
      is_recurring: event.isRecurring,
      recurrence_type: event.recurrenceType ?? ""
    });
    setIsModalOpen(true);
  };
  const refreshDashboard = () => {
    router.reload({
      only: ["stats", "timeline", "recentNotifications"]
    });
  };
  const closeModal = () => {
    if (!isSaving) {
      setIsModalOpen(false);
    }
  };
  const handleSubmit = async (event) => {
    var _a, _b;
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSaving(true);
    const payload = {
      ...formData,
      description: formData.description || null,
      recurrence_type: formData.is_recurring ? formData.recurrence_type : null
    };
    try {
      if (editingEventId === null) {
        await axios.post("/api/events", payload);
      } else {
        await axios.put(`/api/events/${editingEventId}`, payload);
      }
      setIsModalOpen(false);
      setSuccessMessage(editingEventId === null ? "Event created successfully." : "Event updated successfully.");
      refreshDashboard();
    } catch (error) {
      setErrorMessage(
        ((_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) ?? "Unable to save event. Please check your input and try again."
      );
    } finally {
      setIsSaving(false);
    }
  };
  const handleDelete = async (eventId) => {
    var _a, _b;
    const confirmed = window.confirm("Delete this event? This action cannot be undone.");
    if (!confirmed) {
      return;
    }
    try {
      await axios.delete(`/api/events/${eventId}`);
      setSuccessMessage("Event deleted successfully.");
      refreshDashboard();
    } catch (error) {
      setErrorMessage(
        ((_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) ?? "Unable to delete event right now."
      );
    }
  };
  const getReminderStatus = (event) => {
    if (event.reminderSentAt) {
      return {
        label: "✓ Sent",
        className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        dot: "bg-emerald-500"
      };
    }
    if (event.reminderQueuedAt) {
      return {
        label: "⏳ Scheduled",
        className: "bg-sky-50 text-sky-700 border border-sky-200",
        dot: "bg-sky-500"
      };
    }
    if (event.reminderTime) {
      return {
        label: "🔔 Auto-enabled",
        className: "bg-teal-50 text-teal-700 border border-teal-200",
        dot: "bg-teal-500"
      };
    }
    return {
      label: "No reminder",
      className: "bg-slate-100 text-slate-500 border border-slate-200",
      dot: "bg-slate-400"
    };
  };
  const openRuleModal = async () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.get("/api/notification-preferences");
      setRuleData({
        email_enabled: Boolean((_b = (_a = response.data) == null ? void 0 : _a.data) == null ? void 0 : _b.email_enabled),
        sms_enabled: Boolean((_d = (_c = response.data) == null ? void 0 : _c.data) == null ? void 0 : _d.sms_enabled),
        browser_enabled: Boolean((_f = (_e = response.data) == null ? void 0 : _e.data) == null ? void 0 : _f.browser_enabled),
        in_app_enabled: Boolean((_h = (_g = response.data) == null ? void 0 : _g.data) == null ? void 0 : _h.in_app_enabled)
      });
      setIsRuleModalOpen(true);
    } catch (error) {
      setErrorMessage(((_j = (_i = error == null ? void 0 : error.response) == null ? void 0 : _i.data) == null ? void 0 : _j.message) ?? "Unable to load reminder rule settings.");
    }
  };
  const saveRuleSettings = async () => {
    var _a, _b;
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await axios.put("/api/notification-preferences", ruleData);
      setSuccessMessage("Reminder rule saved successfully.");
      setIsRuleModalOpen(false);
      refreshDashboard();
    } catch (error) {
      setErrorMessage(((_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) ?? "Unable to save reminder rule settings.");
    }
  };
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
  }).format(/* @__PURE__ */ new Date());
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }
    if (Notification.permission === "default") {
      void Notification.requestPermission();
    }
    const fetchBrowserNotifications = async () => {
      var _a;
      if (Notification.permission !== "granted") {
        return;
      }
      try {
        const response = await axios.get("/api/notifications?limit=30");
        const notifications = Array.isArray((_a = response.data) == null ? void 0 : _a.data) ? response.data.data : [];
        notifications.filter((item) => item.channel === "browser" && item.status === "sent").forEach((item) => {
          const id = Number(item.id);
          if (Number.isNaN(id) || notifiedBrowserIds.current.has(id)) {
            return;
          }
          notifiedBrowserIds.current.add(id);
          const title = item.event_id ? "Event Reminder" : "Scheduler Notification";
          new Notification(title, {
            body: item.message
          });
        });
      } catch {
      }
    };
    void fetchBrowserNotifications();
    const interval = window.setInterval(fetchBrowserNotifications, 3e4);
    return () => {
      window.clearInterval(interval);
    };
  }, []);
  return /* @__PURE__ */ jsxs(
    Authenticated,
    {
      header: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold tracking-[0.2em] text-teal-700", children: "CONTROL CENTER" }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold leading-tight text-slate-900", children: "Scheduler Dashboard" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-500", children: today })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "/api-docs",
              className: "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900",
              children: "API Docs"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: openCreateModal,
              className: "rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700",
              children: "New Event"
            }
          )
        ] })
      ] }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
        /* @__PURE__ */ jsx("div", { className: "py-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8", children: [
          successMessage && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700", children: successMessage }),
          errorMessage && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700", children: errorMessage }),
          /* @__PURE__ */ jsxs("section", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: [
            /* @__PURE__ */ jsxs("article", { className: "card-lift fade-up p-5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold tracking-[0.14em] text-slate-500", children: "TOTAL EVENTS" }),
              /* @__PURE__ */ jsx("p", { className: "mt-3 text-3xl font-semibold text-slate-900", children: stats.totalEvents }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-teal-700", children: "All scheduled records" })
            ] }),
            /* @__PURE__ */ jsxs("article", { className: "card-lift fade-up p-5", style: { animationDelay: "80ms" }, children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold tracking-[0.14em] text-slate-500", children: "TODAY'S EVENTS" }),
              /* @__PURE__ */ jsx("p", { className: "mt-3 text-3xl font-semibold text-slate-900", children: stats.todayEvents }),
              /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-sky-700", children: [
                stats.upcomingTodayEvents,
                " upcoming today"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("article", { className: "card-lift fade-up p-5", style: { animationDelay: "140ms" }, children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold tracking-[0.14em] text-slate-500", children: "REMINDERS SENT" }),
              /* @__PURE__ */ jsx("p", { className: "mt-3 text-3xl font-semibold text-slate-900", children: stats.remindersSent }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-amber-700", children: "Across email and SMS" })
            ] }),
            /* @__PURE__ */ jsxs("article", { className: "card-lift fade-up p-5", style: { animationDelay: "200ms" }, children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold tracking-[0.14em] text-slate-500", children: "CONFLICT ALERTS" }),
              /* @__PURE__ */ jsx("p", { className: "mt-3 text-3xl font-semibold text-slate-900", children: stats.conflictAlerts }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-rose-700", children: "Needs reschedule" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "grid gap-6 lg:grid-cols-[1.4fr_0.9fr]", children: [
            /* @__PURE__ */ jsxs("article", { className: "card-lift fade-up p-6", style: { animationDelay: "120ms" }, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-slate-900", children: "Today's Timeline" }),
                /* @__PURE__ */ jsx("span", { className: "rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700", children: "3 Focus Blocks" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-4", children: [
                timeline.length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500", children: "No events scheduled for today yet." }),
                timeline.map((item) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4",
                    children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800", children: item.title }),
                        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: item.category })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("span", { className: "rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white", children: item.time }),
                        (() => {
                          const status = getReminderStatus(item);
                          return /* @__PURE__ */ jsxs(
                            "span",
                            {
                              title: "Automatic reminder status",
                              className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className}`,
                              children: [
                                /* @__PURE__ */ jsx("span", { className: `h-1.5 w-1.5 rounded-full ${status.dot}` }),
                                status.label
                              ]
                            }
                          );
                        })(),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => openEditModal(item),
                            className: "rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 transition hover:bg-white",
                            children: "Edit"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => handleDelete(item.id),
                            className: "rounded-md border border-rose-200 px-2 py-1 text-xs font-medium text-rose-700 transition hover:bg-rose-50",
                            children: "Delete"
                          }
                        )
                      ] })
                    ]
                  },
                  item.id
                ))
              ] })
            ] }),
            /* @__PURE__ */ jsxs("article", { className: "card-lift fade-up p-6", style: { animationDelay: "180ms" }, children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-slate-900", children: "Execution Panel" }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "/api-docs",
                    className: "block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white",
                    children: "Open API Documentation"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "/profile",
                    className: "block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white",
                    children: "Update Profile"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: openRuleModal,
                    className: "w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700",
                    children: "Create Reminder Rule"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold tracking-[0.12em] text-slate-700", children: "DELIVERY HEALTH" }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-700", children: "92% of reminders were acknowledged within 15 minutes this week." })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-2", children: [
                { label: "Email channel", value: stats.emailChannelPercent },
                { label: "SMS channel", value: stats.smsChannelPercent }
              ].map((item) => /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "mb-1 flex items-center justify-between text-xs text-slate-500", children: [
                  /* @__PURE__ */ jsx("span", { children: item.label }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    item.value,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "h-2 rounded-full bg-slate-200", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "h-2 rounded-full bg-teal-600",
                    style: { width: `${item.value}%` }
                  }
                ) })
              ] }, item.label)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "card-lift fade-up p-6", style: { animationDelay: "240ms" }, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-slate-900", children: "Recent Notifications" }),
              /* @__PURE__ */ jsx("span", { className: "rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700", children: "Live Feed" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-3 md:grid-cols-3", children: [
              recentNotifications.length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 md:col-span-3", children: "No notifications yet. Trigger reminders to populate this feed." }),
              recentNotifications.map((notification) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-800", children: notification.title }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: notification.detail }),
                /* @__PURE__ */ jsxs("p", { className: "mt-2 text-[11px] uppercase tracking-[0.1em] text-slate-400", children: [
                  notification.status,
                  " • ",
                  notification.time
                ] })
              ] }, notification.id))
            ] })
          ] })
        ] }) }),
        isRuleModalOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4 py-8", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-slate-900", children: "Reminder Rule" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setIsRuleModalOpen(false),
                className: "rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-600",
                children: "Close"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mb-4 text-sm text-slate-600", children: "Choose how users receive event reminders." }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [
            { key: "email_enabled", label: "Email reminders" },
            { key: "sms_enabled", label: "SMS reminders" },
            { key: "browser_enabled", label: "Browser reminders" },
            { key: "in_app_enabled", label: "In-app reminders" }
          ].map((item) => /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-700", children: item.label }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: ruleData[item.key],
                onChange: (event) => setRuleData((previous) => ({
                  ...previous,
                  [item.key]: event.target.checked
                }))
              }
            )
          ] }, item.key)) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5 flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setIsRuleModalOpen(false),
                className: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: saveRuleSettings,
                className: "rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white",
                children: "Save Rule"
              }
            )
          ] })
        ] }) }),
        isModalOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4 py-8", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-slate-900", children: modalTitle }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: closeModal,
                className: "rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-600",
                children: "Close"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("label", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx("span", { className: "mb-1 block text-xs font-semibold tracking-[0.12em] text-slate-500", children: "TITLE" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  required: true,
                  value: formData.title,
                  onChange: (event) => setFormData((previous) => ({ ...previous, title: event.target.value })),
                  className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx("span", { className: "mb-1 block text-xs font-semibold tracking-[0.12em] text-slate-500", children: "DESCRIPTION" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: formData.description,
                  onChange: (event) => setFormData((previous) => ({ ...previous, description: event.target.value })),
                  rows: 3,
                  className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { children: [
              /* @__PURE__ */ jsx("span", { className: "mb-1 block text-xs font-semibold tracking-[0.12em] text-slate-500", children: "CATEGORY" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  required: true,
                  value: formData.category,
                  onChange: (event) => setFormData((previous) => ({ ...previous, category: event.target.value })),
                  className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { children: [
              /* @__PURE__ */ jsx("span", { className: "mb-1 block text-xs font-semibold tracking-[0.12em] text-slate-500", children: "PRIORITY" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: formData.priority,
                  onChange: (event) => setFormData((previous) => ({
                    ...previous,
                    priority: event.target.value
                  })),
                  className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "low", children: "Low" }),
                    /* @__PURE__ */ jsx("option", { value: "medium", children: "Medium" }),
                    /* @__PURE__ */ jsx("option", { value: "high", children: "High" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { children: [
              /* @__PURE__ */ jsx("span", { className: "mb-1 block text-xs font-semibold tracking-[0.12em] text-slate-500", children: "DATE" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  required: true,
                  type: "date",
                  value: formData.date,
                  onChange: (event) => setFormData((previous) => ({ ...previous, date: event.target.value })),
                  className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { children: [
              /* @__PURE__ */ jsx("span", { className: "mb-1 block text-xs font-semibold tracking-[0.12em] text-slate-500", children: "START TIME" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  required: true,
                  type: "time",
                  value: formData.start_time,
                  onChange: (event) => setFormData((previous) => ({ ...previous, start_time: event.target.value })),
                  className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { children: [
              /* @__PURE__ */ jsx("span", { className: "mb-1 block text-xs font-semibold tracking-[0.12em] text-slate-500", children: "END TIME" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  required: true,
                  type: "time",
                  value: formData.end_time,
                  onChange: (event) => setFormData((previous) => ({ ...previous, end_time: event.target.value })),
                  className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 sm:col-span-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: formData.is_recurring,
                  onChange: (event) => setFormData((previous) => ({
                    ...previous,
                    is_recurring: event.target.checked,
                    recurrence_type: event.target.checked ? previous.recurrence_type || "weekly" : ""
                  }))
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-700", children: "Recurring event" })
            ] }),
            formData.is_recurring && /* @__PURE__ */ jsxs("label", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx("span", { className: "mb-1 block text-xs font-semibold tracking-[0.12em] text-slate-500", children: "RECURRENCE TYPE" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: formData.recurrence_type,
                  onChange: (event) => setFormData((previous) => ({
                    ...previous,
                    recurrence_type: event.target.value
                  })),
                  className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "weekly", children: "Weekly" }),
                    /* @__PURE__ */ jsx("option", { value: "daily", children: "Daily" }),
                    /* @__PURE__ */ jsx("option", { value: "monthly", children: "Monthly" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2 flex justify-end gap-2 pt-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: closeModal,
                  className: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  disabled: isSaving,
                  className: "rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60",
                  children: isSaving ? "Saving..." : editingEventId === null ? "Create Event" : "Save Changes"
                }
              )
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  Dashboard as default
};
