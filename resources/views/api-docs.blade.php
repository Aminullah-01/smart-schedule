<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Scheduler API Docs</title>
    <style>
        :root {
            --bg: #f5f7fb;
            --card: #ffffff;
            --text: #172033;
            --muted: #5b6781;
            --primary: #0059c9;
            --primary-soft: #e7f0ff;
            --line: #d9e1ef;
            --ok: #0a7f4f;
        }

        * { box-sizing: border-box; }

        body {
            margin: 0;
            font-family: "Segoe UI", "Helvetica Neue", Helvetica, sans-serif;
            color: var(--text);
            background: radial-gradient(circle at top right, #dbeaff 0%, var(--bg) 45%);
            line-height: 1.5;
        }

        .wrap {
            max-width: 980px;
            margin: 0 auto;
            padding: 32px 20px 48px;
        }

        .hero {
            background: linear-gradient(120deg, #0d2b52 0%, #0059c9 100%);
            color: #fff;
            border-radius: 16px;
            padding: 26px;
            box-shadow: 0 14px 40px rgba(13, 43, 82, 0.24);
        }

        .hero h1 { margin: 0 0 8px; font-size: 1.8rem; }
        .hero p { margin: 0; opacity: 0.95; }

        .grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
            margin-top: 18px;
        }

        .card {
            background: var(--card);
            border: 1px solid var(--line);
            border-radius: 12px;
            padding: 18px;
        }

        h2 { margin: 0 0 12px; font-size: 1.1rem; }
        h3 { margin: 0 0 8px; font-size: 1rem; }

        .muted { color: var(--muted); }

        .method {
            font-weight: 700;
            font-size: 0.8rem;
            display: inline-block;
            min-width: 60px;
            text-align: center;
            border-radius: 999px;
            padding: 4px 10px;
            margin-right: 8px;
            color: #fff;
            background: #1d4ed8;
        }

        .method.post { background: #006a4e; }
        .method.put { background: #b45309; }
        .method.delete { background: #b91c1c; }

        .endpoint {
            font-family: Consolas, Monaco, monospace;
            background: var(--primary-soft);
            padding: 2px 8px;
            border-radius: 6px;
            color: #0d2b52;
        }

        pre {
            margin: 10px 0 0;
            border-radius: 10px;
            background: #0f172a;
            color: #d1e5ff;
            padding: 12px;
            overflow: auto;
            font-size: 0.86rem;
        }

        code { font-family: Consolas, Monaco, monospace; }

        .ok {
            display: inline-block;
            font-size: 0.85rem;
            color: var(--ok);
            background: #e7fff3;
            border: 1px solid #b8f1d4;
            padding: 4px 8px;
            border-radius: 8px;
            margin-top: 8px;
        }

        @media (min-width: 900px) {
            .grid { grid-template-columns: 1fr 1fr; }
            .span-2 { grid-column: span 2; }
        }
    </style>
</head>
<body>
    <div class="wrap">
        <section class="hero">
            <h1>Smart Scheduler API</h1>
            <p>Base URL: <code>http://127.0.0.1:8000/api</code></p>
            <p class="muted">Open this page at <code>/api-docs</code>. Protected endpoints require a bearer token.</p>
            <span class="ok">Current server behavior verified: unauthenticated protected calls return 401 JSON</span>
        </section>

        <section class="grid">
            <article class="card span-2">
                <h2>Auth Flow</h2>
                <p class="muted">1) Register, 2) Login, 3) Send Authorization header: <code>Bearer your_token</code>.</p>
            </article>

            <article class="card">
                <h3><span class="method post">POST</span><span class="endpoint">/register</span></h3>
                <p class="muted">Create a new user and return token.</p>
<pre><code>{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}</code></pre>
            </article>

            <article class="card">
                <h3><span class="method post">POST</span><span class="endpoint">/login</span></h3>
                <p class="muted">Login with existing credentials and return token.</p>
<pre><code>{
  "email": "test@example.com",
  "password": "password123"
}</code></pre>
            </article>

            <article class="card span-2">
                <h2>Event Endpoints (Auth Required)</h2>
                <p><span class="method">GET</span><span class="endpoint">/events</span></p>
                <p><span class="method post">POST</span><span class="endpoint">/events</span></p>
                <p><span class="method">GET</span><span class="endpoint">/events/{id}</span></p>
                <p><span class="method put">PUT</span><span class="endpoint">/events/{id}</span></p>
                <p><span class="method delete">DELETE</span><span class="endpoint">/events/{id}</span></p>
            </article>

            <article class="card span-2">
                <h2>Notifications (Auth Required)</h2>
                <p><span class="method">GET</span><span class="endpoint">/notifications</span></p>
            </article>

            <article class="card span-2">
                <h2>cURL Quick Start</h2>
<pre><code># 1) Register
curl -X POST http://127.0.0.1:8000/api/register \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","password_confirmation":"password123"}'

# 2) Login
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3) Use token
curl http://127.0.0.1:8000/api/events \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"</code></pre>
            </article>
        </section>
    </div>
</body>
</html>
