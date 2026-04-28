import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "@/hooks/use-toast";
import dome from "@/assets/dome-jerusalem.jpg";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [show, setShow] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="min-h-screen w-full bg-surface-dim flex justify-center">
      <div className="relative w-full max-w-[420px] min-h-screen overflow-hidden flex flex-col bg-surface">
        {/* Hero */}
        <div className="relative h-[42vh] min-h-[300px] w-full">
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
              <h1 className="font-serif text-4xl font-bold text-primary mb-2">Join Thakira</h1>
              <p className="text-muted-foreground text-sm">
                Become a steward of living heritage.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                setSubmitting(true);
                const result = await register(email, password, displayName);
                setSubmitting(false);
                if (result.ok === false) {
                  setError(result.error);
                  toast({
                    title: "Registration Failed",
                    description: result.error,
                    variant: "destructive",
                  });
                  return;
                }
                toast({
                  title: "Welcome to Thakira",
                  description: "Your account has been created.",
                });
                navigate(result.redirect, { replace: true });
              }}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-xs font-medium text-primary/80 mb-2 ml-1 uppercase tracking-widest"
                >
                  Display Name
                </label>
                <div className="relative">
                  <Icon
                    name="person"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60"
                    size={20}
                  />
                  <input
                    id="displayName"
                    type="text"
                    required
                    minLength={2}
                    maxLength={60}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your storyteller name"
                    autoComplete="name"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-surface-high/60 ghost-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-primary/80 mb-2 ml-1 uppercase tracking-widest"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Icon
                    name="mail"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60"
                    size={20}
                  />
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
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-primary/80 mb-2 ml-1 uppercase tracking-widest"
                >
                  Password
                </label>
                <div className="relative">
                  <Icon
                    name="lock"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60"
                    size={20}
                  />
                  <input
                    id="password"
                    type={show ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
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
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-crimson/40 bg-crimson/10 px-4 py-3 text-xs uppercase tracking-widest text-crimson font-bold text-center"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center gap-2 py-4 rounded-full bg-primary text-primary-foreground font-serif font-bold text-base glow-gold hover:bg-primary-glow transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {submitting ? "Creating Account…" : "Create Account"}
                <Icon name="arrow_forward" size={20} />
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed">
              Already have credentials?{" "}
              <Link to="/login" className="text-secondary font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
