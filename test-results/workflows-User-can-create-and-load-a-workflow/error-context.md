# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]: MindForge SaaS
    - generic [ref=e4]:
      - link "Dashboard" [ref=e5] [cursor=pointer]:
        - /url: /dashboard
      - link "Connections" [ref=e6] [cursor=pointer]:
        - /url: /connections
      - link "Settings" [ref=e7] [cursor=pointer]:
        - /url: /settings
      - button "Logout" [ref=e8]
  - main [ref=e9]:
    - generic [ref=e11]:
      - heading "Sign In" [level=2] [ref=e12]
      - textbox "Email" [ref=e13]
      - textbox "Password" [ref=e14]
      - button "Login" [ref=e15]
      - paragraph [ref=e16]:
        - text: Don’t have an account?
        - link "Sign up" [ref=e17] [cursor=pointer]:
          - /url: /signup
  - button "Open Next.js Dev Tools" [ref=e23] [cursor=pointer]:
    - img [ref=e24]
  - alert [ref=e27]
```