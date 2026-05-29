const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "FAQ", href: "#faq" },
      { label: "Pricing", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact"].map((label) => ({
      label,
      href: "#",
    })),
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Cookies", "Licenses"].map((label) => ({
      label,
      href: "#",
    })),
  },
  {
    title: "Resources",
    links: ["Documentation", "API Ref", "Community", "Support"].map(
      (label) => ({
        label,
        href: "#",
      }),
    ),
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner">
        <div className="landing-footer-brand">
          <div className="landing-footer-logo-row">
            <div className="landing-footer-logo">SG</div>
            <div>
              <span>StressGuard</span>
              <small>AI wellness companion</small>
            </div>
          </div>

          <p>
            Deteksi stress level dari pola tidur Anda menggunakan teknologi AI
            terdepan. Kesehatan Anda adalah prioritas kami.
          </p>
        </div>

        {footerGroups.map((group) => (
          <nav className="landing-footer-group" key={group.title}>
            <h4>{group.title}</h4>
            <ul>
              {group.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="landing-footer-bottom">
        <p>© {currentYear} StressGuard. All rights reserved.</p>
      </div>
    </footer>
  );
}
