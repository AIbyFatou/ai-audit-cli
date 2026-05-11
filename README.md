# 🔍 AI Audit CLI

> *"You built it with Lovable. Now make sure it doesn't break."*

Open source CLI tool that automatically analyzes the security of a Supabase GitHub repo and generates a report with a score out of 100.

---

## 🚨 The Problem

Vibe coding (Lovable, Bolt, Cursor) lets you build in a matter of hours.
But the generated code often exposes critical vulnerabilities:

- Supabase keys visible in the repo
- `.env` not protected in `.gitignore`
- No testing environment
- RLS policies not configured

**AI Audit CLI detects all of this automatically.**

---

## ⚙️ Installation

```bash
git clone https://github.com/AIbyFatou/ai-audit-cli.git
cd ai-audit-cli
npm install
```

---

## 🚀 Usage

```bash
npx ts-node index.ts https://github.com/user/my-repo
```

---

## ✅ Checks Performed

| Check | Points | Description |
|-------|--------|-------------|
| `.gitignore` contains `.env` | 25/100 | Verifies that secrets are protected |
| `.env` not exposed | 25/100 | Verifies that no `.env` file is in the repo |
| `supabase` folder present | 25/100 | Verifies Supabase configuration |
| Testing environment present | 25/100 | Verifies the presence of tests |

---

## 📊 Score

| Score | Verdict |
|-------|---------|
| 100/100 | 🟢 EXCELLENT — Production ready! |
| 75/100 | 🟡 GOOD — Minor issues to fix |
| 50/100 | 🟠 SERIOUS — Fix before deploying |
| 25/100 | 🔴 CRITICAL — Major security issues |
| 0/100 | 🔴 DANGER — Do not deploy! |

---

## 👩🏿 Author

**Fatou Cissé** — QA Engineer for the AI era

[LinkedIn](https://www.linkedin.com/in/fatou-cisse-developpement-web-fullstack/) | [aibyfatou.com](https://aibyfatou.com)

*The AI Plumber businesses need.*