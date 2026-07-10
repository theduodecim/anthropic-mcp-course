import mermaid from 'mermaid'
import './styles.css'

const repoUrl = 'https://github.com/theduodecim/anthropic-mcp-course'
const notesUrl = `${repoUrl}/tree/main/notes`
const readmeUrl = `${repoUrl}/blob/main/README.md`

const lessons = [
  { number: '01', title: 'Introducing MCP', file: '01-introducing-mcp.md', description: 'Understand why MCP exists, the integration problem it solves, and the basic client-server architecture.' },
  { number: '02', title: 'MCP Clients', file: '02-mcp-clients.md', description: 'Explore how MCP clients discover tools, access resources, use prompts, and stay transport agnostic.' },
  { number: '03', title: 'Defining Tools with MCP', file: '03-defining-tools-with-mcp.md', description: 'Create server-side tools with FastMCP decorators, type hints, validation, and generated schemas.' },
  { number: '04', title: 'MCP Inspector', file: '04-mcp-inspector.md', description: 'Test and debug MCP servers through the browser-based inspector before wiring up full clients.' },
  { number: '05', title: 'Implementing an MCP Client', file: '05-implementing-an-mcp-client.md', description: 'Build a custom client wrapper that manages sessions, lists tools, executes calls, and cleans up safely.' },
  { number: '06', title: 'Defining Resources', file: '06-defining-resources.md', description: 'Expose read-only data through resource URIs so applications can inject context without tool calls.' },
  { number: '07', title: 'Accessing Resources', file: '07-accessing-resources.md', description: 'Implement resource mention workflows that fetch document content and place it directly into model context.' },
  { number: '08', title: 'Defining Prompts', file: '08-defining-prompts.md', description: 'Package reusable prompt templates as server-provided AI workflows for consistent outcomes.' },
  { number: '09', title: 'Prompts in the Client', file: '09-prompts-in-the-client.md', description: 'Add prompt discovery, argument passing, and generated message handling to the MCP client.' },
  { number: '10', title: 'MCP Fundamentals Assessment Quiz Results', file: '10-MCP Fundamentals - Assessment Quizz Results.md', description: 'Celebrate a 100% final assessment score and a complete grasp of MCP fundamentals.', achievement: true },
]

const topics = ['Clients', 'Servers', 'Resources', 'Tools', 'Prompts', 'Sampling', 'Transports']
const tech = ['Python', 'Claude', 'Anthropic', 'MCP', 'AI Agents', 'FastMCP', 'uv', 'Docker']

const noteLink = (file) => `${repoUrl}/blob/main/notes/${encodeURIComponent(file).replaceAll('%2F', '/')}`

const app = document.querySelector('#app')
app.innerHTML = `
  <div class="orb orb-one"></div><div class="orb orb-two"></div>
  <header class="site-header">
    <a class="brand" href="#top" aria-label="Anthropic MCP Course home"><span>MCP</span> Course</a>
    <nav><a href="#overview">Overview</a><a href="#architecture">Architecture</a><a href="#roadmap">Roadmap</a><a href="#topics">Topics</a></nav>
  </header>
  <main id="top">
    <section class="hero reveal">
      <div class="hero-copy">
        <p class="eyebrow">Professional MCP learning portal</p>
        <h1>Anthropic MCP Course</h1>
        <p class="subtitle">Hands-on implementations and notes about Anthropic's Model Context Protocol (MCP).</p>
        <div class="actions">
          <a class="button primary" href="${repoUrl}" target="_blank" rel="noreferrer">GitHub Repository</a>
          <a class="button" href="${readmeUrl}" target="_blank" rel="noreferrer">README</a>
          <a class="button" href="${notesUrl}" target="_blank" rel="noreferrer">Notes</a>
        </div>
      </div>
      <div class="hero-art" aria-hidden="true">
        <svg viewBox="0 0 520 420" role="img"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#ff9f6e"/><stop offset="1" stop-color="#8ab4ff"/></linearGradient></defs><rect x="56" y="58" width="408" height="294" rx="34" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.22)"/><circle cx="160" cy="170" r="62" fill="url(#g)" opacity=".9"/><path d="M244 148h118M244 196h86M116 278h288" stroke="#fff" stroke-width="18" stroke-linecap="round" opacity=".75"/><path d="M111 95c90-52 214-50 300 5" fill="none" stroke="url(#g)" stroke-width="7" stroke-linecap="round"/></svg>
      </div>
    </section>

    <section id="overview" class="section reveal"><p class="eyebrow">Overview</p><h2>Practical MCP implementations, experiments, and documentation.</h2><p class="lede">This repository documents a structured journey through the Model Context Protocol: client responsibilities, server primitives, tools, resources, prompts, debugging workflows, and a working CLI implementation that connects these concepts in practice.</p></section>

    <section id="architecture" class="section grid-two reveal"><div><p class="eyebrow">Architecture</p><h2>From Claude to external tools through a standard protocol.</h2><p>The course emphasizes MCP as the connective layer between AI applications and specialized servers that expose reusable capabilities.</p></div><div class="glass diagram"><pre class="mermaid">flowchart TD\n  A[Claude] --> B[MCP Client]\n  B --> C[MCP Server]\n  C --> D[External Tools]</pre></div></section>

    <section class="section reveal"><p class="eyebrow">Repository sections</p><h2>Start with the source material.</h2><div class="cards two"><a class="card" href="${readmeUrl}" target="_blank" rel="noreferrer"><span>Documentation</span><h3>README.md</h3><p>Project structure, setup instructions, and the CLI application overview.</p></a><a class="card" href="${notesUrl}" target="_blank" rel="noreferrer"><span>Course notes</span><h3>notes/</h3><p>Lesson-by-lesson markdown notes for the MCP learning path.</p></a></div></section>

    <section id="roadmap" class="section reveal"><p class="eyebrow">Course roadmap</p><h2>A progressive path from MCP fundamentals to implementation mastery.</h2><div class="roadmap">${lessons.map(lesson => `<a class="lesson ${lesson.achievement ? 'achievement' : ''}" href="${noteLink(lesson.file)}" target="_blank" rel="noreferrer"><div class="lesson-number">${lesson.achievement ? '🏆' : lesson.number}</div><div><h3>${lesson.title}</h3><p>${lesson.description}</p><small>${lesson.file}</small></div></a>`).join('')}</div></section>

    <section class="section reveal"><p class="eyebrow">Technologies</p><h2>Built around modern AI engineering tools.</h2><div class="badges">${tech.map(item => `<span>${item}</span>`).join('')}</div></section>

    <section id="topics" class="section reveal"><p class="eyebrow">Learning topics</p><h2>Core MCP primitives and runtime concepts.</h2><div class="cards topics">${topics.map(topic => `<article class="card topic"><h3>${topic}</h3><p>${topic === 'Sampling' ? 'Model-assisted server workflows.' : `Foundational MCP ${topic.toLowerCase()} patterns.`}</p></article>`).join('')}</div></section>
  </main>
  <footer>Built by Juan Sebastian Cabrera</footer>
`


const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) entry.target.classList.add('visible')
}), { threshold: 0.14 })

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element))

mermaid.initialize({ startOnLoad: true, theme: 'dark', securityLevel: 'loose' })
