import Link from "next/link";

const footerLinks = ["Privacy Policy", "Terms of Service", "Contact", "Shipping"];
const socialIcons = ["public", "camera", "mail"];

export default function Footer() {
  return (
    <footer className="bg-surface-container-low w-full border-t border-outline-variant/30">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 py-10 w-full max-w-7xl mx-auto gap-8">
        <div className="text-center md:text-left">
          <Link href="/" className="font-headline text-lg text-on-surface">
            Atlas Beauty
          </Link>
          <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mt-2">
            © 2024 Atlas Beauty. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {footerLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="font-body text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-all opacity-80 hover:opacity-100"
            >
              {link}
            </a>
          ))}
          <Link
            href="/about"
            className="font-body text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-all opacity-80 hover:opacity-100"
          >
            About Us
          </Link>
        </div>

        <div className="flex gap-6">
          {socialIcons.map((icon) => (
            <span
              key={icon}
              className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              {icon}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
