const FAQS = [
  {
    q: 'What is HRJ Board?',
    a: 'HRJ Board is a free, real-time kanban board for teams. It combines project boards, drag-and-drop task cards, and instant team invites so everyone can plan and track work together.',
  },
  {
    q: 'Is HRJ Board free to use?',
    a: 'Yes. You can register, create projects, invite your team, and use every board feature at no cost.',
  },
  {
    q: 'How do I invite my team to a project?',
    a: 'Open a project, click the members icon, and copy the invite link. Anyone who opens it is guided to sign up (or log in) and dropped straight onto the board.',
  },
  {
    q: 'Does HRJ Board update in real time?',
    a: 'Yes. HRJ Board uses WebSockets (Socket.io) so every card move, edit, or new teammate appears instantly for everyone viewing the project - no page refresh needed.',
  },
  {
    q: 'Can I export my board data?',
    a: 'Yes. Use the "Copy for Sheets" button on any project to copy every item as a table, then paste it directly into Google Sheets or Excel.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function FAQ() {
  return (
    <section
      id="faq"
      className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/40 sm:py-20"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>

        <div className="mt-10 space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="card group p-4 open:shadow-md">
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h3 className="flex items-center justify-between gap-3 text-base font-medium text-slate-900 dark:text-slate-100">
                  {f.q}
                  <span className="shrink-0 text-slate-400 transition-transform group-open:rotate-45">+</span>
                </h3>
              </summary>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </section>
  );
}
