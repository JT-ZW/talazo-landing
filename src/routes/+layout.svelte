<script>
  import '../app.css';
  import { page } from '$app/state';
  import { afterNavigate } from '$app/navigation';
  let { children } = $props();
  let menuOpen = $state(false);
  afterNavigate(() => { menuOpen = false; });
  const navigation = [
    { href: '/', label: 'Home' },
    { href: '/our-approach', label: 'Our approach' },
    { href: '/how-it-works', label: 'How it works' },
    { href: '/our-purpose', label: 'Our purpose' },
    { href: '/about', label: 'About us' }
  ];
</script>
<svelte:head><meta name="theme-color" content="#073e32" /></svelte:head>
<a class="skip" href="#main">Skip to content</a>
<div class="announcement">Rooted in Africa. Growing a more resilient future. <a href="/our-purpose">Discover our purpose <span>↗</span></a></div>
<header class="site-header">
  <a class="brand" href="/" aria-label="Talazo Agritech home"><img src="/images/talazo-logo-cropped.png" alt="Talazo Agritech" /></a>
  <button class="menu-toggle" aria-expanded={menuOpen} aria-controls="navigation" onclick={() => menuOpen = !menuOpen}>{menuOpen ? 'Close −' : 'Menu +'}</button>
  <nav id="navigation" class="primary-nav" class:open={menuOpen} aria-label="Main navigation">
    {#each navigation as link}<a href={link.href} aria-current={page.url.pathname === link.href ? 'page' : undefined} onclick={() => menuOpen = false}>{link.label}</a>{/each}
    <a class="button small" href="/join-pilot" aria-current={page.url.pathname === '/join-pilot' ? 'page' : undefined} onclick={() => menuOpen = false}>Join our pilot <span>↗</span></a>
  </nav>
</header>
<main id="main" tabindex="-1">{@render children()}</main>
<footer>
  <div class="footer-top"><a class="footer-name" href="/">Talazo<span>AGRITECH</span></a><p>Better decisions.<br />Stronger roots. Brighter futures.</p><a href="#main" class="back-top">Back to top ↑</a></div>
  <div class="footer-bottom"><span>© {new Date().getFullYear()} Talazo Agritech</span><span>African ingenuity. Agricultural possibility.</span></div>
</footer>
