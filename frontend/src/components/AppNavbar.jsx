import { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton
} from "@/components/ui/resizable-navbar";
import { Heart, Brain, Activity } from "lucide-react";

const navItems = [
  {
    name: "Home",
    link: "#home"
  },
  {
    name: "Asesmen",
    link: "#assessment"
  },
  {
    name: "Dashboard",
    link: "#dashboard"
  },
  {
    name: "Journal",
    link: "#history"
  }
];

const landingNavItems = [
  {
    name: "Home",
    link: "#home"
  },
  {
    name: "Features",
    link: "#features"
  },
  {
    name: "FAQ",
    link: "#faq"
  }
];

export function AppNavbar({ health, showApp, onStart, currentUser, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const visibleItems = showApp
    ? navItems
    : landingNavItems;

  return (
    <Navbar className="top-4">
      <NavBody>
        <a href="#home" className="relative z-20 flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-full border border-black bg-white text-sm font-black">
            SG
          </div>

          <div className="grid leading-tight">
            <span className="font-sora text-sm font-black text-black">
              StressGuard
            </span>
            <span className="text-xs font-semibold text-neutral-500">
              AI wellness companion
            </span>
          </div>
        </a>

        <NavItems items={visibleItems} />

        <div className="relative z-20 flex items-center gap-3">

          {!showApp ? (
            <NavbarButton as="button" variant="dark" onClick={onStart} className="font-bold transition-all hover:shadow-lg">
              Sign Up
            </NavbarButton>
          ) : (
            <>
              <NavbarButton href="#assessment" variant="dark" className="font-bold transition-all hover:shadow-lg">
                Cek Stres
              </NavbarButton>
              {currentUser && (
                <button
                  onClick={onLogout}
                  className="relative z-20 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-red-600 hover:shadow-lg"
                  aria-label="Logout"
                >
                  Logout
                </button>
              )}
            </>
          )}
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <a href="#home" className="flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-full border border-black bg-white text-sm font-black">
              SG
            </div>

            <div className="grid leading-tight">
              <span className="text-sm font-black text-black">
                StressGuard
              </span>
              <span className="text-xs font-semibold text-neutral-500">
                AI wellness
              </span>
            </div>
          </a>

          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((value) => !value)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {visibleItems.map((item) => (
            <a
              key={item.name}
              href={item.link}
              className="w-full rounded-lg px-3 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}

          <button
            type="button"
            className="w-full rounded-lg bg-black px-3 py-3 text-sm font-bold text-white"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onStart();
            }}
          >
            {!showApp ? "Sign Up" : "Mulai Asesmen"}
          </button>

          {showApp && currentUser && (
            <button
              type="button"
              className="w-full rounded-lg bg-red-500 px-3 py-3 text-sm font-bold text-white"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLogout();
              }}
            >
              Logout
            </button>
          )}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}