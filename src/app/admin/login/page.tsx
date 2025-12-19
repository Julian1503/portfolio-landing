import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Panel</h1>
          <p className="text-slate-600 text-sm">Sign in to manage your portfolio</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white shadow-lg rounded-2xl border border-slate-200",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "rounded-xl",
              formButtonPrimary: "bg-slate-900 hover:bg-slate-800 rounded-xl",
              formFieldInput: "rounded-xl",
              footerActionLink: "text-slate-900 hover:text-slate-700"
            }
          }}
        />
      </div>
    </main>
  );
}
