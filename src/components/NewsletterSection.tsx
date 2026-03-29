"use client";

export default function NewsletterSection() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-4xl mx-auto bg-surface-container-low rounded-lg p-12 md:p-20 text-center relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-4xl font-headline mb-4">Join the Inner Circle</h2>
          <p className="font-body text-on-surface-variant mb-10 max-w-md mx-auto">
            Receive editorial insights, exclusive previews of new arrivals, and
            invitations to our virtual rituals.
          </p>

          <form
            className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto"
            onSubmit={(e) => e.preventDefault()}
            suppressHydrationWarning
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-surface-container-high border-b-2 border-primary border-t-0 border-x-0 focus:ring-0 focus:border-primary px-4 py-4 font-body text-sm text-on-surface placeholder:text-on-surface-variant/50"
            />
            <button
              type="submit"
              className="bg-primary text-on-primary px-10 py-4 rounded-lg font-bold hover:scale-95 transition-transform uppercase tracking-widest text-xs font-body"
            >
              Subscribe
            </button>
          </form>

          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 mt-6 font-body">
            By subscribing, you agree to our privacy policy.
          </p>
        </div>
      </div>
    </section>
  );
}
