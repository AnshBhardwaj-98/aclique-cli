export default function AuthCompletePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white px-4">
      <div className="bg-neutral-900/70 backdrop-blur-xl border border-neutral-800 rounded-2xl p-10 w-full max-w-md shadow-2xl animate-fadeIn">
        <div className="text-6xl mb-6 text-green-400 text-center">✔</div>

        <h1 className="text-3xl font-semibold text-center mb-3 text-green-600">
          Authorization Successful
        </h1>

        <p className="text-neutral-400 text-center leading-relaxed">
          You may now return to your terminal. The CLI has been authorized and
          is ready to continue.
        </p>
      </div>

      <p className="text-neutral-600 text-sm mt-6 ">
        Aclique CLI • Secure Authorization
      </p>
    </div>
  );
}
