import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private formatUptime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  getHello(): string {
    const uptime = this.formatUptime(process.uptime());
    const now = new Date().toLocaleString();
    const node = process.version;
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Auth Service • Health</title>
  <style>
    :root{--bg:#f6f7fb;--card:#fff;--accent:#16a34a;--muted:#6b7280}
    body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,#fbfdff, #f6f7fb);font-family:Inter,system-ui,Segoe UI,Roboto,'Helvetica Neue',Arial}
    .card{width:min(720px,94%);background:var(--card);border-radius:14px;box-shadow:0 8px 30px rgba(15,23,42,0.08);overflow:hidden;border:1px solid rgba(15,23,42,0.04)}
    .header{display:flex;align-items:center;gap:16px;padding:22px 24px;background:linear-gradient(90deg,#fef9ec,#fff);border-bottom:1px solid rgba(0,0,0,0.03)}
    .dot{width:46px;height:46px;border-radius:10px;background:linear-gradient(180deg,var(--accent),#0ea55d);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:18px;box-shadow:0 6px 18px rgba(22,163,74,0.14)}
    .title{font-size:18px;font-weight:700;color:#0f172a}
    .meta{margin-left:auto;color:var(--muted);font-size:13px}
    .body{padding:22px 24px;display:grid;grid-template-columns:1fr 220px;gap:18px}
    .left{display:flex;flex-direction:column;gap:12px}
    .status{display:inline-block;padding:8px 12px;border-radius:999px;background:rgba(22,163,74,0.12);color:var(--accent);font-weight:700}
    .row{display:flex;justify-content:space-between;gap:12px;padding:12px 16px;border-radius:10px;background:#fbfbfd;border:1px solid rgba(15,23,42,0.02)}
    .label{color:var(--muted);font-size:13px}
    .value{font-weight:700;color:#0f172a}
    .right{display:flex;flex-direction:column;gap:12px}
    .small{font-size:13px;color:var(--muted)}
    .refresh{display:inline-block;margin-top:8px;padding:8px 12px;border-radius:8px;background:#fff;border:1px solid rgba(15,23,42,0.04);cursor:pointer;font-weight:600}
    @media(max-width:720px){ .body{grid-template-columns:1fr; } .meta{display:none} }
  </style>
</head>
<body>
  <div class="card" role="region" aria-label="Auth service health card">
    <div class="header">
      <div class="dot">A</div>
      <div>
        <div class="title">Auth Service</div>
        <div class="small" style="margin-top:6px;color:#374151">Status: <span class="status">Healthy</span></div>
      </div>
      <div class="meta">Updated: ${now}</div>
    </div>
    <div class="body">
      <div class="left">
        <div class="row"><div class="label">Uptime</div><div class="value">${uptime}</div></div>
        <div class="row"><div class="label">Node</div><div class="value">${node}</div></div>
        <div class="row"><div class="label">Time</div><div class="value">${now}</div></div>
        <div style="margin-top:8px">
          <button class="refresh" onclick="location.reload()">Refresh</button>
          <span class="small" style="margin-left:10px">Auto-refresh every 30s</span>
        </div>
      </div>
      <div class="right" aria-hidden="false">
        <div style="padding:12px;border-radius:10px;background:linear-gradient(180deg,#fff,#fbfbfd);border:1px solid rgba(15,23,42,0.02);">
          <div class="small">Docs</div>
          <div style="margin-top:8px"><a href="/docs" style="color:#0366d6;text-decoration:none;font-weight:700">OpenAPI / Swagger</a></div>
        </div>
        <div style="padding:12px;border-radius:10px;background:linear-gradient(180deg,#fff,#fbfbfd);border:1px solid rgba(15,23,42,0.02);">
          <div class="small">Repository</div>
          <div style="margin-top:8px"><a href="#" style="color:#0366d6;text-decoration:none;font-weight:700">View on GitHub</a></div>
        </div>
      </div>
    </div>
  </div>
  <script>
    setTimeout(()=>location.reload(),30000);
  </script>
</body>
</html>`;
  }
}
