export const JamLogo64x64 = () => {
  return (
    <div className="w-16 h-16 p-2 rounded-xl overflow-hidden ring-1 ring-gray-400/10 shadow-md">
      <img
        src="/icons/jam-logo-mark-full-color-for-light-background-128x128.png"
        className="block dark:hidden w-full h-full"
        alt="Jam Logo"
        width={64}
        height={64}
      />
      <img
        src="/icons/jam-logo-mark-full-color-for-dark-background-128x128.png"
        className="hidden dark:block w-full h-full"
        alt="Jam Logo"
        width={64}
        height={64}
      />
    </div>
  );
};
