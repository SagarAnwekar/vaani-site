# Vaani help API

Stateless public website demo on Render Free. Python/FastAPI, OpenRouter free router.
Start: `uvicorn main:app --host 0.0.0.0 --port $PORT` in `help-api`.
Build: `pip install -r requirements.txt`.

Configure `OPENROUTER_API_KEY` privately in Render only. Public website endpoint:
https://vaani-help-api.onrender.com/ask

Default cap: 10 requests/day UTC, 8/IP/hour, 3/IP/minute, one upstream call at a time.
Limits are in-memory and reset on restart. Origin checks are not authentication and
cannot guarantee account quota isolation. OpenRouter quota is shared with Jerry.
No chat history saved. Questions go to Render, OpenRouter and a selected provider.
Do not submit customer, patient or bank details. FAQ handles API failures locally.

`HELP_API_URL` is a public repository Actions variable, not a secret.
The build workflow commits generated index.html but its GITHUB_TOKEN push does not
trigger branch GitHub Pages. Publish requires a normal owner commit after the build,
or a direct GitHub Pages artifact deployment workflow. No paid services configured.

The API rejects short classifier output and uses a 10-second upstream timeout.
