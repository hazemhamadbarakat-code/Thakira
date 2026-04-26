import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "@/hooks/use-toast";
import dome from "@/assets/dome-jerusalem.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full bg-surface-dim flex justify-center">
      <div className="relative w-full max-w-[420px] min-h-screen overflow-hidden flex flex-col bg-surface">
        {/* Hero */}
        <div className="relative h-[58vh] min-h-[420px] w-full">
          <img
            src={dome}
            alt="Golden Dome of the Rock in Jerusalem under a clear blue sky"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-surface" />
          <div className="absolute top-12 left-0 right-0 flex justify-center px-6">
            <div className="glass-strong px-6 py-4 rounded-full ghost-border shadow-elevated text-center animate-fade-in">
              <span className="block font-serif font-bold text-3xl text-primary tracking-[0.18em] text-shadow-gold">
                THAKIRA
              </span>
              <span className="block text-[10px] text-foreground/80 uppercase tracking-[0.3em] mt-1 font-semibold">
                Heritage Preserved
              </span>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="relative -mt-16 z-10 flex-1 px-6 pb-10 rounded-t-[2rem] bg-surface">
          <div className="max-w-md mx-auto pt-8">
            <div className="text-center mb-7">
              <h1 className="font-serif text-4xl font-bold text-primary mb-2">Welcome Back</h1>
              <p className="text-muted-foreground text-sm">Enter the gateway to your heritage.</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                const result = login(email, password);
                if (result.ok === false) {
                  setError(result.error);
                  toast({ title: "Access Denied", description: result.error, variant: "destructive" });
                  return;
                }
                toast({ title: "Welcome", description: "Credentials verified. Entering gateway." });
                navigate(result.redirect, { replace: true });
              }}
              className="space-y-5"
            >
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-primary/80 mb-2 ml-1 uppercase tracking-widest">
                  Email Address
                </label>
                <div className="relative">
                  <Icon name="mail" className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" size={20} />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-surface-high/60 ghost-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-primary/80 mb-2 ml-1 uppercase tracking-widest">
                  Password
                </label>
                <div className="relative">
                  <Icon name="lock" className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" size={20} />
                  <input
                    id="password"
                    type={show ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-surface-high/60 ghost-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-primary/60 hover:text-primary"
                    aria-label="Toggle password visibility"
                  >
                    <Icon name={show ? "visibility" : "visibility_off"} size={20} />
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <Link to="/recover" className="text-xs font-medium text-secondary hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {error && (
                <div role="alert" className="rounded-xl border border-crimson/40 bg-crimson/10 px-4 py-3 text-xs uppercase tracking-widest text-crimson font-bold text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-4 rounded-full bg-primary text-primary-foreground font-serif font-bold text-base glow-gold hover:bg-primary-glow transition-all active:scale-[0.98]"
              >
                Enter Gateway
                <Icon name="arrow_forward" size={20} />
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed">
              Access is restricted to provisioned heritage stewards.
              <br />
              Contact your <span className="text-secondary font-bold">Thakira Administrator</span> to request credentials.
            </p>

            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                aria-label="Sign in with Apple"
                className="w-12 h-12 rounded-full bg-surface-high ghost-border flex items-center justify-center hover:border-primary/40 transition-colors"
              >
                <Icon name="apple" className="text-foreground" size={22} />
              </button>
              <button
                aria-label="Sign in with Google"
                className="w-12 h-12 rounded-full bg-surface-high ghost-border flex items-center justify-center hover:border-primary/40 transition-colors"
              >
                <span className="font-serif font-bold text-foreground text-lg">G</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
